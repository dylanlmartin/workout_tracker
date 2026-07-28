#!/usr/bin/env node
/**
 * Test runner.
 *
 *   node tests/run.js            run everything
 *   node tests/run.js substit    run suites whose name contains "substit"
 *
 * Exits non-zero if any assertion fails, so it can gate a merge.
 */

const { chromium } = require('playwright');
const { startServer } = require('./harness');
const { suites } = require('./suites');

const CHROMIUM = process.env.CHROMIUM_PATH || undefined;

function makeCollector(suiteName) {
    const results = [];
    return {
        results,
        equal(actual, expected, msg, detail) {
            const pass = Object.is(actual, expected);
            results.push({
                pass, msg,
                detail: pass ? null : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` +
                    (detail ? ` | ${JSON.stringify(detail)}` : '')
            });
        },
        ok(cond, msg, detail) {
            results.push({
                pass: !!cond, msg,
                detail: cond ? null : (detail !== undefined ? JSON.stringify(detail) : 'expected truthy')
            });
        },
        skip(msg) {
            results.push({ pass: true, skipped: true, msg, detail: null });
        }
    };
}

(async () => {
    const filter = process.argv[2];
    const { server, port } = await startServer();
    const baseUrl = `http://127.0.0.1:${port}`;

    let browser;
    try {
        browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {});
    } catch (err) {
        console.error('Could not launch Chromium. Set CHROMIUM_PATH to a Chromium binary.');
        console.error(String(err.message).split('\n')[0]);
        server.close();
        process.exit(2);
    }

    let passed = 0, failed = 0, skipped = 0;
    const failures = [];

    for (const s of suites) {
        if (filter && !s.name.includes(filter)) continue;
        const t = makeCollector(s.name);
        let crashed = null;
        try {
            await s.fn({ browser, baseUrl, t });
        } catch (err) {
            crashed = err;
        }

        console.log(`\n${s.name}`);
        for (const r of t.results) {
            if (r.skipped) {
                skipped++;
                console.log(`  SKIP  ${r.msg}`);
            } else if (r.pass) {
                passed++;
                console.log(`  ok    ${r.msg}`);
            } else {
                failed++;
                console.log(`  FAIL  ${r.msg}`);
                console.log(`        ${r.detail}`);
                failures.push(`${s.name}: ${r.msg} (${r.detail})`);
            }
        }
        if (crashed) {
            failed++;
            console.log(`  ERROR ${crashed.message.split('\n')[0]}`);
            failures.push(`${s.name}: threw ${crashed.message.split('\n')[0]}`);
        }
    }

    await browser.close();
    server.close();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ''}`);
    if (failures.length) {
        console.log('\nFailures:');
        failures.forEach(f => console.log(`  - ${f}`));
    }
    process.exit(failed ? 1 : 0);
})();
