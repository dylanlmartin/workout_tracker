/**
 * Test suites for the workout tracker.
 *
 * Each test drives the real application code. Group names map to the areas
 * that have historically broken: exercise types, substitutions, the rest
 * timer, persistence, and workout history.
 */

const {
    newAppPage,
    sheetRows,
    startWorkout,
    completeRepsSet,
    uncheckRepsSet,
    completeDurationSet,
    indexOfType
} = require('./harness');

/**
 * Each suite receives ({ browser, baseUrl, t }) where `t` collects assertions.
 */
const suites = [];
const suite = (name, fn) => suites.push({ name, fn });

// ---------------------------------------------------------------------------
// Workout data integrity - cheap checks that catch bad edits to data.js
// ---------------------------------------------------------------------------
suite('workout data', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    const data = await page.evaluate(() => {
        const all = { ...WORKOUTS, ...(typeof OPTIONAL_WORKOUTS !== 'undefined' ? OPTIONAL_WORKOUTS : {}) };
        const problems = { missingSets: [], badType: [], dupNames: [], negativeRest: [] };
        const VALID = ['reps', 'duration', 'completion'];
        for (const [id, w] of Object.entries(all)) {
            const seen = {};
            w.exercises.forEach((e, i) => {
                if (typeof e.sets !== 'number' || e.sets < 1) problems.missingSets.push(`${id}[${i}] ${e.name}`);
                if (e.exerciseType && !VALID.includes(e.exerciseType)) problems.badType.push(`${id}[${i}] ${e.name}`);
                if (typeof e.rest !== 'number' || e.rest < 0) problems.negativeRest.push(`${id}[${i}] ${e.name}`);
                if (seen[e.name] !== undefined) problems.dupNames.push(`${id} "${e.name}"`);
                seen[e.name] = i;
            });
        }
        return problems;
    });

    t.equal(data.missingSets.length, 0, 'every exercise has a positive numeric set count', data.missingSets);
    t.equal(data.badType.length, 0, 'every exerciseType is one of reps/duration/completion', data.badType);
    t.equal(data.negativeRest.length, 0, 'every exercise has a non-negative numeric rest', data.negativeRest);
    // Duplicate names inside one workout break index/name lookups in
    // finishWorkout and updateWorkoutProgress.
    t.equal(data.dupNames.length, 0, 'no workout repeats an exercise name', data.dupNames);

    await page.close();
});

// ---------------------------------------------------------------------------
// Training plans
// ---------------------------------------------------------------------------
suite('plans', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    // Registry integrity: adding a plan with a typo'd id, or adding a workout
    // and forgetting to list it in a plan, both leave it unreachable.
    const integrity = await page.evaluate(() => {
        const unresolved = [];
        const seen = {};
        const duplicated = [];
        Object.values(PLANS).forEach(plan => {
            (plan.workouts || []).forEach(id => {
                if (!getWorkout(id)) unresolved.push(`${plan.id} -> ${id}`);
                if (seen[id]) duplicated.push(id); else seen[id] = true;
            });
            (plan.optionalWorkouts || []).forEach(id => {
                if (!getOptionalWorkout(id)) unresolved.push(`${plan.id} -> ${id}`);
                if (seen[id]) duplicated.push(id); else seen[id] = true;
            });
        });
        const orphaned = [...Object.keys(WORKOUTS), ...Object.keys(OPTIONAL_WORKOUTS)]
            .filter(id => !getPlanForWorkout(id));
        return { unresolved, duplicated, orphaned };
    });
    t.equal(integrity.unresolved.length, 0, 'every workout id listed by a plan resolves', integrity.unresolved);
    t.equal(integrity.duplicated.length, 0, 'no workout is claimed by two plans', integrity.duplicated);
    t.equal(integrity.orphaned.length, 0, 'every defined workout belongs to a plan', integrity.orphaned);

    // The home screen shows the active plan's workouts.
    const home = await page.evaluate(() => ({
        plan: AppState.currentPlan,
        mainCards: [...document.querySelectorAll('#main-workout-grid .workout-card')].map(c => c.dataset.workoutId),
        optionalCards: document.querySelectorAll('#optional-workout-grid .workout-card').length,
        pickerHidden: document.getElementById('plan-picker').classList.contains('hidden'),
        planCount: getAllPlans().length
    }));
    t.equal(home.plan, 'upper_lower', 'the default plan is active on first load');
    t.equal(home.mainCards.join(','), getPlanIds(), 'the grid lists the active plan\'s workouts in order');
    t.ok(home.optionalCards > 0, 'the plan\'s optional workouts render', home.optionalCards);
    // A dropdown offering one choice is noise.
    t.equal(home.pickerHidden, home.planCount < 2, 'the picker is hidden only while a single plan exists');

    function getPlanIds() { return 'upper_a,lower_a,upper_b,lower_b'; }

    // Ids must stay globally resolvable regardless of the active plan: they
    // are written to the sheet and to localStorage history, so scoping them
    // per plan would orphan every past workout.
    const resolvable = await page.evaluate(() => ({
        main: !!getWorkout('lower_b'),
        optional: !!getOptionalWorkout('zone2_cardio')
    }));
    t.equal(resolvable.main, true, 'a main workout id resolves globally');
    t.equal(resolvable.optional, true, 'an optional workout id resolves globally');

    await page.close();
});

suite('plan switching', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    // Register a second plan at runtime so the switching mechanism is tested
    // independently of which plans happen to ship.
    await page.evaluate(() => {
        PLANS.test_plan = {
            id: 'test_plan',
            name: 'Test Plan',
            description: 'A second plan',
            focus: 'Testing',
            workouts: ['upper_b'],
            optionalWorkouts: []
        };
        UI.renderPlanPicker();
    });

    const picker = await page.evaluate(() => ({
        hidden: document.getElementById('plan-picker').classList.contains('hidden'),
        options: [...document.querySelectorAll('#plan-select option')].map(o => o.value)
    }));
    t.equal(picker.hidden, false, 'the picker appears once a second plan exists');
    // Asserted against the live registry rather than a hardcoded list, so
    // adding a plan does not falsely fail this.
    const planIds = await page.evaluate(() => getAllPlans().map(p => p.id));
    t.equal(picker.options.join(','), planIds.join(','), 'the picker lists every plan', picker.options);
    t.ok(picker.options.includes('test_plan'), 'including one registered at runtime', picker.options);

    await page.evaluate(() => UI.setActivePlan('test_plan'));
    const switched = await page.evaluate(() => ({
        active: AppState.currentPlan,
        cards: [...document.querySelectorAll('#main-workout-grid .workout-card')].map(c => c.dataset.workoutId),
        persisted: localStorage.getItem('workout_tracker_active_plan'),
        optionalHidden: document.querySelector('.optional-workouts-section').classList.contains('hidden'),
        description: document.getElementById('plan-description').textContent.trim()
    }));
    t.equal(switched.active, 'test_plan', 'switching sets the active plan');
    t.equal(switched.cards.join(','), 'upper_b', 'the grid shows only the new plan\'s workouts', switched.cards);
    t.equal(switched.persisted, 'test_plan', 'the selection is persisted');
    // Otherwise an empty "Optional Workouts" heading hangs below the grid.
    t.equal(switched.optionalHidden, true, 'a plan with no optional workouts hides that section');
    t.equal(switched.description, 'A second plan', 'the picker shows the active plan description');

    // Starting a workout from the other plan must still work, since ids are global.
    await startWorkout(page, 'upper_a');
    const started = await page.evaluate(() => ({
        onWorkout: document.getElementById('workout-view').classList.contains('active'),
        title: document.getElementById('workout-title').textContent
    }));
    t.equal(started.onWorkout, true, 'a workout from another plan still starts');
    t.ok(started.title.length > 0, 'its title resolves', started.title);

    await page.close();
});

suite('plan selection survives reload', async ({ browser, baseUrl, t }) => {
    const seed = function () {
        localStorage.setItem('workout_tracker_active_plan', 'upper_lower');
    };
    const page = await newAppPage(browser, baseUrl, { seedLocalStorage: seed });
    const restored = await page.evaluate(() => AppState.currentPlan);
    t.equal(restored, 'upper_lower', 'a saved plan is restored on load');

    // A plan removed from the code must not leave the home screen empty.
    const stale = function () {
        localStorage.setItem('workout_tracker_active_plan', 'plan_that_was_deleted');
    };
    const page2 = await newAppPage(browser, baseUrl, { seedLocalStorage: stale });
    const fallback = await page2.evaluate(() => ({
        plan: AppState.currentPlan,
        cards: document.querySelectorAll('#main-workout-grid .workout-card').length,
        rewritten: localStorage.getItem('workout_tracker_active_plan')
    }));
    t.equal(fallback.plan, 'upper_lower', 'a stale saved plan falls back to the default');
    t.ok(fallback.cards > 0, 'the home screen still renders workouts', fallback.cards);
    t.equal(fallback.rewritten, 'upper_lower', 'the stale selection is rewritten');
    t.equal(page2.__errors.length, 0, 'a stale plan does not throw', page2.__errors);

    await page.close();
    await page2.close();
});

// ---------------------------------------------------------------------------
// Lean Body / Lean Bulk plan
// ---------------------------------------------------------------------------
suite('lean bulk plan', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    const plan = await page.evaluate(() => ({
        days: getPlanWorkouts('lean_bulk').map(w => w.name),
        optional: getPlanOptionalWorkouts('lean_bulk').map(w => w.name),
        counts: getPlanWorkouts('lean_bulk').map(w => w.exercises.length)
    }));
    t.equal(plan.days.join(', '), 'Chest Day, Back Day, Shoulders Day, Leg Day, Arms Day',
        'the plan has the five training days from the source', plan.days);
    t.equal(plan.optional.join(', '), 'Optional Day 6', 'the optional sixth day is present', plan.optional);
    // The source specifies 4-6 exercises per day.
    t.ok(plan.counts.every(c => c >= 4 && c <= 7), 'each day has a sensible exercise count', plan.counts);

    // The programme is chest-pressing heavy and the source's own choices
    // conflict with the costochondritis constraints in the spec. Nothing in
    // the plan may be a flat or incline barbell bench press, or a dip.
    const unsafe = await page.evaluate(() => {
        const banned = [/barbell bench/i, /\bdips?\b/i, /wide.grip press/i];
        const found = [];
        ['lb_chest', 'lb_back', 'lb_shoulders', 'lb_legs', 'lb_arms', 'lb_day6'].forEach(id => {
            const w = getWorkout(id) || getOptionalWorkout(id);
            w.exercises.forEach(e => {
                if (banned.some(re => re.test(e.name))) found.push(`${id}: ${e.name}`);
            });
            // Substitution options are one tap away, so they count too.
            w.exercises.forEach(e => {
                const subs = getSubstitutions(e.name);
                (subs?.options || []).forEach(o => {
                    if (banned.some(re => re.test(o))) found.push(`${id}: ${e.name} -> ${o}`);
                });
            });
        });
        return found;
    });
    t.equal(unsafe.length, 0, 'no barbell bench press or dip is reachable in the plan', unsafe);

    // Adapted exercises must say so on the card, so the change is visible in
    // the app rather than buried in a commit message.
    const adapted = await page.evaluate(() => {
        const names = [];
        ['lb_chest', 'lb_back', 'lb_shoulders', 'lb_legs', 'lb_arms'].forEach(id => {
            getWorkout(id).exercises.forEach(e => {
                if (/ADAPTED/.test(e.notes || '')) names.push(e.name);
            });
        });
        return names.sort();
    });
    t.equal(adapted.join(' | '), [
        'Cable Press (decline, neutral)',
        'Cable Reverse Fly',
        'Neutral-Grip DB Floor Press',
        'Neutral-Grip DB Press (Low Incline)',
        'Seated Neutral-Grip DB Press'
    ].join(' | '), 'exactly the five adapted exercises are flagged in their notes', adapted);

    // Cardio and the weak-point day must use the right exercise types.
    const types = await page.evaluate(() => ({
        backCardio: getWorkout('lb_back').exercises.find(e => e.name === 'Zone 2 Cardio')?.exerciseType,
        legCardio: getWorkout('lb_legs').exercises.find(e => e.name === 'Zone 2 Cardio')?.exerciseType,
        weakPoint: getOptionalWorkout('lb_day6').exercises[0].exerciseType,
        cardioRest: getWorkout('lb_back').exercises.find(e => e.name === 'Zone 2 Cardio')?.rest
    }));
    t.equal(types.backCardio, 'duration', 'back day cardio is a duration exercise');
    t.equal(types.legCardio, 'duration', 'leg day cardio is a duration exercise');
    t.equal(types.weakPoint, 'completion', 'weak-point work is a completion exercise');
    t.equal(types.cardioRest, 0, 'cardio has no rest timer');

    // Rest periods must sit inside the source's 90s-3min window (30s for abs).
    const rests = await page.evaluate(() => {
        const bad = [];
        ['lb_chest', 'lb_back', 'lb_shoulders', 'lb_legs', 'lb_arms'].forEach(id => {
            getWorkout(id).exercises.forEach(e => {
                if (e.rest === 0) return; // cardio
                if (e.category === 'core') {
                    if (e.rest !== 30) bad.push(`${id}: ${e.name} abs rest ${e.rest}`);
                } else if (e.rest < 90 || e.rest > 180) {
                    bad.push(`${id}: ${e.name} rest ${e.rest}`);
                }
            });
        });
        return bad;
    });
    t.equal(rests.length, 0, 'rest periods sit inside the range the source prescribes', rests);

    await page.close();
});

suite('lean bulk plan is usable', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);
    await page.evaluate(() => UI.setActivePlan('lean_bulk'));

    const grid = await page.evaluate(() => ({
        cards: [...document.querySelectorAll('#main-workout-grid .workout-card')].map(c => c.dataset.workoutId),
        optional: [...document.querySelectorAll('#optional-workout-grid .workout-card')].map(c => c.dataset.workoutId)
    }));
    t.equal(grid.cards.join(','), 'lb_chest,lb_back,lb_shoulders,lb_legs,lb_arms',
        'selecting the plan shows its five days', grid.cards);
    t.equal(grid.optional.join(','), 'lb_day6', 'and its optional day', grid.optional);

    // Chest day exercises the reps path and the substitution button.
    await startWorkout(page, 'lb_chest');
    await completeRepsSet(page, 0, 1, 8, 50);
    const chest = await page.evaluate(() => ({
        sets: AppState.workoutData[0].sets.length,
        heading: document.querySelector('[data-exercise-index="0"] h3').textContent.trim(),
        hasSubstitute: !!document.querySelector('[data-exercise-index="0"] .btn-substitute'),
        notes: document.querySelector('[data-exercise-index="0"] .exercise-notes').textContent.trim()
    }));
    t.equal(chest.sets, 1, 'a set records on the new plan');
    t.equal(chest.heading, 'Neutral-Grip DB Press (Low Incline)', 'the adapted press leads chest day');
    t.equal(chest.hasSubstitute, true, 'the adapted press offers substitutions');
    t.ok(/ADAPTED/.test(chest.notes), 'the card shows why it was adapted', chest.notes);

    // Back day exercises the duration path.
    const page2 = await newAppPage(browser, baseUrl);
    await startWorkout(page2, 'lb_back');
    const cardioIdx = await page2.evaluate(() =>
        getWorkout('lb_back').exercises.findIndex(e => e.name === 'Zone 2 Cardio'));
    await completeDurationSet(page2, cardioIdx, 1, 10);
    const cardio = await page2.evaluate(idx => ({
        sets: AppState.workoutData[idx].sets.length,
        reps: AppState.workoutData[idx].sets[0]?.reps,
        timerVisible: !document.getElementById('rest-timer').classList.contains('hidden')
    }), cardioIdx);
    t.equal(cardio.sets, 1, 'the cardio block records as a duration set');
    t.equal(cardio.reps, '10min', 'it records minutes, not seconds', cardio.reps);
    t.equal(cardio.timerVisible, false, 'no rest timer follows the cardio block');

    // Day 6 exercises the completion path.
    const page3 = await newAppPage(browser, baseUrl);
    await startWorkout(page3, 'lb_day6', true);
    await page3.evaluate(() => {
        const cb = document.querySelector('[data-exercise-index="0"] .completion-checkbox');
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const day6 = await page3.evaluate(() => AppState.workoutData[0].sets.length);
    t.equal(day6, 1, 'weak-point work records as completed');

    t.equal(page.__errors.length + page2.__errors.length + page3.__errors.length, 0,
        'no errors running the new plan', [...page.__errors, ...page2.__errors, ...page3.__errors]);

    await page.close();
    await page2.close();
    await page3.close();
});

// ---------------------------------------------------------------------------
// Total volume - a NaN here writes a blank cell to the Sheets summary
// ---------------------------------------------------------------------------
suite('total volume', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    const results = await page.evaluate(() => {
        // NaN serialises to null across the CDP bridge, which hides the real
        // failure - surface it as a string instead.
        const raw = w => SheetsAPI.calculateTotalVolume(w);
        const vol = w => { const v = raw(w); return Number.isFinite(v) ? v : String(v); };
        return {
            reps: vol({ exercises: [{ sets: [{ reps: 10, weight: 100 }, { reps: 8, weight: 100 }] }] }),
            duration: vol({ exercises: [{ sets: [{ reps: '45s', weight: 0 }] }] }),
            completion: vol({ exercises: [{ sets: [{ reps: 'Completed', weight: 0 }] }] }),
            mixed: vol({
                exercises: [
                    { sets: [{ reps: 10, weight: 100 }] },
                    { sets: [{ reps: '45s', weight: 0 }] },
                    { sets: [{ reps: 'Completed', weight: 0 }] }
                ]
            }),
            stringReps: vol({ exercises: [{ sets: [{ reps: '10', weight: '50' }] }] })
        };
    });

    t.equal(results.reps, 1800, 'reps sets multiply out');
    t.equal(results.duration, 0, 'a duration set contributes 0, not NaN');
    t.equal(results.completion, 0, 'a completion set contributes 0, not NaN');
    // This is the case that produced blank Total Volume cells in the sheet:
    // one non-numeric set poisoned the whole workout's volume.
    t.equal(results.mixed, 1000, 'a duration/completion set does not poison the whole total');
    t.equal(results.stringReps, 500, 'numeric strings still multiply out');

    await page.close();
});

// ---------------------------------------------------------------------------
// Rest timer
// ---------------------------------------------------------------------------
suite('rest timer', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    // core_mobility[1] "Cat-Cow" is a reps exercise with rest: 0
    await startWorkout(page, 'core_mobility', true);
    const zeroRestIdx = await page.evaluate(() =>
        getOptionalWorkout('core_mobility').exercises.findIndex(
            e => e.rest === 0 && (e.exerciseType || 'reps') === 'reps'));

    if (zeroRestIdx >= 0) {
        await completeRepsSet(page, zeroRestIdx, 1, 10, 0);
        const state = await page.evaluate(() => ({
            visible: !document.getElementById('rest-timer').classList.contains('hidden'),
            running: AppState.isTimerRunning,
            barWidth: document.getElementById('timer-progress-bar').style.width
        }));
        // A zero-rest exercise must not raise a countdown that immediately
        // completes and fires a bogus "Rest Complete" notification.
        t.equal(state.visible, false, 'no rest timer appears for a rest:0 reps exercise');
        t.equal(state.running, false, 'no interval runs for a rest:0 reps exercise');
        t.ok(!/NaN/.test(state.barWidth), 'progress bar width is never NaN', state.barWidth);
    } else {
        t.skip('no rest:0 reps exercise in core_mobility to exercise this path');
    }

    // A normal exercise still gets its timer.
    const page2 = await newAppPage(browser, baseUrl);
    await startWorkout(page2, 'upper_a');
    await completeRepsSet(page2, 0, 1, 10, 50);
    const normal = await page2.evaluate(() => ({
        visible: !document.getElementById('rest-timer').classList.contains('hidden'),
        running: AppState.isTimerRunning,
        barWidth: document.getElementById('timer-progress-bar').style.width
    }));
    t.equal(normal.visible, true, 'rest timer appears for an exercise with rest > 0');
    t.equal(normal.running, true, 'rest timer interval runs for an exercise with rest > 0');
    t.ok(!/NaN/.test(normal.barWidth), 'progress bar width is numeric for a real timer', normal.barWidth);

    // Zero-rest duration exercise (e.g. cardio) must behave the same way.
    const page3 = await newAppPage(browser, baseUrl);
    await startWorkout(page3, 'zone2_cardio', true);
    await completeDurationSet(page3, 0, 1, 30);
    const cardio = await page3.evaluate(() => ({
        visible: !document.getElementById('rest-timer').classList.contains('hidden'),
        running: AppState.isTimerRunning
    }));
    t.equal(cardio.visible, false, 'no rest timer appears for a rest:0 duration exercise');
    t.equal(cardio.running, false, 'no interval runs for a rest:0 duration exercise');

    await page.close();
    await page2.close();
    await page3.close();
});

// ---------------------------------------------------------------------------
// Persistence - unchecking a set must survive a reload
// ---------------------------------------------------------------------------
suite('persistence', async ({ browser, baseUrl, t }) => {
    // Reps
    const page = await newAppPage(browser, baseUrl);
    await startWorkout(page, 'upper_a');
    await completeRepsSet(page, 0, 1, 10, 50);
    await completeRepsSet(page, 0, 2, 10, 50);
    await uncheckRepsSet(page, 0, 2);

    const reps = await page.evaluate(() => ({
        inState: AppState.workoutData[0].sets.length,
        inStorage: (Storage.getInProgressWorkout()?.exercises?.[0]?.sets || []).length
    }));
    t.equal(reps.inState, 1, 'unchecking a reps set removes it from state');
    // If this diverges, the set reappears as completed after an app reopen.
    t.equal(reps.inStorage, 1, 'unchecking a reps set is persisted to localStorage');

    // Duration
    const durIdx = await indexOfType(page, 'upper_a', 'duration');
    await completeDurationSet(page, durIdx, 1, 30);
    const beforeUncheck = await page.evaluate(idx =>
        (Storage.getInProgressWorkout()?.exercises?.[idx]?.sets || []).length, durIdx);
    await page.evaluate(idx => {
        const row = document.querySelector(`[data-exercise-index="${idx}"] .duration-set-row[data-set="1"]`);
        const cb = row.querySelector('.set-checkbox');
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, durIdx);
    const afterUncheck = await page.evaluate(idx =>
        (Storage.getInProgressWorkout()?.exercises?.[idx]?.sets || []).length, durIdx);
    t.equal(beforeUncheck, 1, 'completing a duration set persists it');
    t.equal(afterUncheck, 0, 'unchecking a duration set is persisted');

    await page.close();
});

// ---------------------------------------------------------------------------
// Substitutions
// ---------------------------------------------------------------------------
suite('substitutions', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);
    await startWorkout(page, 'upper_a');

    // Completed sets must survive a substitution. Losing the checkmarks
    // invites re-entry, which appends duplicate rows to the Sheets log.
    await completeRepsSet(page, 0, 1, 10, 50);
    await page.evaluate(async () => {
        AppState.substitutions[0] = 'Landmine press';
        await UI.updateSingleExerciseCard(0, false);
    });
    const afterSub = await page.evaluate(() => {
        const card = document.querySelector('[data-exercise-index="0"]');
        const row = card.querySelector('.set-row[data-set="1"]');
        return {
            heading: card.querySelector('h3').textContent.trim(),
            stateSets: AppState.workoutData[0].sets.length,
            checked: row.querySelector('.set-checkbox').checked,
            rowCompleted: row.classList.contains('completed'),
            repsDisabled: row.querySelector('.reps-input').disabled
        };
    });
    t.equal(afterSub.heading, 'Landmine press', 'card heading shows the substituted name');
    t.equal(afterSub.stateSets, 1, 'substituting keeps already-recorded sets in state');
    t.equal(afterSub.checked, true, 'a completed set stays checked after substituting');
    t.equal(afterSub.rowCompleted, true, 'a completed set keeps its completed styling after substituting');
    t.equal(afterSub.repsDisabled, true, 'a completed set stays locked after substituting');

    // Names are user-supplied free text and must not be able to break markup.
    const escaped = await page.evaluate(async () => {
        AppState.substitutions[1] = 'Dumbbell "Hex" Press <b>x</b>';
        await UI.updateSingleExerciseCard(1, false);
        const card = document.querySelector('[data-exercise-index="1"]');
        return {
            heading: card.querySelector('h3').textContent.trim(),
            injectedBold: !!card.querySelector('h3 b')
        };
    });
    t.equal(escaped.heading, 'Dumbbell "Hex" Press <b>x</b>', 'a custom name with quotes and tags renders literally');
    t.equal(escaped.injectedBold, false, 'a custom name cannot inject markup into the card');

    await page.close();
});

// ---------------------------------------------------------------------------
// Instructions must follow the exercise actually being performed
// ---------------------------------------------------------------------------
suite('instructions', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    // Every option a user can pick must have cues on file, otherwise
    // substituting silently strips the instructions.
    const coverage = await page.evaluate(() => {
        const names = new Set();
        Object.values(SUBSTITUTIONS).forEach(v => v.options.forEach(o => names.add(o)));
        Object.values(BODYWEIGHT_SUBSTITUTIONS).forEach(v => names.add(v));
        return [...names].filter(n => !getExerciseInstructions(n));
    });
    t.equal(coverage.length, 0, 'every substitute option has form cues on file', coverage);

    t.equal(
        await page.evaluate(() => getExerciseInstructions('LANDMINE PRESS') !== null),
        true,
        'instruction lookup is case-insensitive');

    await startWorkout(page, 'upper_a');

    const shown = await page.evaluate(async () => {
        const read = () => {
            const el = document.querySelector('[data-exercise-index="0"] .exercise-notes');
            return el ? el.textContent.trim() : null;
        };
        const original = read();

        AppState.substitutions[0] = 'Landmine press';
        await UI.updateSingleExerciseCard(0, false);
        const substituted = read();

        AppState.substitutions[0] = 'Some Machine I Invented';
        await UI.updateSingleExerciseCard(0, false);
        const custom = read();

        delete AppState.substitutions[0];
        await UI.updateSingleExerciseCard(0, false);
        const restored = read();

        return { original, substituted, custom, restored, expected: getExerciseInstructions('Landmine press') };
    });

    t.ok(shown.original && shown.original.length > 0, 'the original exercise shows its own cues', shown.original);
    t.equal(shown.substituted, shown.expected, 'substituting shows the substitute\'s own cues');
    t.ok(shown.substituted !== shown.original, 'the instructions actually change on substitution', shown.substituted);
    // Showing the original's cues for an unknown movement would be misleading.
    t.equal(shown.custom, null, 'a custom exercise shows no inherited cues');
    t.equal(shown.restored, shown.original, 'resetting to the original restores its cues');

    await page.close();
});

// ---------------------------------------------------------------------------
// Previous-performance lookup across history shapes
// ---------------------------------------------------------------------------
suite('previous performance', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);

    const res = await page.evaluate(() => {
        const w = getWorkout('upper_a');
        const orig = w.exercises[0].name;
        const SUB = 'Landmine press';
        const sets = [{ setNumber: 1, reps: 10, weight: 55 }];

        // Sheets shape: logged under the performed name, no substitutedWith.
        const sheets = { date: '2026-07-01', exercises: [{ name: SUB, sets }] };
        // localStorage shape: original name plus a substitutedWith marker.
        const local = { date: '2026-07-01', exercises: [{ name: orig, substitutedWith: SUB, sets }] };

        const render = (subs, prev) => {
            AppState.currentWorkout = 'upper_a';
            AppState.isOptionalWorkout = false;
            AppState.substitutions = subs;
            const card = UI.createExerciseCard(w.exercises[0], 0, prev);
            return !!card.querySelector('.previous-performance');
        };

        return {
            sheetsSub: render({ 0: SUB }, sheets),
            sheetsPlain: render({}, sheets),
            localSub: render({ 0: SUB }, local),
            localPlain: render({}, local)
        };
    });

    t.equal(res.sheetsSub, true, 'Sheets history attaches to the substituted exercise');
    t.equal(res.sheetsPlain, false, 'Sheets history does not bleed onto the original exercise');
    t.equal(res.localSub, true, 'localStorage history attaches to the substituted exercise');
    // The regression that showed weights from a different movement.
    t.equal(res.localPlain, false, 'localStorage history does not bleed onto the original exercise');

    await page.close();
});

// ---------------------------------------------------------------------------
// Removing an exercise from a session
// ---------------------------------------------------------------------------
suite('remove exercise', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);
    await startWorkout(page, 'upper_a');

    const totalExercises = await page.evaluate(() => getWorkout('upper_a').exercises.length);

    // Every exercise offers removal, not just ones with substitutions defined.
    const buttons = await page.evaluate(() => document.querySelectorAll('.btn-remove-exercise').length);
    t.equal(buttons, totalExercises, 'every exercise card offers a remove button');

    const progressBefore = await page.evaluate(() => {
        UI.updateWorkoutProgress();
        return document.getElementById('workout-progress').textContent;
    });

    // Remove an untouched exercise.
    await page.evaluate(() => WorkoutController.removeExercise(1));
    const removed = await page.evaluate(() => {
        const card = document.querySelector('[data-exercise-index="1"]');
        return {
            flagged: AppState.removedExercises[1] === true,
            collapsed: card.classList.contains('removed'),
            hasUndo: !!card.querySelector('.btn-restore-exercise'),
            hasSetRows: card.querySelectorAll('.set-row').length,
            persisted: Storage.getInProgressWorkout()?.removedExercises?.['1'] === true,
            progress: document.getElementById('workout-progress').textContent
        };
    });
    t.equal(removed.flagged, true, 'removing an exercise records it in state');
    t.equal(removed.collapsed, true, 'a removed exercise collapses to a removed row');
    t.equal(removed.hasUndo, true, 'a removed exercise offers an undo');
    t.equal(removed.hasSetRows, 0, 'a removed exercise shows no set inputs');
    t.equal(removed.persisted, true, 'the removal is persisted to localStorage');
    // Without shrinking the denominator the workout could never read N/N.
    t.equal(removed.progress, `0/${totalExercises - 1} exercises completed`,
        'a removed exercise drops out of the progress denominator');
    t.equal(progressBefore, `0/${totalExercises} exercises completed`,
        'the denominator counted every exercise before removal');

    // Undo puts it back, fully interactive.
    await page.evaluate(() => WorkoutController.restoreExercise(1));
    const restored = await page.evaluate(() => {
        const card = document.querySelector('[data-exercise-index="1"]');
        return {
            flagged: AppState.removedExercises[1] === true,
            collapsed: card.classList.contains('removed'),
            setRows: card.querySelectorAll('.set-row').length,
            persisted: Storage.getInProgressWorkout()?.removedExercises?.['1'] === true,
            progress: document.getElementById('workout-progress').textContent
        };
    });
    t.equal(restored.flagged, false, 'undo clears the removal from state');
    t.equal(restored.collapsed, false, 'undo restores the full card');
    t.ok(restored.setRows > 0, 'a restored exercise is interactive again', restored.setRows);
    t.equal(restored.persisted, false, 'undo is persisted to localStorage');
    t.equal(restored.progress, `0/${totalExercises} exercises completed`,
        'undo puts the exercise back into the denominator');

    await page.close();
});

suite('remove exercise with recorded sets', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl);
    await startWorkout(page, 'upper_a');
    await completeRepsSet(page, 0, 1, 10, 50);

    // Declining the confirmation must leave everything untouched.
    await page.evaluate(() => { window.__confirmReply = false; });
    await page.evaluate(() => WorkoutController.removeExercise(0));
    const declined = await page.evaluate(() => ({
        flagged: AppState.removedExercises[0] === true,
        sets: AppState.workoutData[0].sets.length,
        asked: window.__confirms.length
    }));
    t.ok(declined.asked > 0, 'removing an exercise with recorded sets asks first');
    t.equal(declined.flagged, false, 'declining the prompt leaves the exercise in place');
    t.equal(declined.sets, 1, 'declining the prompt keeps the recorded sets');

    // Accepting discards the local sets so they cannot reach the workout log.
    await page.evaluate(() => { window.__confirmReply = true; });
    await page.evaluate(() => WorkoutController.removeExercise(0));
    const accepted = await page.evaluate(() => ({
        flagged: AppState.removedExercises[0] === true,
        sets: AppState.workoutData[0].sets.length,
        persistedSets: (Storage.getInProgressWorkout()?.exercises?.[0]?.sets || []).length
    }));
    t.equal(accepted.flagged, true, 'accepting the prompt removes the exercise');
    t.equal(accepted.sets, 0, 'accepting discards its recorded sets');
    t.equal(accepted.persistedSets, 0, 'the discarded sets are cleared from localStorage too');

    await page.close();
});

suite('removals survive restore', async ({ browser, baseUrl, t }) => {
    const seed = function () {
        localStorage.setItem('workout_tracker_in_progress', JSON.stringify({
            workoutType: 'upper_a',
            isOptional: false,
            startTime: Date.now() - 60000,
            lastSaved: Date.now(),
            substitutions: {},
            removedExercises: { 1: true },
            exercises: [
                { name: 'Neutral-Grip DB Floor Press', rest: 120, sets: [] },
                { name: 'Barbell Row', rest: 120, sets: [] }
            ]
        }));
    };
    const page = await newAppPage(browser, baseUrl, { seedLocalStorage: seed, confirmReply: true });
    await page.reload();
    await page.waitForFunction(() => typeof AppState !== 'undefined');
    await page.waitForTimeout(300);

    const state = await page.evaluate(() => {
        const card = document.querySelector('[data-exercise-index="1"]');
        return {
            flagged: AppState.removedExercises[1] === true,
            collapsed: card ? card.classList.contains('removed') : null
        };
    });
    t.equal(state.flagged, true, 'a removal is restored with the workout');
    t.equal(state.collapsed, true, 'a restored removal still renders collapsed');

    await page.close();
});

// ---------------------------------------------------------------------------
// Google Sheets write path: logging a set and withdrawing it again
// ---------------------------------------------------------------------------
suite('sheets logging', async ({ browser, baseUrl, t }) => {
    const page = await newAppPage(browser, baseUrl, { authenticated: true });
    await startWorkout(page, 'upper_a');

    await completeRepsSet(page, 0, 1, 10, 50);
    await completeRepsSet(page, 0, 2, 9, 55);
    await page.waitForTimeout(120);

    let rows = await sheetRows(page);
    t.equal(rows.length, 2, 'completing two sets appends two rows', rows);
    t.equal(rows[0][2], 'Neutral-Grip DB Floor Press', 'the row records the exercise name');
    t.equal(rows[0][4], '1', 'the row records the set number');
    t.equal(rows[0][5], '10', 'the row records the reps');

    // The behaviour this change is about.
    await uncheckRepsSet(page, 0, 2);
    await page.waitForTimeout(200);
    rows = await sheetRows(page);
    t.equal(rows.length, 1, 'unchecking a set deletes its row from the sheet', rows);
    t.equal(rows[0][4], '1', 'the remaining row is the set that is still checked', rows[0]);

    // Deleting must not disturb neighbouring rows.
    await completeRepsSet(page, 0, 3, 8, 60);
    await page.waitForTimeout(120);
    await uncheckRepsSet(page, 0, 1);
    await page.waitForTimeout(200);
    rows = await sheetRows(page);
    t.equal(rows.length, 1, 'deleting a middle set leaves the others intact', rows);
    t.equal(rows[0][4], '3', 'the surviving row is the untouched set', rows[0]);

    await page.close();
});

suite('sheets logging for duration and completion', async ({ browser, baseUrl, t }) => {
    // Duration
    const page = await newAppPage(browser, baseUrl, { authenticated: true });
    await startWorkout(page, 'upper_a');
    const durIdx = await indexOfType(page, 'upper_a', 'duration');

    await completeDurationSet(page, durIdx, 1, 30);
    await page.waitForTimeout(120);
    let rows = await sheetRows(page);
    t.equal(rows.length, 1, 'completing a duration set appends a row', rows);

    await page.evaluate(idx => {
        const cb = document.querySelector(`[data-exercise-index="${idx}"] .duration-set-row[data-set="1"] .set-checkbox`);
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, durIdx);
    await page.waitForTimeout(200);
    rows = await sheetRows(page);
    t.equal(rows.length, 0, 'unchecking a duration set deletes its row', rows);

    // Completion
    const page2 = await newAppPage(browser, baseUrl, { authenticated: true });
    await startWorkout(page2, 'core_mobility', true);
    const compIdx = await indexOfType(page2, 'core_mobility', 'completion', true);

    const toggle = async (checked) => {
        await page2.evaluate(({ idx, checked }) => {
            const cb = document.querySelector(`[data-exercise-index="${idx}"] .completion-checkbox`);
            cb.checked = checked;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }, { idx: compIdx, checked });
        await page2.waitForTimeout(150);
    };

    await toggle(true);
    let rows2 = await sheetRows(page2);
    t.equal(rows2.length, 1, 'marking a completion exercise appends a row', rows2);

    await toggle(false);
    rows2 = await sheetRows(page2);
    t.equal(rows2.length, 0, 'unmarking a completion exercise deletes its row', rows2);

    await page.close();
    await page2.close();
});

suite('sheets deletion edge cases', async ({ browser, baseUrl, t }) => {
    // A substituted set is logged under the substituted name, so the deletion
    // has to search on that name or it will not find the row.
    const page = await newAppPage(browser, baseUrl, { authenticated: true });
    await startWorkout(page, 'upper_a');
    await page.evaluate(async () => {
        AppState.substitutions[0] = 'Landmine press';
        await UI.updateSingleExerciseCard(0, false);
    });
    await completeRepsSet(page, 0, 1, 10, 50);
    await page.waitForTimeout(120);
    let rows = await sheetRows(page);
    t.equal(rows[0] && rows[0][2], 'Landmine press', 'a substituted set logs under the substituted name');

    await uncheckRepsSet(page, 0, 1);
    await page.waitForTimeout(200);
    rows = await sheetRows(page);
    t.equal(rows.length, 0, 'unchecking a substituted set deletes its row', rows);

    // Checking then immediately unchecking must not race the append.
    await completeRepsSet(page, 0, 1, 10, 50);
    await uncheckRepsSet(page, 0, 1); // no wait: the append is still in flight
    await page.waitForTimeout(300);
    rows = await sheetRows(page);
    t.equal(rows.length, 0, 'an immediate undo still removes the row it raced', rows);

    // Removing an exercise withdraws every row it logged.
    await completeRepsSet(page, 0, 1, 10, 50);
    await completeRepsSet(page, 0, 2, 10, 50);
    await page.waitForTimeout(150);
    t.equal((await sheetRows(page)).length, 2, 'two sets logged before removal');
    await page.evaluate(() => { window.__confirmReply = true; });
    await page.evaluate(() => WorkoutController.removeExercise(0));
    await page.waitForTimeout(300);
    t.equal((await sheetRows(page)).length, 0, 'removing an exercise deletes its logged rows');

    // Unauthenticated undo must not blow up.
    const page2 = await newAppPage(browser, baseUrl);
    await startWorkout(page2, 'upper_a');
    await completeRepsSet(page2, 0, 1, 10, 50);
    await uncheckRepsSet(page2, 0, 1);
    await page2.waitForTimeout(150);
    t.equal(page2.__errors.length, 0, 'unchecking while signed out does not throw', page2.__errors);

    await page.close();
    await page2.close();
});

// ---------------------------------------------------------------------------
// Restoring an in-progress workout
// ---------------------------------------------------------------------------
suite('restore in-progress', async ({ browser, baseUrl, t }) => {
    const seed = function () {
        localStorage.setItem('workout_tracker_in_progress', JSON.stringify({
            workoutType: 'upper_a',
            isOptional: false,
            startTime: Date.now() - 60000,
            lastSaved: Date.now(),
            substitutions: {},
            exercises: [
                { name: 'Neutral-Grip DB Floor Press', rest: 120, sets: [
                    { setNumber: 1, reps: 10, weight: 50, completed: true }
                ]},
                { name: 'Barbell Row', rest: 120, sets: [] }
            ]
        }));
    };

    const page = await newAppPage(browser, baseUrl, { seedLocalStorage: seed, confirmReply: true });
    await page.reload();
    await page.waitForFunction(() => typeof AppState !== 'undefined');
    await page.waitForTimeout(300);

    const restored = await page.evaluate(() => {
        const row = document.querySelector('[data-exercise-index="0"] .set-row[data-set="1"]');
        return {
            onWorkoutView: document.getElementById('workout-view').classList.contains('active'),
            checked: row ? row.querySelector('.set-checkbox').checked : null,
            repsValue: row ? row.querySelector('.reps-input').value : null,
            disabled: row ? row.querySelector('.reps-input').disabled : null
        };
    });

    t.equal(restored.onWorkoutView, true, 'restoring switches to the workout view');
    t.equal(restored.checked, true, 'a previously completed set is re-checked on restore');
    t.equal(restored.repsValue, '10', 'a restored set shows its recorded reps');
    t.equal(restored.disabled, true, 'a restored set is locked so it is not logged twice');

    await page.close();
});

// ---------------------------------------------------------------------------
// Resilience - stale or unknown saved data must not break the app
// ---------------------------------------------------------------------------
suite('resilience', async ({ browser, baseUrl, t }) => {
    // A saved workout whose type no longer exists in data.js.
    const seedUnknown = function () {
        localStorage.setItem('workout_tracker_workouts', JSON.stringify([{
            id: '1', date: new Date().toISOString(), workoutType: 'removed_workout_type',
            duration: 3600, completed: true,
            exercises: [{ name: 'Some Exercise', rest: 60, sets: [{ setNumber: 1, reps: 10, weight: 50 }] }]
        }]));
    };
    const page = await newAppPage(browser, baseUrl, { seedLocalStorage: seedUnknown });
    const historyThrew = await page.evaluate(async () => {
        try { await UI.renderHistory(); return null; }
        catch (e) { return e.message; }
    });
    await page.waitForTimeout(100);
    t.equal(historyThrew, null, 'renderHistory does not throw on an unknown workout type');
    const historyOk = await page.evaluate(() => ({
        html: document.getElementById('history-list').innerHTML.length
    }));
    t.equal(page.__errors.length, 0, 'history renders without throwing on an unknown workout type', page.__errors);
    t.ok(historyOk.html > 0, 'history list still renders content');

    // An in-progress workout referencing a type that no longer exists.
    const seedBadInProgress = function () {
        localStorage.setItem('workout_tracker_in_progress', JSON.stringify({
            workoutType: 'removed_workout_type', isOptional: false,
            startTime: Date.now(), lastSaved: Date.now(), substitutions: {},
            exercises: [{ name: 'Gone', rest: 60, sets: [] }]
        }));
    };
    const page2 = await newAppPage(browser, baseUrl, { seedLocalStorage: seedBadInProgress, confirmReply: true });
    await page2.reload();
    await page2.waitForTimeout(300);
    const bootOk = await page2.evaluate(() => ({
        gridRendered: document.querySelectorAll('#main-workout-grid .workout-card').length
    }));
    t.equal(page2.__errors.length, 0, 'app boots without throwing on a stale in-progress workout', page2.__errors);
    t.ok(bootOk.gridRendered > 0, 'workout grid still renders after a stale in-progress workout');

    await page.close();
    await page2.close();
});

module.exports = { suites };
