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
                rest: 180,
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
                rest: 90,
                superset: 'Cable Row',
                notes: 'Set cables at high position for decline angle. Maintain neutral grip.'
            },
            {
                name: 'Cable Row',
                sets: 3,
                reps: '10-12',
                rest: 90,
                superset: 'Cable Press (decline, neutral)',
                notes: 'Control the negative. Avoid shrugging shoulders.'
            },
            {
                name: 'DB Lateral Raise',
                sets: 3,
                reps: '12-15',
                rest: 90,
                superset: 'DB Reverse Fly',
                notes: 'Slight bend in elbows. Lead with elbows, not hands.'
            },
            {
                name: 'DB Reverse Fly',
                sets: 3,
                reps: '12-15',
                rest: 90,
                superset: 'DB Lateral Raise',
                notes: 'Hinge at hips. Squeeze shoulder blades together at top.'
            },
            {
                name: 'Bicep Curls (Myo-reps)',
                sets: 2,
                reps: '12-15+3x3-5',
                rest: 30,
                notes: 'Activation set: 12-15 reps to near failure. Rest 15s. Do 3 mini-sets of 3-5 reps with 15s rest.'
            },
            {
                name: 'Tricep Pushdowns (Myo-reps)',
                sets: 2,
                reps: '12-15+3x3-5',
                rest: 30,
                notes: 'Activation set: 12-15 reps to near failure. Rest 15s. Do 3 mini-sets of 3-5 reps with 15s rest.'
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
                sets: 3,
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
                rest: 180,
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
                rest: 90,
                superset: 'Leg Extension',
                notes: 'Control the eccentric. Full range of motion.'
            },
            {
                name: 'Leg Extension',
                sets: 3,
                reps: '10-12',
                rest: 90,
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
                sets: 1,
                reps: '10x30s/30s',
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
                rest: 180,
                notes: 'Heavier than Upper A. Maintain scapular retraction. Explosive concentric, controlled eccentric.'
            },
            {
                name: 'Barbell Row',
                sets: 5,
                reps: '4-6',
                rest: 180,
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
                rest: 90,
                notes: 'Neutral grip throughout. Control the eccentric.'
            },
            {
                name: 'Close-Grip Pushdowns',
                sets: 3,
                reps: '8-10',
                rest: 90,
                notes: 'Elbows tucked. Full extension at bottom. Squeeze triceps.'
            },
            {
                name: 'Plank',
                sets: 3,
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
                rest: 90,
                superset: 'Nordic Curls',
                notes: 'Long stride. Knee doesn\'t pass toes. Keep torso upright.'
            },
            {
                name: 'Nordic Curls',
                sets: 3,
                reps: 'AMRAP',
                rest: 90,
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
                sets: 1,
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
                rest: 90,
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
