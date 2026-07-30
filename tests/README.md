# Tests

Regression tests for the workout tracker. They drive the **real** `index.html`,
`app.js` and `data.js` in headless Chromium — nothing is reimplemented here, so
a failure means the app is wrong, not the harness.

## Running

```bash
npm install          # once, installs playwright
npm test             # run everything
node tests/run.js substit   # run suites whose name contains "substit"
```

If Chromium is not on the default Playwright path, point at it:

```bash
CHROMIUM_PATH=/path/to/chromium npm test
```

The runner exits non-zero on any failure, so it can gate a merge.

## Layout

| file | purpose |
|---|---|
| `run.js` | runner, assertion collector, CLI filter |
| `harness.js` | static server, browser stubs, helpers that click through the UI |
| `suites.js` | the tests themselves |

Most suites run **unauthenticated**, against localStorage. The Sheets suites
pass `{ authenticated: true }` to `newAppPage`, which swaps in an in-memory
stand-in for the Sheets API (`values.get` / `values.append` /
`spreadsheets.get` / `batchUpdate`) so the real write and row-deletion paths
are exercised. Either way Google's SDKs are stubbed and network requests to
them are blocked, so the run is hermetic and needs no credentials.

## What is covered

- **workout data** — every exercise in `data.js` has a valid set count, rest
  value and exercise type; no workout repeats an exercise name
- **total volume** — duration (`"45s"`) and completion (`"Completed"`) sets
  contribute 0 instead of turning the whole total into `NaN`, which reached the
  Sheets summary as a blank Total Volume cell
- **rest timer** — no countdown for a `rest: 0` exercise (which used to flash
  the timer then fire a bogus "Rest Complete"), a real countdown otherwise, and
  the progress bar never gets a `NaN%` width
- **persistence** — unchecking a set is written to localStorage, so it does not
  come back as completed after reopening the app
- **substitutions** — completed sets stay checked and locked when a card is
  rebuilt, and a custom name containing quotes or tags renders literally
- **previous performance** — history attaches to the movement actually
  performed, for both the Sheets and localStorage history shapes
- **restore in-progress** — a saved workout comes back with its sets checked,
  filled and locked
- **sheets logging** — completing a set appends a row and unchecking it deletes
  that row again, for all three exercise types, without disturbing neighbouring
  rows. Also covers substituted names, an undo racing its own append,
  removing an exercise withdrawing every row it logged, and unchecking while
  signed out
- **resilience** — a saved workout whose type no longer exists in `data.js`
  neither crashes the history view nor blocks app boot

## Adding a test

Add a `suite('name', async ({ browser, baseUrl, t }) => { ... })` block in
`suites.js`. Use `t.equal(actual, expected, message)` or
`t.ok(condition, message)`. Prefer driving the UI through the helpers in
`harness.js` (`startWorkout`, `completeRepsSet`, `completeDurationSet`, …) over
calling internals, so the test exercises the same path a user does.

When fixing a bug, write the failing test first and confirm it fails for the
right reason — then fix. Reverting the fix should turn the test red again.
