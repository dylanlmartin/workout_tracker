/**
 * Test harness: static server + headless Chromium + app bootstrap helpers.
 *
 * The suites drive the REAL index.html / app.js / data.js. Nothing is copied
 * or reimplemented here, so a test failing means the app is wrong, not the
 * harness. Google APIs are stubbed because the app is expected to work fully
 * offline against localStorage.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
};

function startServer(port = 0) {
    const server = http.createServer((req, res) => {
        const urlPath = req.url.split('?')[0];
        const filePath = path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath);
        // Keep the served tree inside the repo
        if (!filePath.startsWith(ROOT)) {
            res.writeHead(403);
            return res.end('forbidden');
        }
        fs.readFile(filePath, (err, buf) => {
            if (err) {
                res.writeHead(404);
                return res.end('not found');
            }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
            res.end(buf);
        });
    });
    return new Promise(resolve => {
        server.listen(port, () => resolve({ server, port: server.address().port }));
    });
}

/**
 * Everything that must exist before app.js runs: browser APIs the app touches
 * that headless Chromium either lacks or that would block the run.
 */
const BOOTSTRAP = `
window.__alerts = [];
window.__confirms = [];
window.__confirmReply = false;
window.alert = (msg) => { window.__alerts.push(String(msg)); };
window.confirm = (msg) => { window.__confirms.push(String(msg)); return window.__confirmReply; };

window.__notifications = [];
class FakeNotification {
    constructor(title, opts) { window.__notifications.push({ title, body: opts && opts.body }); }
    static permission = 'granted';
    static requestPermission() { return Promise.resolve('granted'); }
}
window.Notification = FakeNotification;

// Wake lock is not available in headless; the app must tolerate its absence.
if (!navigator.wakeLock) {
    Object.defineProperty(navigator, 'wakeLock', {
        configurable: true,
        value: { request: () => Promise.resolve({ release: () => Promise.resolve(), addEventListener() {} }) }
    });
}

// Service worker registration is irrelevant to these suites. Both register()
// and ready must resolve, because the app awaits them before restoring an
// in-progress workout - leaving them pending would stall that path.
if (navigator.serviceWorker) {
    const fakeReg = { active: {}, scope: '/', showNotification: () => Promise.resolve() };
    navigator.serviceWorker.register = () => Promise.resolve(fakeReg);
    Object.defineProperty(navigator.serviceWorker, 'ready', {
        configurable: true,
        get: () => Promise.resolve(fakeReg)
    });
}

// Unauthenticated: the app must work entirely against localStorage.
window.gapi = { load: () => {}, client: { init: () => Promise.resolve(), setToken() {}, getToken: () => null } };
window.google = { accounts: { oauth2: { initTokenClient: () => ({ requestAccessToken() {} }), revoke() {} } } };
`;

async function newAppPage(browser, baseUrl, { seedLocalStorage, confirmReply = false } = {}) {
    const page = await browser.newPage({ viewport: { width: 402, height: 874 } });
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    page.__errors = pageErrors;

    // Keep the run hermetic: Google's SDKs are stubbed, so block the real
    // requests rather than waiting on the network for scripts we ignore.
    await page.route('**/*', route => {
        const url = route.request().url();
        if (url.includes('accounts.google.com') || url.includes('apis.google.com')) {
            return route.abort();
        }
        return route.continue();
    });

    await page.addInitScript(BOOTSTRAP);
    // Init scripts re-run on every navigation, so the reply has to be baked in
    // here rather than set once via evaluate - a reload would reset it.
    await page.addInitScript(`window.__confirmReply = ${confirmReply === true};`);
    if (seedLocalStorage) {
        await page.addInitScript(`(${seedLocalStorage.toString()})();`);
    }
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    // app.js declares AppState/UI with `const`, which creates script-scoped
    // bindings rather than properties of `window` - so probe them bare.
    await page.waitForFunction(() => typeof AppState !== 'undefined' && typeof UI !== 'undefined');
    return page;
}

/** Start a workout by id, as a user tap would. */
async function startWorkout(page, workoutId, isOptional = false) {
    await page.evaluate(async ({ workoutId, isOptional }) => {
        await WorkoutController.startWorkout(workoutId, isOptional);
    }, { workoutId, isOptional });
    await page.waitForSelector('[data-exercise-index="0"]');
}

/** Complete a reps-type set through the real UI path. */
async function completeRepsSet(page, exerciseIndex, setNum, reps, weight) {
    await page.evaluate(({ exerciseIndex, setNum, reps, weight }) => {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const row = card.querySelector(`.set-row[data-set="${setNum}"]`);
        row.querySelector('.reps-input').value = String(reps);
        row.querySelector('.weight-input').value = String(weight);
        const cb = row.querySelector('.set-checkbox');
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, { exerciseIndex, setNum, reps, weight });
}

/** Uncheck a previously completed reps set through the real UI path. */
async function uncheckRepsSet(page, exerciseIndex, setNum) {
    await page.evaluate(({ exerciseIndex, setNum }) => {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const row = card.querySelector(`.set-row[data-set="${setNum}"]`);
        const cb = row.querySelector('.set-checkbox');
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, { exerciseIndex, setNum });
}

/** Complete a duration set through the real UI path. */
async function completeDurationSet(page, exerciseIndex, setNum, value) {
    await page.evaluate(({ exerciseIndex, setNum, value }) => {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const row = card.querySelector(`.duration-set-row[data-set="${setNum}"]`);
        row.querySelector('.duration-input').value = String(value);
        const cb = row.querySelector('.set-checkbox');
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, { exerciseIndex, setNum, value });
}

/** Find the index of the first exercise of a given type in a workout. */
async function indexOfType(page, workoutId, type, isOptional = false) {
    return page.evaluate(({ workoutId, type, isOptional }) => {
        const w = isOptional ? getOptionalWorkout(workoutId) : getWorkout(workoutId);
        return w.exercises.findIndex(e => (e.exerciseType || 'reps') === type);
    }, { workoutId, type, isOptional });
}

module.exports = {
    ROOT,
    startServer,
    newAppPage,
    startWorkout,
    completeRepsSet,
    uncheckRepsSet,
    completeDurationSet,
    indexOfType
};
