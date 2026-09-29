/**
 * Workout Data Definitions
 *
 * Structure is designed to be extensible - new workouts can be added
 * by simply adding a new entry to the WORKOUTS object.
 *
 * Each workout follows this schema:
 * {
 *   id: string (unique identifier),
 *   name: string (display name),
 *   description: string (brief description),
 *   focus: string (e.g., "Hypertrophy", "Strength"),
 *   exercises: Array<Exercise>
 * }
 *
 * Each exercise follows this schema:
 * {
 *   name: string,
 *   sets: number,
 *   reps: string (e.g., "8-12", "30s", "10/side"),
 *   rest: number (seconds),
 *   superset: string (optional - name of paired exercise),
 *   category: string (optional - "core", "cardio"),
 *   notes: string (optional - form cues, safety reminders)
 * }
 */

const WORKOUTS = {
    upper_a: {
        id: 'upper_a',
        name: 'Upper A',
        description: 'Hypertrophy Focus',
        focus: 'Muscle growth with moderate weight and higher volume',
        exercises: [
            {
                name: 'Neutral-Grip DB Floor Press',
                sets: 4,
                reps: '8-12',
                rest: 120,
                notes: 'Maintain scapular retraction. Elbows at 45° angle. Pause when triceps touch ground.'
            },
            {
                name: 'Barbell Row',
                sets: 4,
                reps: '8-12',
                rest: 120,
                notes: 'Lead with elbows, not hands. Pull to lower chest. Squeeze shoulder blades at top.'
            },
            {
                name: 'Cable Press (decline, neutral)',
                sets: 3,
                reps: '10-12',
                rest: 60,
                superset: 'Cable Row',
                notes: 'Set cables at high position for decline angle. Maintain neutral grip.'
            },
            {
                name: 'Cable Row',
                sets: 3,
                reps: '10-12',
                rest: 60,
                superset: 'Cable Press (decline, neutral)',
                notes: 'Control the negative. Avoid shrugging shoulders.'
            },
            {
                name: 'DB Lateral Raise',
                sets: 3,
                reps: '12-15',
                rest: 60,
                superset: 'DB Reverse Fly',
                notes: 'Slight bend in elbows. Lead with elbows, not hands.'
            },
            {
                name: 'DB Reverse Fly',
                sets: 3,
                reps: '12-15',
                rest: 60,
                superset: 'DB Lateral Raise',
                notes: 'Hinge at hips. Squeeze shoulder blades together at top.'
            },
            {
                name: 'Bicep Curls (Myo-reps)',
                sets: 4,
                reps: '12-15+3x3-5',
                rest: 15,
                notes: 'Set 1: Activation set (12-15 reps to near failure). Sets 2-4: Mini-sets (3-5 reps each) with 15s rest between.'
            },
            {
                name: 'Tricep Pushdowns (Myo-reps)',
                sets: 4,
                reps: '12-15+3x3-5',
                rest: 15,
                notes: 'Set 1: Activation set (12-15 reps to near failure). Sets 2-4: Mini-sets (3-5 reps each) with 15s rest between.'
            },
            {
                name: 'Pallof Press',
                sets: 3,
                reps: '10/side',
                rest: 60,
                category: 'core',
                notes: 'Resist rotation. Keep core braced throughout.'
            },
            {
                name: 'Dead Bug',
                sets: 3,
                reps: '12/side',
                rest: 60,
                category: 'core',
                notes: 'Keep lower back pressed to floor. Move slowly and controlled.'
            },
            {
                name: 'Side Plank',
                exerciseType: 'duration',
                sets: 3,
                targetDuration: 30, // seconds
                durationUnit: 'seconds',
                reps: '30s/side',
                rest: 60,
                category: 'core',
                notes: 'Keep hips elevated. Maintain straight line from head to feet.'
            }
        ]
    },

    lower_a: {
        id: 'lower_a',
        name: 'Lower A',
        description: 'Strength + Conditioning',
        focus: 'Heavy compound lifts with HIIT conditioning',
        exercises: [
            {
                name: 'Back Squat',
                sets: 5,
                reps: '4-6',
                rest: 120,
                notes: 'Chest up, core braced. Hip hinge then knee bend. Depth to parallel or slightly below.'
            },
            {
                name: 'Romanian Deadlift',
                sets: 3,
                reps: '8-10',
                rest: 120,
                notes: 'Hinge at hips, not waist. Bar stays close to legs. Feel stretch in hamstrings.'
            },
            {
                name: 'Leg Curl',
                sets: 3,
                reps: '10-12',
                rest: 60,
                superset: 'Leg Extension',
                notes: 'Control the eccentric. Full range of motion.'
            },
            {
                name: 'Leg Extension',
                sets: 3,
                reps: '10-12',
                rest: 60,
                superset: 'Leg Curl',
                notes: 'Squeeze quads at top. Slow negative.'
            },
            {
                name: 'Standing Calf Raise',
                sets: 4,
                reps: '12-15',
                rest: 60,
                notes: 'Full stretch at bottom. Pause at top contraction.'
            },
            {
                name: 'Hanging Knee Raise',
                sets: 3,
                reps: '10-12',
                rest: 60,
                category: 'core',
                notes: 'Control the swing. Use abs to pull knees up, not momentum.'
            },
            {
                name: 'HIIT Bike Intervals',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 10, // minutes
                durationUnit: 'minutes',
                reps: '10 min',
                rest: 0,
                category: 'cardio',
                notes: '10 rounds: 30s all-out sprint, 30s easy recovery. Total 10 minutes.'
            }
        ]
    },

    upper_b: {
        id: 'upper_b',
        name: 'Upper B',
        description: 'Strength Focus',
        focus: 'Heavy weight, lower reps for maximum strength',
        exercises: [
            {
                name: 'Neutral-Grip DB Floor Press',
                sets: 5,
                reps: '4-6',
                rest: 120,
                notes: 'Heavier than Upper A. Maintain scapular retraction. Explosive concentric, controlled eccentric.'
            },
            {
                name: 'Barbell Row',
                sets: 5,
                reps: '4-6',
                rest: 120,
                notes: 'Heavy weight. Maintain form. Pull explosively, lower with control.'
            },
            {
                name: 'Cable Press (incline)',
                sets: 3,
                reps: '8-10',
                rest: 120,
                notes: 'Set cables at low position for incline angle. Upper chest focus.'
            },
            {
                name: 'Cable Pulldown',
                sets: 3,
                reps: '8-10',
                rest: 120,
                notes: 'Pull to upper chest. Squeeze lats at bottom. Control the negative.'
            },
            {
                name: 'DB Overhead Press',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'Press straight up. Avoid excessive arch. Core tight throughout.'
            },
            {
                name: 'Face Pulls',
                sets: 3,
                reps: '15-20',
                rest: 60,
                notes: 'Pull to face level. External rotation at end. Focus on rear delts.'
            },
            {
                name: 'Hammer Curls',
                sets: 3,
                reps: '8-10',
                rest: 60,
                notes: 'Neutral grip throughout. Control the eccentric.'
            },
            {
                name: 'Close-Grip Pushdowns',
                sets: 3,
                reps: '8-10',
                rest: 60,
                notes: 'Elbows tucked. Full extension at bottom. Squeeze triceps.'
            },
            {
                name: 'Plank',
                exerciseType: 'duration',
                sets: 3,
                targetDuration: 45, // seconds
                durationUnit: 'seconds',
                reps: '45s',
                rest: 60,
                category: 'core',
                notes: 'Maintain straight line. Don\'t let hips sag. Breathe normally.'
            },
            {
                name: 'Bird Dog',
                sets: 3,
                reps: '10/side',
                rest: 60,
                category: 'core',
                notes: 'Opposite arm and leg. Keep hips level. Move slowly.'
            }
        ]
    },

    lower_b: {
        id: 'lower_b',
        name: 'Lower B',
        description: 'Hypertrophy + Conditioning',
        focus: 'Higher volume with steady-state cardio',
        exercises: [
            {
                name: 'Bulgarian Split Squat',
                sets: 4,
                reps: '10-12/leg',
                rest: 120,
                notes: 'Front leg does the work. Knee tracks over toes. Torso upright.'
            },
            {
                name: 'Stiff-Leg Deadlift',
                sets: 3,
                reps: '10-12',
                rest: 120,
                notes: 'Slight knee bend. Hinge at hips. Feel hamstring stretch.'
            },
            {
                name: 'Walking Lunges',
                sets: 3,
                reps: '12/leg',
                rest: 60,
                superset: 'Nordic Curls',
                notes: 'Long stride. Knee doesn\'t pass toes. Keep torso upright.'
            },
            {
                name: 'Nordic Curls',
                sets: 3,
                reps: 'AMRAP',
                rest: 60,
                superset: 'Walking Lunges',
                notes: 'As many reps as possible. Focus on 5-second eccentric. Use assistance if needed.'
            },
            {
                name: 'Seated Calf Raise',
                sets: 4,
                reps: '15-20',
                rest: 60,
                notes: 'Full stretch at bottom. Pause at top. High rep range.'
            },
            {
                name: 'Cable Woodchops',
                sets: 3,
                reps: '12/side',
                rest: 60,
                category: 'core',
                notes: 'Rotate from core, not arms. Controlled movement throughout.'
            },
            {
                name: 'Steady-State Cardio',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 20, // minutes
                durationUnit: 'minutes',
                reps: '20 min',
                rest: 0,
                category: 'cardio',
                notes: 'Zone 2 - conversational pace. Bike, treadmill, or elliptical.'
            }
        ]
    }
};

/**
 * Configuration - Update these values with your Google Cloud credentials
 */
const CONFIG = {
    // Replace with your Google OAuth Client ID
    CLIENT_ID: '684177592462-7slnqfr7b3ng1k07daellkoar7no3n0n.apps.googleusercontent.com',

    // Replace with your Google Sheet ID
    // Default sheet ID from spec, users should update in settings
    SHEET_ID: '115OSeN_PePPBGH_bSbaDOJj_vypCRb5yjiGXzbIFLo0',

    // Google Sheets API scopes
    SCOPES: 'https://www.googleapis.com/auth/spreadsheets',

    // Discovery doc for Sheets API
    DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4'
};

/**
 * Utility function to get workout by ID
 */
function getWorkout(workoutId) {
    return WORKOUTS[workoutId] || null;
}

/**
 * Get all workouts as an array
 */
function getAllWorkouts() {
    return Object.values(WORKOUTS);
}

/**
 * Training Plans
 *
 * A plan groups the workouts that belong to one programme. Adding a plan is a
 * data-only change: list its workout ids here and it appears in the picker.
 *
 * Workout ids stay globally unique and are NOT namespaced by plan, because
 * they are written to the Google Sheet's "Workout Type" column and stored in
 * localStorage history. getWorkout()/getOptionalWorkout() therefore keep
 * resolving any id regardless of which plan is selected, so history and an
 * in-progress session survive a plan switch.
 */
const PLANS = {
    upper_lower: {
        id: 'upper_lower',
        name: 'Upper/Lower Split',
        description: '4-day upper/lower split with integrated conditioning',
        focus: 'Hypertrophy & strength',
        workouts: ['upper_a', 'lower_a', 'upper_b', 'lower_b'],
        optionalWorkouts: ['quick_upper', 'zone2_cardio', 'core_mobility', 'upper_pump', 'lower_accessories']
    },
    lean_bulk: {
        id: 'lean_bulk',
        name: 'Lean Body / Lean Bulk',
        description: '5-6 day muscle-group split, adapted for chest safety',
        focus: 'Lean muscle',
        workouts: ['lb_chest', 'lb_back', 'lb_shoulders', 'lb_legs', 'lb_arms'],
        optionalWorkouts: ['lb_day6']
    }
};

const DEFAULT_PLAN_ID = 'upper_lower';

/**
 * Get a plan by id, falling back to the default so a stale saved selection
 * (a plan removed from the code) cannot leave the home screen empty.
 */
function getPlan(planId) {
    return PLANS[planId] || PLANS[DEFAULT_PLAN_ID] || null;
}

/** Every plan, for the picker. */
function getAllPlans() {
    return Object.values(PLANS);
}

/** The main workouts of a plan, in the order the plan lists them. */
function getPlanWorkouts(planId) {
    const plan = getPlan(planId);
    if (!plan) return [];
    return (plan.workouts || []).map(id => getWorkout(id)).filter(Boolean);
}

/** The optional workouts of a plan, in the order the plan lists them. */
function getPlanOptionalWorkouts(planId) {
    const plan = getPlan(planId);
    if (!plan) return [];
    return (plan.optionalWorkouts || []).map(id => getOptionalWorkout(id)).filter(Boolean);
}

/** Which plan a workout id belongs to, or null if it belongs to none. */
function getPlanForWorkout(workoutId) {
    return Object.values(PLANS).find(p =>
        (p.workouts || []).includes(workoutId) ||
        (p.optionalWorkouts || []).includes(workoutId)
    ) || null;
}

/**
 * Parse rep range to get min and max values
 * Examples: "8-12" -> {min: 8, max: 12}, "30s" -> {min: 30, max: 30, unit: "s"}
 */
function parseRepRange(repString) {
    // Handle time-based (e.g., "30s", "20 min")
    if (repString.includes('s') || repString.includes('min')) {
        const value = parseInt(repString);
        return { min: value, max: value, unit: repString.replace(/[0-9]/g, '').trim() };
    }

    // Handle per-side (e.g., "10/side")
    if (repString.includes('/')) {
        const value = parseInt(repString);
        return { min: value, max: value, perSide: true };
    }

    // Handle AMRAP
    if (repString.includes('AMRAP')) {
        return { min: 1, max: 100, amrap: true };
    }

    // Handle myo-reps (e.g., "12-15+3x3-5")
    if (repString.includes('+')) {
        const [main, myo] = repString.split('+');
        const [min, max] = main.split('-').map(n => parseInt(n));
        return { min, max, myoReps: myo };
    }

    // Handle standard range (e.g., "8-12")
    if (repString.includes('-')) {
        const [min, max] = repString.split('-').map(n => parseInt(n));
        return { min, max };
    }

    // Single number
    const value = parseInt(repString);
    return { min: value, max: value };
}

/**
 * Exercise Substitutions
 * Based on workout-tracker-spec.md Exercise Substitutions section
 * Each exercise has an array of substitution options
 */
const SUBSTITUTIONS = {
    // Primary Pressing
    'Neutral-Grip DB Floor Press': {
        options: [
            'Neutral-grip DB press on low incline (15-30°)',
            'Landmine press',
            'Neutral-grip DB press on flat bench (limited ROM)'
        ],
        avoid: [
            'Barbell bench press',
            'Wide-grip pressing variations',
            'Full range dips'
        ],
        notes: 'Never substitute with barbell bench or wide-grip variations due to costochondritis safety.'
    },

    // Rows
    'Barbell Row': {
        options: [
            'Pendlay row',
            'Chest-supported DB row',
            'T-bar row',
            'Seal row'
        ],
        notes: 'Focus: Pull with back not arms, maintain neutral spine, full scapular retraction.'
    },

    'Cable Row': {
        options: [
            'Seated cable row',
            'Single-arm cable row',
            'Chest-supported row',
            'DB bent-over row'
        ],
        notes: 'Control the negative. Avoid shrugging shoulders.'
    },

    // Cable Pressing
    'Cable Press (decline, neutral)': {
        options: [
            'Low cable crossover',
            'Resistance band press (decline angle)',
            'Light DB press (higher reps)',
            'Machine press (neutral grip if available)'
        ],
        notes: 'If cable unavailable: resistance band press at same angle or light DB press with higher reps.'
    },

    'Cable Press (incline)': {
        options: [
            'High cable crossover',
            'Resistance band press (incline angle)',
            'Light DB incline press',
            'Machine press (incline, neutral grip)'
        ],
        notes: 'Maintain neutral grip for chest safety.'
    },

    'Cable Pulldown': {
        options: [
            'Lat pulldown (any machine)',
            'Pull-ups or chin-ups',
            'Assisted pull-ups',
            'Single-arm cable pulldown'
        ],
        notes: 'Pull to upper chest. Squeeze lats at bottom.'
    },

    // Squatting
    'Back Squat': {
        options: [
            'Safety bar squat (reduced thoracic stress)',
            'Goblet squat (lighter load, good for hypertrophy)',
            'Hack squat machine',
            'Leg press (not ideal, but acceptable)'
        ],
        avoid: [
            'Skipping bilateral squat pattern entirely on Lower A'
        ],
        notes: 'Some form of bilateral squat pattern required for Lower A.'
    },

    'Bulgarian Split Squat': {
        options: [
            'Rear foot elevated split squat with support',
            'Regular split squat (both feet on ground)',
            'Single-leg leg press',
            'Walking lunges'
        ],
        notes: 'If balance is an issue, use support or both feet on ground.'
    },

    // Nordic Curls
    'Nordic Curls': {
        options: [
            'Eccentric-only nordic curls (just the lowering)',
            'Band-assisted nordic curls',
            'Lying leg curl with slow eccentric (5-second negative)',
            'Glute-ham raise (easier variation)'
        ],
        progression: 'Start with 1-3 reps per set. Focus on 5-second eccentric. Add reps before adding sets.',
        notes: 'If too difficult: eccentric-only or band-assisted. Progression: 1-3 reps → add reps before sets.'
    },

    // Deadlift Variations
    'Romanian Deadlift': {
        options: [
            'Dumbbell RDL (easier to control)',
            'Single-leg RDL (lighter load, unilateral work)',
            'Back extension with good morning pattern',
            'Stiff-leg deadlift'
        ],
        notes: 'Hinge at hips not round spine. Keep bar close. Feel stretch in hamstrings not lower back.'
    },

    'Stiff-Leg Deadlift': {
        options: [
            'Romanian deadlift',
            'Dumbbell stiff-leg deadlift',
            'Single-leg RDL',
            'Back extension'
        ],
        notes: 'Slight knee bend. Hinge at hips. Feel hamstring stretch.'
    },

    // Lunges
    'Walking Lunges': {
        options: [
            'Stationary lunges',
            'Reverse lunges',
            'DB step-ups',
            'Split squats'
        ],
        notes: 'Long stride. Knee doesn\'t pass toes. Keep torso upright.'
    },

    // Overhead Press
    'DB Overhead Press': {
        options: [
            'Landmine press',
            'Arnold press (partial rotation)',
            'Machine shoulder press',
            'Seated DB press'
        ],
        avoid: [
            'Going too heavy if costochondritis flares - drop weight and increase reps'
        ],
        notes: 'Can create sternum stress if too heavy. Drop weight increase reps if costochondritis symptoms.'
    },

    // Deltoid Work
    'DB Lateral Raise': {
        options: [
            'Cable lateral raise',
            'Machine lateral raise',
            'Single-arm DB lateral raise',
            'Upright row (wide grip)'
        ],
        notes: 'Slight bend in elbows. Lead with elbows not hands.'
    },

    'DB Reverse Fly': {
        options: [
            'Cable reverse fly',
            'Machine reverse fly',
            'Bent-over cable fly',
            'Prone DB reverse fly'
        ],
        notes: 'Hinge at hips. Squeeze shoulder blades together at top.'
    },

    'Face Pulls': {
        options: [
            'Band face pulls',
            'Reverse cable fly',
            'DB reverse fly',
            'Wide-grip cable row to face'
        ],
        notes: 'Pull to face level. External rotation at end. Focus on rear delts.'
    },

    // Arms
    'Bicep Curls (Myo-reps)': {
        options: [
            'Standard bicep curls (straight sets)',
            'EZ-bar curls',
            'Cable curls',
            'Hammer curls'
        ],
        notes: 'Myo-reps structure: 12-15 activation set + 3x3-5 mini-sets with 15s rest.'
    },

    'Hammer Curls': {
        options: [
            'Cable hammer curls',
            'Cross-body hammer curls',
            'Rope cable curls',
            'Neutral-grip DB curls'
        ],
        notes: 'Neutral grip throughout. Control the eccentric.'
    },

    'Tricep Pushdowns (Myo-reps)': {
        options: [
            'Standard tricep pushdowns (straight sets)',
            'Overhead cable extension',
            'Close-grip bench press',
            'DB overhead extension'
        ],
        notes: 'Myo-reps structure: 12-15 activation set + 3x3-5 mini-sets with 15s rest.'
    },

    'Close-Grip Pushdowns': {
        options: [
            'Rope pushdowns',
            'V-bar pushdowns',
            'Single-arm pushdowns',
            'Overhead cable extension'
        ],
        notes: 'Elbows tucked. Full extension at bottom. Squeeze triceps.'
    },

    // Leg Accessories
    'Leg Curl': {
        options: [
            'Seated leg curl',
            'Lying leg curl',
            'Single-leg curl',
            'Nordic curls (eccentric)'
        ],
        notes: 'Control the eccentric. Full range of motion.'
    },

    'Leg Extension': {
        options: [
            'Single-leg extension',
            'Goblet squat (lighter, higher reps)',
            'Leg press (quad-focused)',
            'Step-ups'
        ],
        notes: 'Squeeze quads at top. Slow negative.'
    },

    // Calves
    'Standing Calf Raise': {
        options: [
            'Single-leg calf raise',
            'Calf raise on leg press',
            'Smith machine calf raise',
            'Seated calf raise (different emphasis)'
        ],
        notes: 'Full stretch at bottom. Pause at top contraction.'
    },

    'Seated Calf Raise': {
        options: [
            'Standing calf raise (different emphasis)',
            'Single-leg seated calf raise',
            'Leg press calf raise',
            'Smith machine calf raise'
        ],
        notes: 'Full stretch at bottom. Pause at top. High rep range.'
    },

    // Core
    'Pallof Press': {
        options: [
            'Cable woodchops',
            'Anti-rotation band holds',
            'Suitcase carries',
            'Half-kneeling pallof press'
        ],
        notes: 'Resist rotation. Keep core braced throughout.'
    },

    'Dead Bug': {
        options: [
            'Bird dog (easier)',
            'Hollow body hold',
            'Modified dead bug (single leg)',
            'Plank variations'
        ],
        notes: 'Keep lower back pressed to floor. Move slowly and controlled.'
    },

    'Side Plank': {
        options: [
            'Side plank from knees',
            'Side-lying hip abduction',
            'Copenhagen plank (advanced)',
            'Side plank with rotation'
        ],
        notes: 'Keep hips elevated. Maintain straight line from head to feet.'
    },

    'Plank': {
        options: [
            'Plank from knees',
            'RKC plank (max tension)',
            'Plank with arm/leg lift',
            'Plank on stability ball'
        ],
        notes: 'Maintain straight line. Don\'t let hips sag. Breathe normally.'
    },

    'Bird Dog': {
        options: [
            'Modified bird dog (arm or leg only)',
            'Quadruped hold',
            'Dead bug',
            'Superman hold'
        ],
        notes: 'Opposite arm and leg. Keep hips level. Move slowly.'
    },

    'Hanging Knee Raise': {
        options: [
            'Captain\'s chair knee raise',
            'Lying leg raise',
            'Reverse crunches',
            'Decline sit-ups'
        ],
        notes: 'Control the swing. Use abs to pull knees up not momentum.'
    },

    'Cable Woodchops': {
        options: [
            'Pallof press',
            'Russian twists',
            'Medicine ball chops',
            'Landmine rotations'
        ],
        notes: 'Rotate from core not arms. Controlled movement throughout.'
    },

    // Cardio
    'HIIT Bike Intervals': {
        options: [
            'Rowing machine intervals (10x30s/30s)',
            'Assault bike',
            'Ski erg',
            'Treadmill sprints (if no knee issues)'
        ],
        notes: '10 rounds: 30s all-out sprint, 30s easy recovery. Total 10 minutes.'
    },

    'Steady-State Cardio': {
        options: [
            'Incline treadmill walk',
            'Elliptical',
            'Swimming',
            'Rowing machine (lower intensity)'
        ],
        notes: 'Zone 2 - conversational pace. 20 minutes.'
    }
};

/**
 * Get substitutions for an exercise
 */
function getSubstitutions(exerciseName) {
    return SUBSTITUTIONS[exerciseName] || null;
}

/**
 * Check if an exercise has substitutions available
 */
function hasSubstitutions(exerciseName) {
    return exerciseName in SUBSTITUTIONS;
}

/**
 * Form cues for substitute exercises.
 *
 * When an exercise is swapped, the card must show cues for the movement
 * actually being performed - the original's cues are at best irrelevant and at
 * worst unsafe (e.g. "keep hips elevated" on a movement that has no hips
 * involved). Keys are matched case-insensitively, so variants that differ only
 * in capitalisation share one entry.
 *
 * Pressing entries preserve the programme's costochondritis constraint:
 * neutral grip, no wide-grip or full-range barbell pressing.
 */
const EXERCISE_INSTRUCTIONS = {
    // --- Pressing (chest-safe) ---
    'neutral-grip db press on low incline (15-30°)': 'Keep palms facing each other and elbows at ~45°. Set a low incline only. Stop before the sternum feels stretched.',
    'neutral-grip db press on flat bench (limited rom)': 'Neutral grip throughout. Stop the descent early - do not let the elbows drop below the torso.',
    'landmine press': 'Neutral grip, press up and slightly forward. Keep ribs down and core braced. Easier on the sternum than a flat press.',
    'light db press (higher reps)': 'Neutral grip, lighter load, higher reps. Control the negative rather than chasing weight.',
    'light db incline press': 'Neutral grip on a low incline. Keep shoulder blades retracted and stop short of a sternum stretch.',
    'machine press (neutral grip if available)': 'Use a neutral-grip handle if the machine has one. Set the seat so the handles sit at mid-chest.',
    'machine press (incline, neutral grip)': 'Neutral grip, incline path. Keep shoulder blades set against the pad.',
    'low cable crossover': 'Pull from low to high with a slight elbow bend. Squeeze at the top without letting the shoulders roll forward.',
    'high cable crossover': 'Pull from high to low with a slight elbow bend. Keep the chest tall and shoulders back.',
    'resistance band press (decline angle)': 'Anchor the band high and press down and across. Control the return - do not let the band snap back.',
    'resistance band press (incline angle)': 'Anchor the band low and press up and across. Keep tension constant through the full range.',
    'close-grip bench press': 'Hands shoulder-width, elbows tucked close to the ribs. Stop if the sternum complains.',
    'elevated push-ups (limited rom)': 'Hands on a bench or counter. Elbows tucked at ~45°, body in one line. Limited range protects the chest.',
    'decline push-ups': 'Feet elevated, hands under the shoulders. Elbows tucked, ribs down, stop before the chest touches.',
    'close-grip push-ups': 'Hands under the shoulders, elbows brushing the ribs. Keep the body in one straight line.',
    'diamond push-ups (myo-reps)': 'Index fingers and thumbs together under the chest. Elbows stay tight. Activation set to near failure, then mini-sets with 15s rest.',
    'pike push-ups': 'Hips high, head between the hands, press overhead rather than forward. Keeps load off the sternum.',

    // --- Rows and pulls ---
    'pendlay row': 'Bar resets on the floor each rep. Flat back, explosive pull to the lower chest.',
    'chest-supported db row': 'Chest stays on the pad. Lead with the elbows and squeeze the shoulder blades together.',
    'chest-supported row': 'Chest stays on the pad so the lower back is not doing the work. Lead with the elbows.',
    't-bar row': 'Neutral spine, chest up. Pull to the upper abdomen and control the negative.',
    'seal row': 'Chest flat on the bench throughout. No body English - the back does all the work.',
    'seated cable row': 'Tall torso, no rocking. Pull to the navel and squeeze the shoulder blades.',
    'single-arm cable row': 'Square the hips. Pull the elbow past the ribs without rotating the torso.',
    'db bent-over row': 'Hinge at the hips with a flat back. Pull the dumbbell to the hip, not the shoulder.',
    'inverted rows (under table)': 'Body in one straight line, heels on the floor. Pull the chest to the edge and squeeze the blades.',
    'towel rows': 'Loop a towel around a fixed anchor. Lean back, pull the chest toward the hands, control the return.',
    'lat pulldown (any machine)': 'Chest tall, pull the bar to the collarbone. Avoid leaning back to move more weight.',
    'pull-ups or chin-ups': 'Full hang at the bottom, chest toward the bar at the top. Control the lowering.',
    'assisted pull-ups': 'Use the machine or a band for the minimum help needed. Full range beats partial reps.',
    'single-arm cable pulldown': 'One side at a time, torso square. Drive the elbow down toward the hip.',
    'wide-grip cable row to face': 'Pull toward the face with high elbows. Prioritise the rear delts and mid-back.',

    // --- Squat pattern ---
    'safety bar squat (reduced thoracic stress)': 'Yoke sits on the traps, hands light on the handles. Chest up, knees tracking over the toes.',
    'goblet squat (lighter load, good for hypertrophy)': 'Hold the weight at the chest. Elbows inside the knees at the bottom, chest tall throughout.',
    'goblet squat (lighter, higher reps)': 'Weight at the chest, higher reps. Control the descent and keep the torso upright.',
    'hack squat machine': 'Back flat on the pad, feet mid-platform. Descend to at least parallel under control.',
    'leg press (not ideal, but acceptable)': 'Do not let the lower back round off the pad at the bottom. Stop the descent before the hips tuck.',
    'leg press (quad-focused)': 'Feet low and narrow on the platform. Keep the lower back flat against the pad.',
    'pistol squats (assisted)': 'Hold a support for balance. Lower slowly on one leg, keeping the heel down.',
    'sissy squats': 'Knees travel forward, hips stay extended. Hold support and move slowly - hard on the knees if rushed.',

    // --- Single-leg ---
    'rear foot elevated split squat with support': 'Hold a rail for balance. Rear foot on the bench, drop the back knee straight down.',
    'regular split squat (both feet on ground)': 'Both feet planted, staggered stance. Drop straight down rather than leaning forward.',
    'single-leg leg press': 'One leg at a time, foot centred on the platform. Keep the hips square.',
    'bulgarian split squats (bodyweight)': 'Rear foot on a chair, front shin near vertical. Drop the back knee straight down.',
    'stationary lunges': 'Feet staggered and planted. Drop the back knee toward the floor, torso upright.',
    'reverse lunges': 'Step backwards, not forwards - easier on the knees. Keep the front shin vertical.',
    'walking lunges': 'Long step, back knee toward the floor. Torso upright, push through the front heel.',
    'walking lunges (bodyweight)': 'Long step, back knee toward the floor. Torso upright throughout.',
    'split squats': 'Staggered stance, both feet planted. Vertical torso, controlled descent.',
    'db step-ups': 'Full foot on the box. Drive through the top-leg heel and avoid pushing off the trailing toe.',
    'step-ups': 'Full foot on the box. Drive through the heel and control the way down.',

    // --- Hinge ---
    'romanian deadlift': 'Hinge at the hips with a soft knee. Bar close to the legs, stretch felt in the hamstrings not the lower back.',
    'dumbbell rdl (easier to control)': 'Hinge at the hips, dumbbells tracking close to the legs. Neutral spine throughout.',
    'single-leg rdl': 'Hinge on one leg, hips square to the floor. Lighter load - balance is the limiting factor.',
    'single-leg rdl (lighter load, unilateral work)': 'Hinge on one leg with the hips square. Go light and prioritise control.',
    'single-leg rdl (bodyweight)': 'Hinge on one leg, hips square, back flat. Move slowly and hold the end position.',
    'stiff-leg deadlift': 'Minimal knee bend, hips travel back. Stop when the hamstrings limit the range, not when the back rounds.',
    'dumbbell stiff-leg deadlift': 'Near-straight legs, hips back. Keep the dumbbells close and the spine neutral.',
    'back extension': 'Squeeze the glutes to raise the torso. Stop at a straight line - do not hyperextend.',
    'back extension with good morning pattern': 'Hinge and return to a straight line. Glutes finish the movement, not the lower back.',
    'good mornings (bodyweight)': 'Hands at the temples, hinge at the hips with a flat back. Feel the hamstrings, not the spine.',

    // --- Hamstring curls ---
    'eccentric-only nordic curls (just the lowering)': 'Lower as slowly as possible, then use the hands to push back up. The lowering is the whole exercise.',
    'band-assisted nordic curls': 'Band anchored overhead to take some load. Control the descent, resist all the way down.',
    'lying leg curl with slow eccentric (5-second negative)': 'Curl up normally, then take a full five seconds to lower.',
    'nordic curls (eccentric)': 'Anchor the ankles, lower under control as far as possible, push back with the hands.',
    'glute-ham raise (easier variation)': 'Control the descent, keep the hips extended. Do not turn it into a hip hinge.',
    'seated leg curl': 'Torso against the back pad. Curl fully and control the return.',
    'lying leg curl': 'Hips flat on the pad. Curl fully without lifting the hips.',
    'single-leg curl': 'One leg at a time to even out any imbalance. Same range on both sides.',

    // --- Quads ---
    'single-leg extension': 'One leg at a time. Pause briefly at the top and lower under control.',

    // --- Overhead and delts ---
    'arnold press (partial rotation)': 'Start palms-in and rotate only partway. Stop if the shoulder or sternum complains.',
    'machine shoulder press': 'Seat set so the handles start at shoulder height. Ribs down, no lower-back arch.',
    'seated db press': 'Back against the pad, neutral or slightly angled grip. Do not flare the ribs.',
    'cable lateral raise': 'Lead with the elbow, raise to shoulder height only. Constant tension through the range.',
    'machine lateral raise': 'Pads against the outside of the arms. Raise to shoulder height, lower slowly.',
    'single-arm db lateral raise': 'One side at a time, no torso swing. Raise to shoulder height with a soft elbow.',
    'band lateral raises': 'Stand on the band, lead with the elbows to shoulder height. Control the return.',
    'upright row (wide grip)': 'Wide grip and stop at chest height. Drop it if the shoulder pinches.',
    'prone y-raises': 'Face down, thumbs up, raise the arms into a Y. Light and slow - this is for the lower traps.',

    // --- Rear delts / upper back ---
    'cable reverse fly': 'Cables crossed, slight elbow bend. Open the arms wide and squeeze the rear delts.',
    'reverse cable fly': 'Slight elbow bend, open wide. Keep the traps relaxed and let the rear delts work.',
    'machine reverse fly': 'Chest on the pad, slight elbow bend. Squeeze the shoulder blades at the end range.',
    'bent-over cable fly': 'Hinge forward, arms sweeping wide. Avoid turning it into a row.',
    'prone db reverse fly': 'Face down on an incline bench. Light weight, wide arc, no swinging.',
    'db reverse fly': 'Hinge forward with a flat back. Slight elbow bend, squeeze the shoulder blades.',
    'band face pulls': 'Pull toward the face with high elbows. Finish with the hands beside the ears.',

    // --- Biceps ---
    'standard bicep curls (straight sets)': 'Elbows pinned at the sides. No swinging - control both directions.',
    'ez-bar curls': 'Angled grip is easier on the wrists. Keep the elbows still.',
    'cable curls': 'Constant tension throughout. Elbows stay at the sides.',
    'hammer curls': 'Neutral grip, thumbs up. Elbows pinned - this hits the brachialis and forearms.',
    'cable hammer curls': 'Rope attachment, neutral grip. Squeeze at the top without moving the elbows.',
    'cross-body hammer curls': 'Curl across the body toward the opposite shoulder. Neutral grip throughout.',
    'rope cable curls': 'Neutral grip on the rope, elbows fixed. Spread the rope slightly at the top.',
    'neutral-grip db curls': 'Palms facing in throughout. Elbows stay at the sides.',
    'backpack curls': 'Load a backpack and curl it with both hands. Slow tempo compensates for the light load.',
    'towel curls (myo-reps)': 'Loop a towel under the feet and curl against your own resistance. Activation set to near failure, then mini-sets with 15s rest.',

    // --- Triceps ---
    'standard tricep pushdowns (straight sets)': 'Elbows pinned at the sides. Full extension without leaning into the bar.',
    'overhead cable extension': 'Elbows stay high and close to the head. Stretch at the bottom, full lockout at the top.',
    'db overhead extension': 'Elbows point forward and stay put. Lower behind the head under control.',
    'rope pushdowns': 'Spread the rope at the bottom for a full contraction. Elbows fixed at the sides.',
    'v-bar pushdowns': 'Elbows tight to the ribs. Press to full extension and control the return.',
    'single-arm pushdowns': 'One side at a time, torso square. Keeps both arms honest.',

    // --- Calves ---
    'single-leg calf raise': 'Full stretch at the bottom, full squeeze at the top. Hold something for balance.',
    'calf raise on leg press': 'Push through the balls of the feet with a slight knee bend. Full range both ways.',
    'smith machine calf raise': 'Balls of the feet on a block. Pause at the top and stretch at the bottom.',
    'seated calf raise (different emphasis)': 'Bent knee shifts the work to the soleus. Slow tempo, full range.',
    'standing calf raise (different emphasis)': 'Straight knee targets the gastrocnemius. Full stretch at the bottom.',
    'single-leg seated calf raise': 'One leg at a time with a bent knee. Match the range on both sides.',
    'leg press calf raise': 'Balls of the feet on the platform edge. Full stretch, full squeeze, no bouncing.',
    'seated single-leg calf raise': 'Bent knee, one leg at a time. Slow and full range.',

    // --- Core: anti-rotation ---
    'cable woodchops': 'Rotate through the mid-back, not the lower back. Arms stay relatively straight.',
    'pallof press': 'Press straight out and resist the pull to rotate. Ribs down, glutes tight.',
    'half-kneeling pallof press': 'Half-kneeling narrows the base and raises the anti-rotation demand. Stay square.',
    'anti-rotation band holds': 'Hold the press-out position and resist rotation. Breathe throughout the hold.',
    'suitcase carries': 'Load one side only, walk tall without leaning. Ribs down, shoulders level.',
    'band anti-rotation press': 'Anchor the band at chest height, press out and resist the twist.',
    'band woodchops': 'Rotate through the mid-back. Control the return rather than letting the band pull you.',
    'russian twists': 'Rotate from the ribcage with a tall spine. Slow down if the lower back takes over.',
    'medicine ball chops': 'Rotate through the trunk with the arms long. Keep the hips relatively stable.',
    'landmine rotations': 'Rotate the bar in an arc, pivoting the back foot. Move from the trunk, not the arms.',

    // --- Core: anti-extension ---
    'dead bug': 'Lower back stays pressed into the floor. Extend the opposite arm and leg slowly, breathing throughout.',
    'modified dead bug (single leg)': 'One limb at a time. Lower back stays flat against the floor the whole time.',
    'bird dog': 'Extend the opposite arm and leg without letting the hips tilt. Hold briefly at the top.',
    'bird dog (easier)': 'Opposite arm and leg, hips level. Move slowly and pause at the top.',
    'modified bird dog (arm or leg only)': 'Move one limb at a time. Keep the hips square and the spine neutral.',
    'quadruped hold': 'Hands under shoulders, knees under hips, hover the knees an inch off the floor. Brace and breathe.',
    'hollow body hold': 'Lower back pinned to the floor, ribs down. Shorten the lever if the back arches.',
    'superman hold': 'Lift the chest and thighs slightly. Aim for a gentle contraction, not maximum extension.',
    'plank': 'Straight line from head to heels. Brace the abs and breathe - do not hold your breath.',
    'plank from knees': 'Knees down, straight line from head to knees. Same bracing, less load.',
    'rkc plank (max tension)': 'Short hold at maximum tension. Squeeze glutes, quads and abs hard throughout.',
    'plank with arm/leg lift': 'Lift one limb without letting the hips rotate. Slow and deliberate.',
    'plank on stability ball': 'Forearms on the ball. Resist the wobble without letting the hips sag.',
    'plank variations': 'Straight line from head to heels. Brace the abs and keep breathing.',

    // --- Core: lateral ---
    'side plank from knees': 'Knees bent, straight line from head to knees. Push the bottom hip up.',
    'side plank with rotation': 'From the side plank, rotate the top arm under the body and back. Hips stay high.',
    'side plank': 'Hips elevated, straight line from head to feet. Do not let the bottom hip sag.',
    'side-lying hip abduction': 'Lie on your side and raise the top leg. Keep the toes pointing forward, not up.',
    'copenhagen plank (advanced)': 'Top leg on the bench, hips lifted. Start with a bent bottom leg - this is demanding on the adductors.',

    // --- Core: hip flexion ---
    "captain's chair knee raise": 'Back against the pad. Curl the pelvis up rather than just swinging the legs.',
    'lying leg raise': 'Lower back stays on the floor. Reduce the range if it starts to arch.',
    'lying leg raises': 'Lower back stays pressed down. Lower the legs only as far as you can hold that.',
    'reverse crunches': 'Curl the hips off the floor. Small controlled range beats momentum.',
    'decline sit-ups': 'Curl up one vertebra at a time. Stop if it pulls on the lower back.',

    // --- Conditioning ---
    'rowing machine intervals (10x30s/30s)': 'Ten rounds: 30s hard, 30s easy. Drive with the legs first, then the back and arms.',
    'assault bike': 'Ten rounds: 30s hard, 30s easy. Push with the arms as well as the legs.',
    'ski erg': 'Ten rounds: 30s hard, 30s easy. Hinge at the hips and drive down through the lats.',
    'treadmill sprints (if no knee issues)': 'Ten rounds: 30s hard, 30s easy. Skip this if the knees object.',
    'hiit burpees (10x30s/30s)': 'Ten rounds: 30s work, 30s rest. Step back rather than jumping if the chest complains.',
    'incline treadmill walk': 'Zone 2 - a conversational pace. Raise the incline rather than the speed.',
    'elliptical': 'Zone 2 - steady and conversational. Keep the effort easy enough to talk.',
    'swimming': 'Zone 2 - steady laps at a conversational effort.',
    'rowing machine (lower intensity)': 'Zone 2 - steady pace, legs first. Easy enough to hold a conversation.',
    'steady-state cardio (running/jump rope)': 'Zone 2 - a conversational pace throughout.'
};

/**
 * Look up form cues for an exercise by name.
 * Matching is case-insensitive so option lists and bodyweight substitutions
 * that differ only in capitalisation resolve to the same entry.
 */
function getExerciseInstructions(exerciseName) {
    if (!exerciseName) return null;
    return EXERCISE_INSTRUCTIONS[String(exerciseName).toLowerCase().trim()] || null;
}

/**
 * Bodyweight Substitutions
 * Based on workout-tracker-spec.md Bodyweight Substitutions section
 * Maps gym exercises to bodyweight alternatives for home/travel workouts
 */
const BODYWEIGHT_SUBSTITUTIONS = {
    // Pressing
    'Neutral-Grip DB Floor Press': 'Elevated Push-ups (limited ROM)',
    'Cable Press (decline, neutral)': 'Decline Push-ups',
    'Cable Press (incline)': 'Pike Push-ups',

    // Rows
    'Barbell Row': 'Inverted Rows (under table)',
    'Cable Row': 'Towel Rows',

    // Shoulders
    'DB Overhead Press': 'Pike Push-ups',
    'DB Lateral Raise': 'Band Lateral Raises',
    'DB Reverse Fly': 'Prone Y-raises',
    'Face Pulls': 'Band Face Pulls',

    // Arms
    'Bicep Curls (Myo-reps)': 'Towel Curls (Myo-reps)',
    'Hammer Curls': 'Backpack Curls',
    'Tricep Pushdowns (Myo-reps)': 'Diamond Push-ups (Myo-reps)',
    'Close-Grip Pushdowns': 'Close-Grip Push-ups',

    // Legs
    'Back Squat': 'Pistol Squats (assisted)',
    'Bulgarian Split Squat': 'Bulgarian Split Squats (bodyweight)',
    'Romanian Deadlift': 'Single-Leg RDL (bodyweight)',
    'Stiff-Leg Deadlift': 'Good Mornings (bodyweight)',
    'Leg Curl': 'Nordic Curls (eccentric)',
    'Leg Extension': 'Sissy Squats',
    'Walking Lunges': 'Walking Lunges (bodyweight)',

    // Calves
    'Standing Calf Raise': 'Single-Leg Calf Raise',
    'Seated Calf Raise': 'Seated Single-Leg Calf Raise',

    // Core (already bodyweight)
    'Pallof Press': 'Band Anti-Rotation Press',
    'Dead Bug': 'Dead Bug',
    'Bird Dog': 'Bird Dog',
    'Plank': 'Plank',
    'Side Plank': 'Side Plank',
    'Hanging Knee Raise': 'Lying Leg Raises',
    'Cable Woodchops': 'Band Woodchops',

    // Pulldowns
    'Cable Pulldown': 'Pull-ups or Chin-ups',

    // Cardio
    'HIIT Bike Intervals': 'HIIT Burpees (10x30s/30s)',
    'Steady-State Cardio': 'Steady-State Cardio (running/jump rope)'
};

/**
 * Get bodyweight substitution for an exercise
 */
function getBodyweightSubstitution(exerciseName) {
    return BODYWEIGHT_SUBSTITUTIONS[exerciseName] || exerciseName;
}

// ==================== OPTIONAL WORKOUTS ====================

/**
 * Optional workouts for bonus volume during office weeks
 * These are NOT required for progress - the core 4-day program is sufficient
 * No progression tracking - use consistent moderate weights
 */
const OPTIONAL_WORKOUTS = {
    quick_upper: {
        id: 'quick_upper',
        name: 'Quick Upper Accessory',
        description: 'Extra arm volume, maintain upper body frequency',
        duration: '25 minutes',
        purpose: 'Extra arm volume, maintain upper body frequency',
        bestFor: 'Tuesday or Wednesday when you have 30 minutes',
        isOptional: true,
        exercises: [
            {
                name: 'Cable Face Pulls',
                sets: 3,
                reps: '15',
                rest: 60,
                notes: 'Focus on rear delts and external rotation'
            },
            {
                name: 'Bicep Curls (DB or Cable)',
                sets: 3,
                reps: '12',
                rest: 60,
                notes: 'Can superset with triceps to save time (90s rest between supersets)'
            },
            {
                name: 'Tricep Extensions (Cable)',
                sets: 3,
                reps: '12',
                rest: 60,
                notes: 'Can superset with biceps to save time'
            },
            {
                name: 'Pallof Press',
                sets: 2,
                reps: '10/side',
                rest: 60,
                category: 'core'
            }
        ],
        notes: [
            'Use same weight each session (don\'t progress)',
            'Focus on form and muscle contraction',
            'Skip if arms still sore from Upper A/B'
        ]
    },

    zone2_cardio: {
        id: 'zone2_cardio',
        name: 'Zone 2 Cardio',
        description: 'Cardiovascular health, active recovery',
        duration: '30 minutes',
        purpose: 'Cardiovascular health, active recovery',
        bestFor: 'Any day Tue-Thu, especially after Upper days',
        isOptional: true,
        exercises: [
            {
                name: 'Zone 2 Cardio',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 30, // minutes
                reps: '30 min',
                rest: 0,
                category: 'cardio',
                notes: 'Conversational pace. Options: bike, incline walk, elliptical, rowing, swimming'
            }
        ],
        notes: [
            'Can hold a conversation throughout',
            'Heart rate ~60-70% max',
            'Should feel easier as workout progresses',
            'Don\'t turn this into HIIT or tempo work'
        ]
    },

    core_mobility: {
        id: 'core_mobility',
        name: 'Core + Mobility',
        description: 'Injury prevention, movement quality, feel better',
        duration: '20 minutes',
        purpose: 'Injury prevention, movement quality, feel better',
        bestFor: 'Tuesday or Wednesday, especially during office weeks',
        isOptional: true,
        exercises: [
            {
                name: 'Thoracic Extensions',
                exerciseType: 'completion',
                sets: 1,
                reps: '10 passes',
                rest: 0,
                notes: 'On foam roller'
            },
            {
                name: 'Cat-Cow',
                sets: 1,
                reps: '15',
                rest: 0
            },
            {
                name: 'World\'s Greatest Stretch',
                sets: 1,
                reps: '5/side',
                rest: 0
            },
            {
                name: 'Wall Slides',
                sets: 1,
                reps: '10',
                rest: 0
            },
            {
                name: 'Hip 90/90 Stretches',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 60, // seconds
                durationUnit: 'seconds',
                reps: '60s/side',
                rest: 0
            },
            {
                name: 'Dead Bug',
                sets: 3,
                reps: '10/side',
                rest: 30,
                category: 'core'
            },
            {
                name: 'Plank',
                exerciseType: 'duration',
                sets: 3,
                targetDuration: 60, // seconds
                durationUnit: 'seconds',
                reps: '45-60s',
                rest: 30,
                category: 'core'
            },
            {
                name: 'Suitcase Carries',
                exerciseType: 'completion',
                sets: 2,
                reps: '40 yards/side',
                rest: 60,
                category: 'core'
            },
            {
                name: 'Bird Dog',
                sets: 2,
                reps: '10/side',
                rest: 30,
                category: 'core'
            }
        ],
        notes: [
            'Use this on days you feel stiff or tight',
            'Particularly valuable during office weeks',
            'Can do this at home if gym access is limited'
        ]
    },

    upper_pump: {
        id: 'upper_pump',
        name: 'Upper Pump Session',
        description: 'Extra volume without CNS fatigue',
        duration: '30 minutes',
        purpose: 'Extra volume without CNS fatigue before Friday\'s Upper A',
        bestFor: 'Thursday of home weeks only',
        isOptional: true,
        exercises: [
            {
                name: 'Cable Press (any angle)',
                sets: 3,
                reps: '12-15',
                rest: 60,
                notes: 'Use 50-60% of your DB floor press weight equivalent'
            },
            {
                name: 'Cable Row (any angle)',
                sets: 3,
                reps: '12-15',
                rest: 90
            },
            {
                name: 'Lateral Raises',
                sets: 3,
                reps: '15',
                rest: 60,
                notes: 'Very light weight, focus on deltoid burn'
            },
            {
                name: 'Cable Curls',
                sets: 2,
                reps: '15',
                rest: 60
            },
            {
                name: 'Cable Tricep Pushdowns',
                sets: 2,
                reps: '15',
                rest: 60
            },
            {
                name: 'Pallof Press',
                sets: 2,
                reps: '10/side',
                rest: 60,
                category: 'core'
            }
        ],
        notes: [
            'Only on Thursday - gives 24h before Friday\'s Upper A',
            'Never on Wednesday - too close to Friday\'s heavy work',
            'Light weights, high reps, chase the pump',
            'Skip entirely during office weeks'
        ]
    },

    lower_accessories: {
        id: 'lower_accessories',
        name: 'Lower Body Accessories',
        description: 'Extra glute/hamstring work, calf development',
        duration: '25 minutes',
        purpose: 'Extra glute/hamstring work, calf development',
        bestFor: 'Wednesday of home weeks (between Lower A and Upper B)',
        isOptional: true,
        exercises: [
            {
                name: 'Glute Bridges',
                sets: 3,
                reps: '15-20',
                rest: 60,
                notes: 'Can add barbell across hips if desired'
            },
            {
                name: 'Hamstring Curls',
                sets: 3,
                reps: '12-15',
                rest: 60
            },
            {
                name: 'Standing Calf Raises',
                sets: 4,
                reps: '20',
                rest: 45
            },
            {
                name: 'Adductor Machine',
                sets: 2,
                reps: '15',
                rest: 60,
                notes: 'If available'
            },
            {
                name: 'Abductor Machine',
                sets: 2,
                reps: '15',
                rest: 60,
                notes: 'If available'
            }
        ],
        notes: [
            'Avoid heavy compound movements (squats, deadlifts)',
            'Focus on isolation and muscle feel',
            'Skip if still sore from Monday\'s Lower B'
        ]
    }
};

/**
 * Get optional workout by ID
 */
function getOptionalWorkout(workoutId) {
    return OPTIONAL_WORKOUTS[workoutId];
}

/**
 * Get all optional workouts as array
 */
function getAllOptionalWorkouts() {
    return Object.values(OPTIONAL_WORKOUTS);
}

/**
 * Lean Body / Lean Bulk - Advanced Regimen
 *
 * Source: BodyHealth, "Advanced Workout Regimen For Lean Body/Lean Bulk".
 * 5-6 days per week, one muscle group per day, with abdominals or Zone 2
 * cardio on alternating days. 4-6 exercises per day, 3-4 sets each.
 *
 * Reps: the source prescribes 6-8 after an introductory week at 8-12, except
 * where it says "8-12 every week" (lateral raises, rear delt flys, all arm
 * work). The week-one range is noted on each exercise rather than duplicating
 * the whole plan.
 *
 * Rest: the source says 90 seconds to 3 minutes between sets, and 30 seconds
 * for abdominal work. Compounds use 120s and accessories 90s - both inside
 * that range, and chosen to keep sessions near this project's 60-75 minute
 * target.
 *
 * Costochondritis adaptations (this programme is chest-pressing heavy, and
 * the source's own choices conflict with the constraints in
 * workout-tracker-spec.md). Each adapted exercise names its original in its
 * notes so the change is visible in the app:
 *   - Incline Barbell Bench Press -> Neutral-Grip DB Press (Low Incline)
 *   - Flat Barbell Bench Press    -> Neutral-Grip DB Floor Press
 *   - Dumbbell Chest Flys         -> Cable Press (decline, neutral)
 *   - Seated Military Press       -> Seated Neutral-Grip DB Press
 *   - Bench Incline Rear Delt Fly -> Cable Reverse Fly
 * Everything else is as written in the source.
 */
const LEAN_BULK_WORKOUTS = {
    lb_chest: {
        id: 'lb_chest',
        name: 'Chest Day',
        description: 'Chest pressing plus abdominals',
        focus: 'Hypertrophy',
        exercises: [
            {
                name: 'Neutral-Grip DB Press (Low Incline)',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'ADAPTED from Incline Barbell Bench Press for chest safety. Warm up first: 12 reps at half weight, rest 1 min; 10 reps same weight slightly faster, rest 1 min; 6 reps at +5-10lbs. Week one use 8-12 reps. Palms face each other, elbows at ~45°.'
            },
            {
                name: 'Cable Press (decline, neutral)',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'ADAPTED from Dumbbell Chest Flys - a deep fly stretches the sternum under load. Week one use 8-12 reps. Neutral grip, stop before the chest feels stretched.'
            },
            {
                name: 'Neutral-Grip DB Floor Press',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'ADAPTED from Flat Barbell Bench Press for chest safety. The floor stops the descent, limiting range. Week one use 8-12 reps. Maintain scapular retraction.'
            },
            {
                name: 'Cable Crunches',
                sets: 3,
                reps: '12',
                rest: 30,
                category: 'core',
                notes: 'Pick one abdominal exercise (or more if you have the energy) - substitute for the alternatives. If you can do more than 12, add weight.'
            }
        ]
    },

    lb_back: {
        id: 'lb_back',
        name: 'Back Day',
        description: 'Back work plus Zone 2 cardio',
        focus: 'Hypertrophy',
        exercises: [
            {
                name: 'Barbell Deadlift',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'Two warm-up sets first. Week one use 8-12 reps. Hinge at the hips, bar close to the legs, neutral spine - never round the back to finish a rep.'
            },
            {
                name: 'Dumbbell Row (Left Arm)',
                sets: 3,
                reps: '6-8',
                rest: 90,
                notes: 'Week one use 8-12 reps. Lead with the elbow, pull to the hip, keep the hips square.'
            },
            {
                name: 'Dumbbell Row (Right Arm)',
                sets: 3,
                reps: '6-8',
                rest: 90,
                notes: 'Week one use 8-12 reps. Match the reps and weight you managed on the left.'
            },
            {
                name: 'Close-Grip Lat Pulldown',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'Week one use 8-12 reps. Chest tall, pull to the collarbone, no leaning back to move the weight.'
            },
            {
                name: 'Weighted Hyper Extension',
                sets: 3,
                reps: '12',
                rest: 90,
                notes: 'Squeeze the glutes to raise the torso and stop at a straight line - do not hyperextend. Substitute for Supermans (15-20 reps) if no bench is free.'
            },
            {
                name: 'Zone 2 Cardio',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 10,
                durationUnit: 'minutes',
                reps: '10 min',
                rest: 0,
                category: 'cardio',
                notes: 'Conversational pace - this is the fat-burning zone and will not cost you muscle. Incline treadmill walk, stair master, stationary bike or rower.'
            }
        ]
    },

    lb_shoulders: {
        id: 'lb_shoulders',
        name: 'Shoulders Day',
        description: 'Shoulder work plus abdominals',
        focus: 'Hypertrophy',
        exercises: [
            {
                name: 'Seated Neutral-Grip DB Press',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'ADAPTED from Seated Military Press - a neutral grip keeps load off the sternum. Two warm-up sets first. Week one use 8-12 reps. Ribs down, no lower-back arch. Drop the weight if the chest complains.'
            },
            {
                name: 'Side Lateral Raise',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week, not just week one. Lead with the elbow and raise only to shoulder height.'
            },
            {
                name: 'Arnold Press',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'Week one use 8-12 reps. Use a partial rotation rather than a full turn, and stop if the sternum complains.'
            },
            {
                name: 'Cable Reverse Fly',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: 'ADAPTED from Bench Incline Rear Delt Flys - lying chest-down presses the sternum into the pad. 8-12 reps every week. Slight elbow bend, open wide, keep the traps relaxed.'
            },
            {
                name: 'Cable Crunches',
                sets: 3,
                reps: '12',
                rest: 30,
                category: 'core',
                notes: 'Pick one abdominal exercise - substitute for the alternatives. If you can do more than 12, add weight.'
            }
        ]
    },

    lb_legs: {
        id: 'lb_legs',
        name: 'Leg Day',
        description: 'Legs plus Zone 2 cardio',
        focus: 'Hypertrophy',
        exercises: [
            {
                name: 'Barbell Front Squat',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'Two warm-up sets first. Week one use 8-12 reps. Substitute for a Goblet Squat if the front rack bothers your chest or wrists. Chest up, knees tracking over the toes.'
            },
            {
                name: 'Split Squat',
                sets: 3,
                reps: '6-8/leg',
                rest: 90,
                notes: 'Week one use 8-12 reps per leg. Goblet hold or dumbbells at your sides. Drop the back knee straight down rather than leaning forward.'
            },
            {
                name: 'Romanian Deadlift',
                sets: 4,
                reps: '6-8',
                rest: 120,
                notes: 'Week one use 8-12 reps. Hinge at the hips with a soft knee. Feel the stretch in the hamstrings, not the lower back.'
            },
            {
                name: 'Zone 2 Cardio',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 10,
                durationUnit: 'minutes',
                reps: '10 min',
                rest: 0,
                category: 'cardio',
                notes: 'Conversational pace. Incline treadmill walk, stair master, stationary bike or rower.'
            }
        ]
    },

    lb_arms: {
        id: 'lb_arms',
        name: 'Arms Day',
        description: 'Biceps and triceps plus abdominals',
        focus: 'Hypertrophy',
        exercises: [
            {
                name: 'Barbell Curl',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week. Two warm-up sets before the first biceps exercise. Elbows pinned at the sides, no swinging. Substitute for a supine dumbbell curl if the bar bothers your wrists.'
            },
            {
                name: 'Hammer Curls',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week. Neutral grip, thumbs up, elbows still.'
            },
            {
                name: 'Preacher Curl',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week. Upper arms flat on the pad, control the lowering all the way.'
            },
            {
                name: 'Seated Triceps Press',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week. Two warm-up sets before the first triceps exercise. Elbows high and close to the head.'
            },
            {
                name: 'Crossover Cable Extension',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week. Elbows fixed, press to full extension and control the return.'
            },
            {
                name: 'Skull Crushers',
                sets: 3,
                reps: '8-12',
                rest: 90,
                notes: '8-12 reps every week. Lower to the forehead with the elbows pointing up. Substitute for a Katana extension if the elbows object.'
            },
            {
                name: 'Cable Crunches',
                sets: 3,
                reps: '12',
                rest: 30,
                category: 'core',
                notes: 'Pick one abdominal exercise - substitute for the alternatives. If you can do more than 12, add weight.'
            }
        ]
    }
};

/**
 * Optional sixth day. The source leaves its content up to you - weak points
 * plus optional cardio - so nothing specific is prescribed here.
 */
const LEAN_BULK_OPTIONAL_WORKOUTS = {
    lb_day6: {
        id: 'lb_day6',
        name: 'Optional Day 6',
        description: 'Weak-point work and optional cardio',
        duration: '30-45 minutes',
        purpose: 'Bring up lagging muscles; optional extra cardio',
        bestFor: 'Only when you genuinely have energy to spare',
        isOptional: true,
        exercises: [
            {
                name: 'Weak-Point Work',
                exerciseType: 'completion',
                sets: 1,
                reps: 'Your choice of exercises',
                rest: 0,
                notes: 'The source does not prescribe exercises here - pick whatever muscles you feel are behind. Skip this day entirely if you are tired; do not overtrain.'
            },
            {
                name: 'Optional Cardio',
                exerciseType: 'duration',
                sets: 1,
                targetDuration: 20,
                durationUnit: 'minutes',
                reps: '20 min',
                rest: 0,
                category: 'cardio',
                notes: 'Only if you have energy to spare. Extra cardio beyond Zone 2 can work against a lean bulk.'
            }
        ],
        notes: [
            'Optional - the programme works as five days',
            'Expect to be hungrier if you add this day; eat accordingly',
            'Skip it if you are run down, and stop entirely if you get ill'
        ]
    }
};

// Merge into the global registries. Ids stay globally resolvable so history,
// the Sheets log and an in-progress session work across plans.
Object.assign(WORKOUTS, LEAN_BULK_WORKOUTS);
Object.assign(OPTIONAL_WORKOUTS, LEAN_BULK_OPTIONAL_WORKOUTS);

/**
 * Substitutions and form cues for the Lean Body/Lean Bulk plan.
 *
 * Merged rather than inlined above so the whole plan stays in one block.
 * Options reuse names already present in EXERCISE_INSTRUCTIONS wherever
 * possible; the few genuinely new movements get cues below.
 */
Object.assign(SUBSTITUTIONS, {
    'Neutral-Grip DB Press (Low Incline)': {
        options: [
            'Landmine press',
            'Neutral-grip DB press on flat bench (limited ROM)',
            'Machine press (neutral grip if available)',
            'Light DB press (higher reps)'
        ],
        avoid: ['Barbell bench press', 'Wide-grip pressing variations', 'Full range dips'],
        notes: 'Keep a neutral grip and a shortened range. Never swap back to a barbell bench.'
    },

    'Cable Crunches': {
        options: ['Toe touches', 'Lying leg raise', 'Reverse crunches', "Captain's chair knee raise"],
        notes: 'Pick one. The source allows more than one abdominal exercise on chest day if you have the energy.'
    },

    'Barbell Deadlift': {
        options: ['Trap bar deadlift', 'Romanian deadlift', 'Dumbbell RDL (easier to control)', 'Back extension'],
        notes: 'Stop the set when the back starts to round, not when the legs give out.'
    },

    'Dumbbell Row (Left Arm)': {
        options: ['Chest-supported DB row', 'Single-arm cable row', 'Seal row', 'T-bar row'],
        notes: 'Match whatever you do on the right arm.'
    },

    'Dumbbell Row (Right Arm)': {
        options: ['Chest-supported DB row', 'Single-arm cable row', 'Seal row', 'T-bar row'],
        notes: 'Match whatever you did on the left arm.'
    },

    'Close-Grip Lat Pulldown': {
        options: ['Lat pulldown (any machine)', 'Pull-ups or chin-ups', 'Assisted pull-ups', 'Single-arm cable pulldown'],
        notes: 'A close, neutral grip is easiest on the shoulders.'
    },

    'Weighted Hyper Extension': {
        options: ['Superman hold', 'Back extension', 'Good mornings (bodyweight)'],
        notes: 'The source offers Supermans at 15-20 reps as the alternative.'
    },

    'Zone 2 Cardio': {
        options: ['Incline treadmill walk', 'Stair master', 'Stationary bike', 'Rowing machine (lower intensity)'],
        notes: 'Any of these is fine - stay conversational so it does not eat into recovery.'
    },

    'Seated Neutral-Grip DB Press': {
        options: ['Landmine press', 'Machine shoulder press', 'Arnold press (partial rotation)', 'Seated DB press'],
        avoid: ['Heavy barbell military press'],
        notes: 'Neutral or partially rotated grips keep load off the sternum. Drop the weight if the chest flares.'
    },

    'Side Lateral Raise': {
        options: ['Cable lateral raise', 'Machine lateral raise', 'Single-arm DB lateral raise', 'Band lateral raises'],
        notes: 'Raise to shoulder height only - higher brings the traps in.'
    },

    'Arnold Press': {
        options: ['Seated DB press', 'Machine shoulder press', 'Landmine press'],
        notes: 'Use a partial rotation. Stop if the sternum complains.'
    },

    'Cable Reverse Fly': {
        options: ['Machine reverse fly', 'Reverse cable fly', 'Prone DB reverse fly', 'Band face pulls'],
        notes: 'Avoid lying chest-down on a bench if that presses uncomfortably on the sternum.'
    },

    'Barbell Front Squat': {
        options: [
            'Goblet squat (lighter load, good for hypertrophy)',
            'Safety bar squat (reduced thoracic stress)',
            'Hack squat machine',
            'Leg press (not ideal, but acceptable)'
        ],
        notes: 'The source offers a goblet squat as the alternative. Swap if the front rack presses on the chest or wrists.'
    },

    'Split Squat': {
        options: [
            'Regular split squat (both feet on ground)',
            'Rear foot elevated split squat with support',
            'Single-leg leg press',
            'Walking lunges'
        ],
        notes: 'Hold a rail if balance is the limiting factor rather than the legs.'
    },

    'Barbell Curl': {
        options: ['Supine dumbbell curl', 'EZ-bar curls', 'Cable curls', 'Neutral-grip DB curls'],
        notes: 'The source offers a supine dumbbell curl as the alternative.'
    },

    'Preacher Curl': {
        options: ['EZ-bar curls', 'Cable curls', 'Standard bicep curls (straight sets)', 'Neutral-grip DB curls'],
        notes: 'Keep the upper arms flat on the pad and control the lowering.'
    },

    'Seated Triceps Press': {
        options: ['DB overhead extension', 'Overhead cable extension', 'Rope pushdowns'],
        notes: 'Elbows stay high and close to the head.'
    },

    'Crossover Cable Extension': {
        options: ['Rope pushdowns', 'V-bar pushdowns', 'Single-arm pushdowns', 'Overhead cable extension'],
        notes: 'Elbows pinned - the movement is at the elbow only.'
    },

    'Skull Crushers': {
        options: ['Katana extension', 'DB overhead extension', 'Close-grip bench press', 'Overhead cable extension'],
        notes: 'The source offers a Katana extension as the alternative. Swap if the elbows object.'
    },

    'Optional Cardio': {
        options: ['Incline treadmill walk', 'Stair master', 'Stationary bike', 'Rowing machine (lower intensity)'],
        notes: 'Only if you have energy to spare - extra cardio can work against a lean bulk.'
    }
});

Object.assign(EXERCISE_INSTRUCTIONS, {
    'stair master': 'Stand tall, no leaning on the rails. Conversational pace - this is Zone 2, not a climb for time.',
    'stationary bike': 'Zone 2 - steady, conversational effort. Set resistance so the legs work without burning.',
    'toe touches': 'Lie on your back, legs up, and reach for the toes by curling the shoulders off the floor. To failure.',
    'trap bar deadlift': 'Neutral grip inside the frame, chest up. Easier on the lower back than a straight bar.',
    'katana extension': 'Single cable across the body, elbow fixed and high. Extend to a full lockout, control the return.',
    'supine dumbbell curl': 'Lie back on an incline bench and let the arms hang. The stretched start makes this harder than it looks - go light.'
});
