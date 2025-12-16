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
 * Get exercise substitutions (future feature)
 */
const SUBSTITUTIONS = {
    'Neutral-Grip DB Floor Press': [
        'Neutral-grip DB press on low incline (15-30°)',
        'Landmine press',
        'Neutral-grip DB press on flat bench (limited ROM)'
    ],
    'Barbell Row': [
        'Pendlay row',
        'Chest-supported DB row',
        'T-bar row',
        'Seal row'
    ],
    'Back Squat': [
        'Safety bar squat',
        'Goblet squat',
        'Hack squat machine',
        'Leg press'
    ],
    'Bulgarian Split Squat': [
        'Rear foot elevated split squat with support',
        'Regular split squat',
        'Single-leg leg press'
    ],
    'Nordic Curls': [
        'Eccentric-only nordic curls',
        'Band-assisted nordic curls',
        'Lying leg curl with slow eccentric',
        'Glute-ham raise'
    ]
};
