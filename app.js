/**
 * Workout Tracker Application
 * Main application logic with Google Sheets integration
 * Updated with full workout view - all exercises visible at once
 */

// ==================== STATE MANAGEMENT ====================

const AppState = {
    currentView: 'home',
    currentWorkout: null,
    workoutData: [],
    workoutStartTime: null,
    isTimerRunning: false,
    timerInterval: null,
    remainingTime: 0,
    totalRestTime: 0,
    timerEndTime: null, // Timestamp when timer should end
    wakeLock: null, // Wake lock to keep screen on
    isAuthenticated: false,
    gapiInited: false,
    gisInited: false,
    tokenClient: null,
    sheetId: null,
    activeExerciseIndex: null,
    substitutions: {}, // Tracks exercise substitutions {exerciseIndex: substitutedName}
    currentSubstitutionExercise: null, // Currently viewing substitutions for this exercise
    bodyweightMode: false, // Bodyweight mode enabled/disabled
    isOptionalWorkout: false // Track if current workout is optional
};

// ==================== LOCAL STORAGE ====================

const Storage = {
    KEYS: {
        WORKOUTS: 'workout_tracker_workouts',
        CONFIG: 'workout_tracker_config',
        THEME: 'workout_tracker_theme',
        GOOGLE_TOKEN: 'workout_tracker_google_token',
        IN_PROGRESS_WORKOUT: 'workout_tracker_in_progress'
    },

    // Save in-progress workout (auto-save during workout)
    saveInProgressWorkout(workoutData) {
        const inProgressWorkout = {
            workoutType: AppState.currentWorkout,
            isOptional: AppState.isOptionalWorkout,
            startTime: AppState.workoutStartTime,
            exercises: AppState.workoutData,
            substitutions: AppState.substitutions,
            lastSaved: Date.now()
        };
        localStorage.setItem(this.KEYS.IN_PROGRESS_WORKOUT, JSON.stringify(inProgressWorkout));
    },

    // Get in-progress workout
    getInProgressWorkout() {
        const data = localStorage.getItem(this.KEYS.IN_PROGRESS_WORKOUT);
        return data ? JSON.parse(data) : null;
    },

    // Clear in-progress workout
    clearInProgressWorkout() {
        localStorage.removeItem(this.KEYS.IN_PROGRESS_WORKOUT);
    },

    // Save workout log
    saveWorkout(workout) {
        const workouts = this.getAllWorkouts();
        workouts.push(workout);
        localStorage.setItem(this.KEYS.WORKOUTS, JSON.stringify(workouts));
        // Clear in-progress workout since it's now completed
        this.clearInProgressWorkout();
    },

    // Get all workout logs
    getAllWorkouts() {
        const data = localStorage.getItem(this.KEYS.WORKOUTS);
        return data ? JSON.parse(data) : [];
    },

    // Get previous workout of same type
    getPreviousWorkout(workoutId) {
        const workouts = this.getAllWorkouts()
            .filter(w => w.workoutType === workoutId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        return workouts.length > 0 ? workouts[0] : null;
    },

    // Get previous performance for specific exercise
    getPreviousExerciseData(workoutId, exerciseName) {
        const workout = this.getPreviousWorkout(workoutId);
        if (!workout) return null;

        const exercise = workout.exercises.find(e => e.name === exerciseName);
        return exercise || null;
    },

    // Save configuration
    saveConfig(config) {
        localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(config));
    },

    // Get configuration
    getConfig() {
        const data = localStorage.getItem(this.KEYS.CONFIG);
        return data ? JSON.parse(data) : { sheetId: CONFIG.SHEET_ID };
    },

    // Save theme preference
    saveTheme(isDark) {
        localStorage.setItem(this.KEYS.THEME, isDark ? 'dark' : 'light');
    },

    // Get theme preference
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    // Save bodyweight mode preference
    saveBodyweightMode(isBodyweight) {
        localStorage.setItem('workout_tracker_bodyweight_mode', isBodyweight ? 'true' : 'false');
    },

    // Get bodyweight mode preference
    getBodyweightMode() {
        const mode = localStorage.getItem('workout_tracker_bodyweight_mode');
        return mode === 'true';
    },

    // Save Google OAuth token
    saveGoogleToken(token) {
        localStorage.setItem(this.KEYS.GOOGLE_TOKEN, JSON.stringify(token));
    },

    // Get Google OAuth token
    getGoogleToken() {
        const data = localStorage.getItem(this.KEYS.GOOGLE_TOKEN);
        return data ? JSON.parse(data) : null;
    },

    // Clear Google OAuth token
    clearGoogleToken() {
        localStorage.removeItem(this.KEYS.GOOGLE_TOKEN);
    },

    // Clear all data
    clearAll() {
        if (confirm('Are you sure you want to clear all workout data? This cannot be undone.')) {
            localStorage.removeItem(this.KEYS.WORKOUTS);
            alert('All data cleared successfully.');
            location.reload();
        }
    },

    // Export to CSV
    exportToCSV() {
        const workouts = this.getAllWorkouts();
        if (workouts.length === 0) {
            alert('No workout data to export.');
            return;
        }

        let csv = 'Date,Workout Type,Exercise,Set,Reps,Weight (lbs),Rest (s)\n';

        workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                exercise.sets.forEach(set => {
                    csv += `${workout.date},${workout.workoutType},${exercise.name},${set.setNumber},${set.reps},${set.weight},${exercise.rest}\n`;
                });
            });
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workout-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// ==================== GOOGLE SHEETS API ====================

const SheetsAPI = {
    // Initialize Google API
    async initializeGapiClient() {
        console.log('Initializing GAPI client...');
        try {
            await gapi.client.init({
                apiKey: '', // Not needed for OAuth flow
                discoveryDocs: [CONFIG.DISCOVERY_DOC],
            });
            AppState.gapiInited = true;
            console.log('GAPI client initialized successfully');
            this.maybeEnableButtons();
        } catch (error) {
            console.error('Error initializing GAPI client:', error);
            alert('Error loading Google Sheets API. Please refresh the page.');
        }
    },

    // Initialize Google Identity Services
    initializeGisClient() {
        console.log('Initializing GIS client...');
        try {
            AppState.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CONFIG.CLIENT_ID,
                scope: CONFIG.SCOPES,
                callback: '', // Will be set dynamically
            });
            AppState.gisInited = true;
            console.log('GIS client initialized successfully');
            this.maybeEnableButtons();
        } catch (error) {
            console.error('Error initializing GIS client:', error);
            alert('Error loading Google Sign-In. Please refresh the page.');
        }
    },

    // Enable auth buttons when both APIs are ready
    maybeEnableButtons() {
        if (AppState.gapiInited && AppState.gisInited) {
            // Try to restore saved token
            const savedToken = Storage.getGoogleToken();
            if (savedToken) {
                gapi.client.setToken(savedToken);
                AppState.isAuthenticated = true;
                UI.updateAuthStatus(true);
                console.log('Restored saved Google token');
            } else {
                UI.updateAuthStatus(false);
            }
        }
    },

    // Handle authentication
    handleAuthClick() {
        AppState.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }

            // Save the token to localStorage for persistence
            const token = gapi.client.getToken();
            if (token) {
                Storage.saveGoogleToken(token);
            }

            AppState.isAuthenticated = true;
            UI.updateAuthStatus(true);
            UI.setSyncStatus('synced');

            // Try to sync existing data
            await this.syncLocalDataToSheets();
        };

        if (gapi.client.getToken() === null) {
            // Prompt user to select a Google Account and consent
            AppState.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog
            AppState.tokenClient.requestAccessToken({ prompt: '' });
        }
    },

    // Handle sign out
    handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            Storage.clearGoogleToken(); // Clear saved token
            AppState.isAuthenticated = false;
            UI.updateAuthStatus(false);
            UI.setSyncStatus('offline');
        }
    },

    // Handle expired token
    handleExpiredToken() {
        console.log('Token expired, attempting to refresh');

        // Try to get a new token silently
        if (AppState.tokenClient) {
            AppState.tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    console.error('Token refresh failed:', resp.error);
                    // Only clear auth if refresh fails
                    gapi.client.setToken('');
                    Storage.clearGoogleToken();
                    AppState.isAuthenticated = false;
                    UI.updateAuthStatus(false);
                    UI.setSyncStatus('offline');
                    alert('Google Sheets connection lost. Your data is saved locally. Please reconnect when convenient.');
                    return;
                }

                // Save the new token
                const token = gapi.client.getToken();
                if (token) {
                    Storage.saveGoogleToken(token);
                    AppState.isAuthenticated = true;
                    UI.updateAuthStatus(true);
                    UI.setSyncStatus('synced');
                    console.log('Token refreshed successfully');
                }
            };

            // Request new token without prompting user
            AppState.tokenClient.requestAccessToken({ prompt: '' });
        } else {
            // Fallback: clear auth
            gapi.client.setToken('');
            Storage.clearGoogleToken();
            AppState.isAuthenticated = false;
            UI.updateAuthStatus(false);
            UI.setSyncStatus('offline');
            alert('Google Sheets connection lost. Your data is saved locally. Please reconnect when convenient.');
        }
    },

    // Read data from a sheet range
    async readRange(range) {
        if (!AppState.isAuthenticated) return null;

        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: AppState.sheetId,
                range: range,
            });
            return response.result.values || [];
        } catch (error) {
            console.error('Error reading from sheet:', error);
            // Check if token expired (401 error)
            if (error.status === 401) {
                this.handleExpiredToken();
            }
            return null;
        }
    },

    // Append data to a sheet
    async appendToSheet(range, values) {
        if (!AppState.isAuthenticated) return false;

        UI.setSyncStatus('syncing');

        try {
            const response = await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: AppState.sheetId,
                range: range,
                valueInputOption: 'USER_ENTERED',
                resource: { values: values },
            });

            UI.setSyncStatus('synced');
            return true;
        } catch (error) {
            console.error('Error appending to sheet:', error);
            // Check if token expired (401 error)
            if (error.status === 401) {
                this.handleExpiredToken();
            }
            UI.setSyncStatus('offline');
            return false;
        }
    },

    // Log a completed set to Workout Log sheet
    async logSet(workoutType, exerciseName, exerciseType = 'reps', setNumber, reps, weight, rest, notes = '') {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const row = [date, workoutType, exerciseName, exerciseType, setNumber, reps, weight, rest, notes];
        await this.appendToSheet('Workout Log!A:I', [row]);
    },

    // Log completed workout to Workout History sheet
    async logWorkoutSummary(workoutType, workoutName, totalVolume, duration, exerciseCount, notes = '') {
        const date = new Date().toISOString().split('T')[0];
        const row = [date, workoutName, workoutType, totalVolume, Math.round(duration / 60), exerciseCount, notes];
        await this.appendToSheet('Workout History!A:G', [row]);
    },

    // Fetch workout history from Google Sheets
    async fetchWorkoutHistory() {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: AppState.sheetId,
                range: 'Workout History!A:G',
            });

            const rows = response.result.values;
            if (!rows || rows.length <= 1) {
                // No data (only header or empty)
                return [];
            }

            // Skip header row and convert to workout objects
            return rows.slice(1).map(row => ({
                date: row[0],
                workoutName: row[1],
                workoutType: row[2],
                totalVolume: parseFloat(row[3]) || 0,
                duration: parseInt(row[4]) || 0, // in minutes
                exerciseCount: parseInt(row[5]) || 0,
                notes: row[6] || ''
            }));
        } catch (error) {
            console.error('Error fetching workout history:', error);
            throw error;
        }
    },

    // Fetch previous workout details from Workout Log for showing previous performance
    async fetchPreviousWorkoutDetails(workoutType) {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: AppState.sheetId,
                range: 'Workout Log!A:I',
            });

            const rows = response.result.values;
            if (!rows || rows.length <= 1) {
                return null;
            }

            // Skip header row and filter for this workout type
            const workoutRows = rows.slice(1).filter(row => row[1] === workoutType);
            if (workoutRows.length === 0) {
                return null;
            }

            // Get the most recent date for this workout
            const dates = [...new Set(workoutRows.map(row => row[0]))];
            dates.sort((a, b) => new Date(b) - new Date(a));
            const mostRecentDate = dates[0];

            // Get all exercises from that date
            const recentWorkoutRows = workoutRows.filter(row => row[0] === mostRecentDate);

            // Group by exercise name
            const exercisesMap = {};
            recentWorkoutRows.forEach(row => {
                const exerciseName = row[2];
                const setNumber = parseInt(row[4]) || 1;
                const reps = row[5];
                const weight = parseFloat(row[6]) || 0;

                if (!exercisesMap[exerciseName]) {
                    exercisesMap[exerciseName] = {
                        name: exerciseName,
                        sets: []
                    };
                }

                exercisesMap[exerciseName].sets.push({
                    setNumber: setNumber,
                    reps: reps,
                    weight: weight
                });
            });

            // Sort sets within each exercise
            Object.values(exercisesMap).forEach(exercise => {
                exercise.sets.sort((a, b) => a.setNumber - b.setNumber);
            });

            return {
                date: mostRecentDate,
                workoutType: workoutType,
                exercises: Object.values(exercisesMap)
            };
        } catch (error) {
            console.error('Error fetching previous workout details:', error);
            if (error.status === 401) {
                this.handleExpiredToken();
            }
            return null;
        }
    },

    // Sync local data to Google Sheets
    async syncLocalDataToSheets() {
        const workouts = Storage.getAllWorkouts();

        // Get last synced date from sheet
        const existingData = await this.readRange('Workout Log!A:A');
        const lastSyncedDate = existingData && existingData.length > 1
            ? existingData[existingData.length - 1][0]
            : null;

        // Filter workouts to sync (only those after last sync)
        const workoutsToSync = lastSyncedDate
            ? workouts.filter(w => new Date(w.date) > new Date(lastSyncedDate))
            : workouts;

        if (workoutsToSync.length === 0) {
            console.log('All data already synced');
            return;
        }

        console.log(`Syncing ${workoutsToSync.length} workouts to Google Sheets...`);

        for (const workout of workoutsToSync) {
            // Log each set
            for (const exercise of workout.exercises) {
                // Get exercise type from workout definition (defaults to 'reps')
                const workoutDef = getWorkout(workout.workoutType) || getOptionalWorkout(workout.workoutType);
                const exerciseDef = workoutDef?.exercises.find(e => e.name === exercise.name);
                const exerciseType = exerciseDef?.exerciseType || 'reps';

                for (const set of exercise.sets) {
                    await this.logSet(
                        workout.workoutType,
                        exercise.name,
                        exerciseType,
                        set.setNumber,
                        set.reps,
                        set.weight,
                        exercise.rest
                    );
                }
            }

            // Log workout summary
            const totalVolume = this.calculateTotalVolume(workout);
            const workoutDef = getWorkout(workout.workoutType) || getOptionalWorkout(workout.workoutType);
            const workoutName = workoutDef?.name || workout.workoutType;
            await this.logWorkoutSummary(
                workout.workoutType,
                workoutName,
                totalVolume,
                workout.duration,
                workout.exercises.length
            );
        }

        console.log('Sync complete!');
    },

    // Calculate total volume for a workout
    calculateTotalVolume(workout) {
        let volume = 0;
        workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                volume += set.reps * set.weight;
            });
        });
        return volume;
    }
};

// ==================== UI CONTROLLERS ====================

const UI = {
    // Initialize UI
    init() {
        this.renderWorkoutGrid();
        this.attachEventListeners();
        this.loadTheme();
        this.loadConfig();
        this.loadBodyweightMode();
    },

    // Render workout selection grid
    renderWorkoutGrid() {
        try {
            // Render main workouts
            const mainGrid = document.getElementById('main-workout-grid');
            if (!mainGrid) {
                console.error('Main workout grid element not found');
                return;
            }

            const mainWorkouts = getAllWorkouts();
            if (!mainWorkouts || mainWorkouts.length === 0) {
                console.error('No main workouts found');
                return;
            }

            mainGrid.innerHTML = mainWorkouts.map(workout => `
                <div class="workout-card" data-workout-id="${workout.id}">
                    <h3>${workout.name}</h3>
                    <div class="description">${workout.description}</div>
                    <div class="focus">${workout.focus}</div>
                    <div class="exercise-count">${workout.exercises.length} exercises</div>
                </div>
            `).join('');

            // Render optional workouts
            const optionalGrid = document.getElementById('optional-workout-grid');
            if (!optionalGrid) {
                console.error('Optional workout grid element not found');
                // Continue anyway - main workouts are rendered
            } else {
                const optionalWorkouts = getAllOptionalWorkouts();
                if (optionalWorkouts && optionalWorkouts.length > 0) {
                    optionalGrid.innerHTML = optionalWorkouts.map(workout => `
                        <div class="workout-card" data-workout-id="${workout.id}" data-is-optional="true">
                            <h3>${workout.name}</h3>
                            <div class="description">${workout.description}</div>
                            <div class="duration">⏱️ ${workout.duration}</div>
                            <div class="focus">${workout.purpose}</div>
                            <div class="exercise-count">${workout.exercises.length} exercises</div>
                        </div>
                    `).join('');
                } else {
                    console.warn('No optional workouts found');
                }
            }

            // Attach click handlers to all workout cards
            document.querySelectorAll('.workout-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const workoutId = e.currentTarget.dataset.workoutId;
                    const isOptional = e.currentTarget.dataset.isOptional === 'true';
                    WorkoutController.startWorkout(workoutId, isOptional);
                });
            });
        } catch (error) {
            console.error('Error rendering workout grid:', error);
            // Fallback: show error message to user
            const mainGrid = document.getElementById('main-workout-grid');
            if (mainGrid) {
                mainGrid.innerHTML = '<p style="color: red;">Error loading workouts. Please refresh the page.</p>';
            }
        }
    },

    // Switch between views
    switchView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');

        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

        AppState.currentView = viewName;
    },

    // Render full workout view with all exercises
    async renderFullWorkout() {
        // Get workout from appropriate source
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);

        // Get previous workout data from Sheets if authenticated, otherwise from localStorage
        let previousWorkout = null;
        if (AppState.isAuthenticated) {
            try {
                previousWorkout = await SheetsAPI.fetchPreviousWorkoutDetails(AppState.currentWorkout);
            } catch (error) {
                console.error('Failed to fetch previous workout from Sheets, falling back to localStorage:', error);
                previousWorkout = Storage.getPreviousWorkout(AppState.currentWorkout);
            }
        } else {
            previousWorkout = Storage.getPreviousWorkout(AppState.currentWorkout);
        }

        document.getElementById('workout-title').textContent = workout.name;
        document.getElementById('workout-progress').textContent =
            `${workout.exercises.length} exercises`;

        const container = document.getElementById('exercises-list');
        container.innerHTML = '';

        workout.exercises.forEach((exercise, exerciseIndex) => {
            const exerciseCard = this.createExerciseCard(exercise, exerciseIndex, previousWorkout);
            container.appendChild(exerciseCard);
        });
    },

    // Update a single exercise card (e.g., when substitution is applied)
    async updateSingleExerciseCard(exerciseIndex) {
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);

        // Get previous workout data from Sheets if authenticated, otherwise from localStorage
        let previousWorkout = null;
        if (AppState.isAuthenticated) {
            try {
                previousWorkout = await SheetsAPI.fetchPreviousWorkoutDetails(AppState.currentWorkout);
            } catch (error) {
                console.error('Failed to fetch previous workout from Sheets, falling back to localStorage:', error);
                previousWorkout = Storage.getPreviousWorkout(AppState.currentWorkout);
            }
        } else {
            previousWorkout = Storage.getPreviousWorkout(AppState.currentWorkout);
        }

        const exercise = workout.exercises[exerciseIndex];

        // Find the old card and capture its input values
        const oldCard = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        if (!oldCard) return;

        const preservedInputs = {
            sets: [],
            duration: null
        };

        // Capture current input values
        oldCard.querySelectorAll('.set-row').forEach(row => {
            const setNum = parseInt(row.dataset.set);
            const repsInput = row.querySelector('.reps-input');
            const weightInput = row.querySelector('.weight-input');
            preservedInputs.sets[setNum - 1] = {
                reps: repsInput?.value || '',
                weight: weightInput?.value || ''
            };
        });

        const durationInput = oldCard.querySelector('.duration-input');
        if (durationInput) {
            preservedInputs.duration = durationInput.value;
        }

        // Create new card with updated exercise info
        const newCard = this.createExerciseCard(exercise, exerciseIndex, previousWorkout);

        // Restore input values to new card
        preservedInputs.sets.forEach((setValues, setIndex) => {
            if (setValues && (setValues.reps || setValues.weight)) {
                const setRow = newCard.querySelector(`.set-row[data-set="${setIndex + 1}"]`);
                if (setRow) {
                    const repsInput = setRow.querySelector('.reps-input');
                    const weightInput = setRow.querySelector('.weight-input');
                    if (repsInput && setValues.reps) repsInput.value = setValues.reps;
                    if (weightInput && setValues.weight) weightInput.value = setValues.weight;
                }
            }
        });

        if (preservedInputs.duration) {
            const newDurationInput = newCard.querySelector('.duration-input');
            if (newDurationInput) newDurationInput.value = preservedInputs.duration;
        }

        // Replace old card with new card
        oldCard.replaceWith(newCard);
    },

    // Create an exercise card element
    createExerciseCard(exercise, exerciseIndex, previousWorkout) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.dataset.exerciseIndex = exerciseIndex;
        if (exercise.superset) card.classList.add('superset');

        // Check if this exercise has been substituted
        const substitutedName = AppState.substitutions[exerciseIndex];
        const displayName = substitutedName || exercise.name;
        const isSubstituted = !!substitutedName;

        if (isSubstituted) {
            card.classList.add('substituted');
        }

        // Get the actual exercise definition (substituted or original)
        let actualExercise = exercise;
        if (isSubstituted) {
            // Look up the substitution exercise details
            const subs = getSubstitutions(exercise.name);
            const subExercise = subs.exercises.find(e => e.name === substitutedName);
            if (subExercise) {
                // Use substitution exercise details for notes, sets, reps, etc.
                actualExercise = {
                    ...exercise,
                    name: substitutedName,
                    notes: subExercise.notes || exercise.notes,
                    sets: subExercise.sets || exercise.sets,
                    reps: subExercise.reps || exercise.reps,
                    rest: subExercise.rest || exercise.rest
                };
            }
        }

        // Get previous data for this exercise (use substituted name if applicable)
        const lookupName = isSubstituted ? substitutedName : exercise.name;
        const previousExercise = previousWorkout?.exercises.find(e => e.name === lookupName);

        let html = '<div class="exercise-header">';
        html += `<h3>${displayName}</h3>`;
        if (actualExercise.category || exercise.category) {
            const category = actualExercise.category || exercise.category;
            html += `<span class="exercise-badge ${category}">${category}</span>`;
        }
        html += '</div>';

        html += `<div class="exercise-meta">${actualExercise.sets} sets × ${actualExercise.reps} reps • ${actualExercise.rest}s rest</div>`;

        if (exercise.superset) {
            html += `<span class="superset-indicator">⚡ Superset with ${exercise.superset}</span>`;
        }

        if (actualExercise.notes) {
            html += `<div class="exercise-notes">${actualExercise.notes}</div>`;
        }

        // Substitution button (only show if substitutions are available)
        if (hasSubstitutions(exercise.name)) {
            html += `<button class="btn-substitute" data-exercise-index="${exerciseIndex}">
                        ↔️ Substitute Exercise
                    </button>`;
        }

        // Previous performance
        if (previousExercise) {
            const prevDate = new Date(previousWorkout.date).toLocaleDateString();
            html += '<div class="previous-performance">';
            html += `<h4>Last: ${prevDate}</h4>`;
            previousExercise.sets.forEach(set => {
                html += `<div>${set.reps} × ${set.weight} lbs</div>`;
            });
            html += '</div>';
        }

        // Sets grid - different UI based on exercise type
        const exerciseType = actualExercise.exerciseType || 'reps';

        html += '<div class="sets-grid">';

        if (exerciseType === 'duration') {
            // Duration-based: single input for time + timer + complete button
            const durationUnit = actualExercise.durationUnit || 'minutes';
            const unitLabel = durationUnit === 'seconds' ? 'seconds' : 'minutes';
            const step = durationUnit === 'seconds' ? '1' : '0.5';

            // Get previous duration if available
            const prevDuration = previousExercise?.sets[0]?.reps?.match(/[\d.]+/)?.[0] || '';

            html += `<div class="duration-tracker">`;
            html += `<label for="duration-input-${exerciseIndex}">Duration (${unitLabel}):</label>`;
            html += `<div class="duration-input-row">`;
            html += `<input type="number"
                           id="duration-input-${exerciseIndex}"
                           class="duration-input"
                           placeholder="${actualExercise.targetDuration || '30'}"
                           value="${prevDuration}"
                           inputmode="decimal"
                           min="0"
                           step="${step}"
                           data-unit="${durationUnit}">`;
            html += `<button class="btn-secondary start-duration-timer-btn"
                           data-exercise-index="${exerciseIndex}"
                           data-target="${actualExercise.targetDuration || '30'}"
                           data-unit="${durationUnit}">
                        ⏱️ Start Timer
                     </button>`;
            html += `</div>`;
            html += `<div class="duration-timer-display hidden" id="duration-timer-${exerciseIndex}">
                        <span class="duration-timer-time">0:00</span>
                        <button class="btn-danger stop-duration-timer-btn" data-exercise-index="${exerciseIndex}">
                            Stop & Save
                        </button>
                     </div>`;
            html += `<button class="btn-primary complete-duration-btn" data-exercise-index="${exerciseIndex}">
                        Complete
                     </button>`;
            html += `</div>`;

        } else if (exerciseType === 'completion') {
            // Completion-based: simple checkbox
            html += `<div class="completion-tracker">`;
            html += `<label class="completion-label">
                        <input type="checkbox"
                               class="completion-checkbox"
                               data-exercise-index="${exerciseIndex}">
                        <span>Mark as completed</span>
                     </label>`;
            html += `<div class="completion-description">${actualExercise.reps}</div>`;
            html += `</div>`;

        } else {
            // Traditional reps/weight tracking
            for (let setNum = 1; setNum <= actualExercise.sets; setNum++) {
                const prevSet = previousExercise?.sets[setNum - 1];
                const prevReps = prevSet?.reps || '';
                const prevWeight = prevSet?.weight || '';

                html += `<div class="set-row" data-set="${setNum}">`;
                html += `<div class="set-number">${setNum}</div>`;
                html += `<input type="number"
                               class="reps-input"
                               placeholder="Reps"
                               value="${prevReps}"
                               inputmode="numeric"
                               min="0"
                               data-set="${setNum}"
                               aria-label="Reps for set ${setNum}">`;
                html += `<input type="number"
                               class="weight-input"
                               placeholder="lbs"
                               value="${prevWeight}"
                               inputmode="decimal"
                               step="2.5"
                               min="0"
                               data-set="${setNum}"
                               aria-label="Weight for set ${setNum}">`;
                html += `<div class="set-check">
                           <input type="checkbox"
                                  class="set-checkbox"
                                  data-set="${setNum}"
                                  aria-label="Complete set ${setNum}">
                         </div>`;
                html += '</div>';
            }
        }

        html += '</div>';

        card.innerHTML = html;

        // Attach event listeners based on exercise type
        // (exerciseType already declared above when building UI)

        if (exerciseType === 'duration') {
            // Duration exercise: complete button and timer buttons
            const completeBtn = card.querySelector('.complete-duration-btn');
            completeBtn.addEventListener('click', () => {
                WorkoutController.handleDurationComplete(exerciseIndex);
            });

            const startTimerBtn = card.querySelector('.start-duration-timer-btn');
            startTimerBtn.addEventListener('click', () => {
                WorkoutController.startDurationTimer(exerciseIndex);
            });

            const stopTimerBtn = card.querySelector('.stop-duration-timer-btn');
            stopTimerBtn.addEventListener('click', () => {
                WorkoutController.stopDurationTimer(exerciseIndex);
            });

        } else if (exerciseType === 'completion') {
            // Completion exercise: checkbox
            const completionCheckbox = card.querySelector('.completion-checkbox');
            completionCheckbox.addEventListener('change', () => {
                WorkoutController.handleCompletionToggle(exerciseIndex);
            });

        } else {
            // Traditional reps/weight: set checkboxes
            card.querySelectorAll('.set-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    WorkoutController.handleSetComplete(exerciseIndex, parseInt(e.target.dataset.set));
                });
            });
        }

        // Attach event listener to substitution button
        const substituteBtn = card.querySelector('.btn-substitute');
        if (substituteBtn) {
            substituteBtn.addEventListener('click', () => {
                SubstitutionController.openSubstitutionModal(exerciseIndex, exercise.name);
            });
        }

        return card;
    },

    // Update exercise card completion status
    updateExerciseCard(exerciseIndex) {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const exerciseData = AppState.workoutData[exerciseIndex];
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);
        const exercise = workout.exercises[exerciseIndex];

        // Check if all sets are completed
        if (exerciseData.sets.length === exercise.sets) {
            card.classList.add('completed');
        }

        // Update progress
        this.updateWorkoutProgress();
    },

    // Update overall workout progress
    updateWorkoutProgress() {
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);
        const completedExercises = AppState.workoutData.filter(e =>
            e.sets.length === workout.exercises.find(ex => ex.name === e.name).sets
        ).length;

        document.getElementById('workout-progress').textContent =
            `${completedExercises}/${workout.exercises.length} exercises completed`;
    },

    // Start rest timer (timestamp-based for background accuracy)
    startRestTimer(duration) {
        // CRITICAL: Clear any existing timer first to prevent multiple intervals
        if (AppState.timerInterval) {
            clearInterval(AppState.timerInterval);
        }

        AppState.remainingTime = duration;

        // Only update totalRestTime if starting fresh (not resuming from pause)
        // Detect resume: duration < totalRestTime means we're resuming with remaining time
        if (AppState.totalRestTime === 0 || duration >= AppState.totalRestTime) {
            AppState.totalRestTime = duration;
        }

        AppState.isTimerRunning = true;

        // Use timestamp for accurate background timing
        AppState.timerEndTime = Date.now() + (duration * 1000);

        const timerElement = document.getElementById('rest-timer');
        timerElement.classList.remove('hidden');
        timerElement.classList.remove('compact'); // Start in full mode

        // Reset pause button text
        document.getElementById('pause-timer-btn').textContent = 'Pause';

        this.updateTimerDisplay();

        AppState.timerInterval = setInterval(() => {
            // Calculate remaining time based on timestamp (immune to throttling)
            const now = Date.now();
            AppState.remainingTime = Math.max(0, Math.ceil((AppState.timerEndTime - now) / 1000));

            this.updateTimerDisplay();

            if (AppState.remainingTime <= 0) {
                this.stopRestTimer();
                this.showNotification('Rest Complete', 'Time to start your next set!');
            }
        }, 1000);

        // Add scroll listener for compact mode
        this.enableCompactTimerOnScroll();
    },

    // Enable compact timer mode when scrolling
    enableCompactTimerOnScroll() {
        const timerElement = document.getElementById('rest-timer');
        const workoutView = document.getElementById('workout-view');

        // Remove existing listener if any
        if (AppState.scrollListener) {
            workoutView.removeEventListener('scroll', AppState.scrollListener);
        }

        AppState.scrollListener = () => {
            if (workoutView.scrollTop > 100) {
                timerElement.classList.add('compact');
            } else {
                timerElement.classList.remove('compact');
            }
        };

        workoutView.addEventListener('scroll', AppState.scrollListener);
    },

    // Update timer display
    updateTimerDisplay() {
        const minutes = Math.floor(AppState.remainingTime / 60);
        const seconds = AppState.remainingTime % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('timer-countdown').textContent = display;

        // Update progress bar
        const percentage = ((AppState.totalRestTime - AppState.remainingTime) / AppState.totalRestTime) * 100;
        document.getElementById('timer-progress-bar').style.width = `${percentage}%`;
    },

    // Pause rest timer (keeps visible)
    pauseRestTimer() {
        AppState.isTimerRunning = false;
        if (AppState.timerInterval) {
            clearInterval(AppState.timerInterval);
            AppState.timerInterval = null;
        }
        // Keep timer visible - don't hide it
    },

    // Stop rest timer (dismisses it)
    stopRestTimer() {
        AppState.isTimerRunning = false;
        if (AppState.timerInterval) {
            clearInterval(AppState.timerInterval);
            AppState.timerInterval = null;
        }
        AppState.totalRestTime = 0; // Reset for next timer
        document.getElementById('rest-timer').classList.add('hidden');
    },


    // Update auth status in UI
    updateAuthStatus(isAuthenticated) {
        const statusText = document.getElementById('auth-status-text');
        const signinBtn = document.getElementById('google-signin-btn');
        const signoutBtn = document.getElementById('google-signout-btn');

        if (isAuthenticated) {
            statusText.textContent = 'Connected';
            statusText.style.color = 'var(--success)';
            signinBtn.classList.add('hidden');
            signoutBtn.classList.remove('hidden');
        } else {
            statusText.textContent = 'Not connected';
            statusText.style.color = 'var(--text-secondary)';
            signinBtn.classList.remove('hidden');
            signoutBtn.classList.add('hidden');
        }
    },

    // Set sync status indicator
    setSyncStatus(status) {
        const indicator = document.getElementById('sync-indicator');
        indicator.className = 'sync-status';

        if (status === 'synced') {
            indicator.classList.add('synced');
        } else if (status === 'syncing') {
            indicator.classList.add('syncing');
        }
    },

    // Show browser notification
    showNotification(title, body) {
        // Check if notifications are supported and permitted
        if (!('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
                badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
                vibrate: [200, 100, 200]
            });
        } else if (Notification.permission !== 'denied') {
            // Request permission
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: body,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
                        vibrate: [200, 100, 200]
                    });
                }
            });
        }
    },

    // Request wake lock to keep screen on
    async requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                AppState.wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake lock activated - screen will stay on');

                AppState.wakeLock.addEventListener('release', () => {
                    console.log('Wake lock released');
                });
            } catch (err) {
                console.error('Wake lock failed:', err);
            }
        } else {
            console.log('Wake Lock API not supported');
        }
    },

    // Release wake lock
    releaseWakeLock() {
        if (AppState.wakeLock) {
            AppState.wakeLock.release()
                .then(() => {
                    AppState.wakeLock = null;
                    console.log('Wake lock released successfully');
                })
                .catch(err => console.error('Error releasing wake lock:', err));
        }
    },

    // Render workout history
    async renderHistory() {
        const historyList = document.getElementById('history-list');

        // Show loading state
        historyList.innerHTML = '<p style="color: var(--text-secondary);">Loading workout history...</p>';

        let workouts = [];

        // Fetch from Google Sheets if authenticated
        if (AppState.isAuthenticated) {
            try {
                workouts = await SheetsAPI.fetchWorkoutHistory();
            } catch (error) {
                console.error('Failed to fetch workout history from Google Sheets:', error);
                // Fall back to localStorage on error
                historyList.innerHTML = '<p style="color: var(--warning);">Failed to load from Google Sheets. Showing local data.</p>';
                workouts = Storage.getAllWorkouts();
            }
        } else {
            // Use localStorage when not authenticated
            workouts = Storage.getAllWorkouts();
        }

        // Sort by date (newest first)
        workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (workouts.length === 0) {
            historyList.innerHTML = '<p style="color: var(--text-secondary);">No workout history yet. Start your first workout!</p>';
            return;
        }

        // Render workout history
        if (AppState.isAuthenticated) {
            // From Google Sheets - data is already formatted
            historyList.innerHTML = workouts.map(workout => {
                const date = new Date(workout.date).toLocaleDateString();
                return `
                    <div class="history-item">
                        <h3>${workout.workoutName}</h3>
                        <div class="date">${date}</div>
                        <div class="summary">
                            ${workout.exerciseCount} exercises •
                            ${workout.duration} minutes •
                            ${workout.totalVolume.toLocaleString()} lbs total volume
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            // From localStorage - need to calculate from workout data
            historyList.innerHTML = workouts.map(workout => {
                const date = new Date(workout.date).toLocaleDateString();
                const workoutInfo = getWorkout(workout.workoutType) || getOptionalWorkout(workout.workoutType);
                const duration = Math.round(workout.duration / 60);
                const volume = SheetsAPI.calculateTotalVolume(workout);

                return `
                    <div class="history-item">
                        <h3>${workoutInfo.name}</h3>
                        <div class="date">${date}</div>
                        <div class="summary">
                            ${workout.exercises.length} exercises •
                            ${duration} minutes •
                            ${volume.toLocaleString()} lbs total volume
                        </div>
                    </div>
                `;
            }).join('');
        }
    },

    // Load and apply theme
    loadTheme() {
        const theme = Storage.getTheme();
        const isDark = theme === 'dark';

        if (isDark) {
            document.body.classList.add('dark-theme');
            document.getElementById('theme-toggle').checked = true;
        }
    },

    // Toggle theme
    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        Storage.saveTheme(isDark);
    },

    // Load configuration
    loadConfig() {
        const config = Storage.getConfig();
        AppState.sheetId = config.sheetId;
        document.getElementById('sheet-id-input').value = config.sheetId;
    },

    // Save configuration
    saveConfig() {
        const sheetId = document.getElementById('sheet-id-input').value.trim();
        if (sheetId) {
            Storage.saveConfig({ sheetId });
            AppState.sheetId = sheetId;
            alert('Configuration saved successfully!');
        }
    },

    // Load bodyweight mode preference
    loadBodyweightMode() {
        const isBodyweight = Storage.getBodyweightMode();
        AppState.bodyweightMode = isBodyweight;
        document.getElementById('bodyweight-mode-toggle').checked = isBodyweight;

        // Update visual indicator
        this.updateBodyweightModeIndicator();
    },

    // Toggle bodyweight mode
    toggleBodyweightMode() {
        AppState.bodyweightMode = !AppState.bodyweightMode;
        Storage.saveBodyweightMode(AppState.bodyweightMode);

        // Update visual indicator
        this.updateBodyweightModeIndicator();
    },

    // Update bodyweight mode visual indicator
    updateBodyweightModeIndicator() {
        const header = document.getElementById('header');
        if (AppState.bodyweightMode) {
            header.classList.add('bodyweight-mode-active');
        } else {
            header.classList.remove('bodyweight-mode-active');
        }
    },

    // Attach all event listeners
    attachEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;

                // Prevent navigation if workout is in progress
                if (AppState.currentWorkout && view !== 'workout') {
                    alert('Please finish or cancel your workout before switching tabs.');
                    return;
                }

                this.switchView(view);

                // Load history when switching to history view
                if (view === 'history') {
                    this.renderHistory();
                }
            });
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to exit this workout? Progress will be lost.')) {
                WorkoutController.cancelWorkout();
            }
        });

        // Finish workout button
        document.getElementById('finish-workout-btn').addEventListener('click', () => {
            WorkoutController.finishWorkout();
        });

        // Timer controls
        document.getElementById('pause-timer-btn').addEventListener('click', () => {
            if (AppState.isTimerRunning) {
                UI.pauseRestTimer(); // Pause without hiding
                document.getElementById('pause-timer-btn').textContent = 'Resume';
            } else {
                UI.startRestTimer(AppState.remainingTime);
                document.getElementById('pause-timer-btn').textContent = 'Pause';
            }
        });

        document.getElementById('skip-rest-btn').addEventListener('click', () => {
            this.stopRestTimer();
        });

        // Settings
        document.getElementById('google-signin-btn').addEventListener('click', () => {
            if (!AppState.gapiInited || !AppState.gisInited) {
                alert('Google APIs are still loading. Please wait a moment and try again.');
                console.log('API Status:', { gapiInited: AppState.gapiInited, gisInited: AppState.gisInited });
                return;
            }
            SheetsAPI.handleAuthClick();
        });

        document.getElementById('google-signout-btn').addEventListener('click', () => {
            SheetsAPI.handleSignoutClick();
        });

        document.getElementById('theme-toggle').addEventListener('change', () => {
            this.toggleTheme();
        });

        document.getElementById('bodyweight-mode-toggle').addEventListener('change', () => {
            this.toggleBodyweightMode();
        });

        document.getElementById('export-data-btn').addEventListener('click', () => {
            Storage.exportToCSV();
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            Storage.clearAll();
        });

        document.getElementById('save-config-btn').addEventListener('click', () => {
            this.saveConfig();
        });

        // Substitution modal
        document.getElementById('close-substitution-modal').addEventListener('click', () => {
            SubstitutionController.closeSubstitutionModal();
        });

        document.getElementById('cancel-substitution').addEventListener('click', () => {
            SubstitutionController.closeSubstitutionModal();
        });

        document.getElementById('apply-substitution').addEventListener('click', () => {
            SubstitutionController.applySubstitution();
        });

        document.getElementById('reset-exercise').addEventListener('click', () => {
            SubstitutionController.resetToOriginal();
        });

        // Click outside modal to close
        document.getElementById('substitution-modal').addEventListener('click', (e) => {
            if (e.target.id === 'substitution-modal') {
                SubstitutionController.closeSubstitutionModal();
            }
        });
    }
};

// ==================== SUBSTITUTION CONTROLLER ====================

const SubstitutionController = {
    // Open substitution modal for an exercise
    openSubstitutionModal(exerciseIndex, originalExerciseName) {
        AppState.currentSubstitutionExercise = exerciseIndex;

        const substitutions = getSubstitutions(originalExerciseName);
        if (!substitutions) {
            alert('No substitutions available for this exercise.');
            return;
        }

        const modal = document.getElementById('substitution-modal');
        const originalExerciseDiv = document.getElementById('original-exercise');
        const notesDiv = document.getElementById('substitution-notes');
        const avoidDiv = document.getElementById('avoid-section');
        const optionsDiv = document.getElementById('substitution-options');

        // Show original exercise
        const currentSubstitution = AppState.substitutions[exerciseIndex];
        originalExerciseDiv.innerHTML = `<strong>Original:</strong> ${originalExerciseName}${currentSubstitution ? `<br><strong>Current:</strong> ${currentSubstitution}` : ''}`;

        // Show notes if available
        if (substitutions.notes) {
            notesDiv.innerHTML = `<strong>Note:</strong> ${substitutions.notes}`;
        } else {
            notesDiv.innerHTML = '';
        }

        // Show avoid section if available
        if (substitutions.avoid && substitutions.avoid.length > 0) {
            avoidDiv.innerHTML = `
                <h4>⚠️ Avoid These:</h4>
                <ul>
                    ${substitutions.avoid.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        } else {
            avoidDiv.innerHTML = '';
        }

        // Render substitution options
        optionsDiv.innerHTML = substitutions.options.map((option, index) => `
            <label class="substitution-option">
                <input type="radio"
                       name="substitution"
                       value="${option}"
                       data-index="${index}"
                       ${currentSubstitution === option ? 'checked' : ''}>
                <span class="substitution-option-text">${option}</span>
            </label>
        `).join('');

        // Show modal
        modal.classList.remove('hidden');
    },

    // Close substitution modal
    closeSubstitutionModal() {
        const modal = document.getElementById('substitution-modal');
        modal.classList.add('hidden');
        AppState.currentSubstitutionExercise = null;
    },

    // Apply selected substitution
    async applySubstitution() {
        const selectedRadio = document.querySelector('input[name="substitution"]:checked');
        if (!selectedRadio) {
            alert('Please select a substitution exercise.');
            return;
        }

        const exerciseIndex = AppState.currentSubstitutionExercise;
        const substitutionName = selectedRadio.value;

        // Save substitution
        AppState.substitutions[exerciseIndex] = substitutionName;

        // Update only the affected exercise card
        await UI.updateSingleExerciseCard(exerciseIndex);

        // Close modal
        this.closeSubstitutionModal();
    },

    // Reset to original exercise
    async resetToOriginal() {
        const exerciseIndex = AppState.currentSubstitutionExercise;

        // Remove substitution
        delete AppState.substitutions[exerciseIndex];

        // Update only the affected exercise card
        await UI.updateSingleExerciseCard(exerciseIndex);

        // Close modal
        this.closeSubstitutionModal();
    }
};

// ==================== WORKOUT CONTROLLER ====================

const WorkoutController = {
    // Start a new workout
    async startWorkout(workoutId, isOptional = false) {
        AppState.currentWorkout = workoutId;
        AppState.workoutData = [];
        AppState.workoutStartTime = Date.now();
        AppState.substitutions = {}; // Clear any previous substitutions
        AppState.isOptionalWorkout = isOptional; // Track if this is an optional workout

        // Get workout from appropriate source
        const workout = isOptional ? getOptionalWorkout(workoutId) : getWorkout(workoutId);

        // Apply bodyweight substitutions if bodyweight mode is enabled
        if (AppState.bodyweightMode) {
            workout.exercises.forEach((exercise, index) => {
                const bodyweightSub = getBodyweightSubstitution(exercise.name);
                if (bodyweightSub !== exercise.name) {
                    AppState.substitutions[index] = bodyweightSub;
                }
            });
        }

        // Initialize workout data structure
        workout.exercises.forEach(exercise => {
            AppState.workoutData.push({
                name: exercise.name,
                rest: exercise.rest,
                sets: []
            });
        });

        // Request wake lock to keep screen on during workout
        UI.requestWakeLock();

        // Request notification permission if not already granted
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        UI.switchView('workout');
        await UI.renderFullWorkout();
    },

    // Handle set completion (checkbox clicked)
    handleSetComplete(exerciseIndex, setNumber) {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const setRow = card.querySelector(`.set-row[data-set="${setNumber}"]`);
        const checkbox = setRow.querySelector('.set-checkbox');
        const repsInput = setRow.querySelector('.reps-input');
        const weightInput = setRow.querySelector('.weight-input');

        const reps = parseInt(repsInput.value);
        const weight = parseFloat(weightInput.value) || 0;

        if (!checkbox.checked) {
            // Unchecking - remove this set from data
            const exerciseData = AppState.workoutData[exerciseIndex];
            exerciseData.sets = exerciseData.sets.filter(s => s.setNumber !== setNumber);
            setRow.classList.remove('completed');

            // Enable inputs
            repsInput.disabled = false;
            weightInput.disabled = false;
            return;
        }

        // Validate inputs
        if (!reps || reps <= 0) {
            alert('Please enter number of reps completed.');
            checkbox.checked = false;
            return;
        }

        // Get workout from appropriate source
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);
        const exercise = workout.exercises[exerciseIndex];

        // Save set data
        const setData = {
            setNumber: setNumber,
            reps: reps,
            weight: weight,
            completed: true
        };

        // Add to workout data (maintain order by set number)
        const exerciseData = AppState.workoutData[exerciseIndex];
        exerciseData.sets = exerciseData.sets.filter(s => s.setNumber !== setNumber);
        exerciseData.sets.push(setData);
        exerciseData.sets.sort((a, b) => a.setNumber - b.setNumber);

        // Save in-progress workout to localStorage immediately
        Storage.saveInProgressWorkout();

        // Mark row as completed
        setRow.classList.add('completed');

        // Disable inputs
        repsInput.disabled = true;
        weightInput.disabled = true;

        // Log to Google Sheets if authenticated (non-blocking)
        if (AppState.isAuthenticated) {
            SheetsAPI.logSet(
                AppState.currentWorkout,
                exercise.name,
                exercise.exerciseType || 'reps',
                setNumber,
                reps,
                weight,
                exercise.rest
            ).catch(error => {
                console.error('Failed to log set to Google Sheets:', error);
                // Data is already saved to localStorage, so this is not critical
            });
        }

        // Update UI
        UI.updateExerciseCard(exerciseIndex);

        // Start rest timer
        UI.startRestTimer(exercise.rest);
    },

    // Handle duration-based exercise completion
    handleDurationComplete(exerciseIndex) {
        // Get workout and exercise
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);
        const exercise = workout.exercises[exerciseIndex];

        // Get duration input and unit
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const durationInput = card.querySelector('.duration-input');
        const duration = parseFloat(durationInput.value);
        const unit = durationInput.dataset.unit || 'minutes';
        const unitAbbrev = unit === 'seconds' ? 's' : 'min';
        const unitLabel = unit === 'seconds' ? 'seconds' : 'minutes';

        // Validate
        if (!duration || duration <= 0) {
            alert(`Please enter the duration completed (in ${unitLabel}).`);
            return;
        }

        // Save set data (duration exercises typically have 1 set)
        const setData = {
            setNumber: 1,
            reps: `${duration}${unitAbbrev}`,
            weight: 0,
            completed: true
        };

        // Add to workout data
        const exerciseData = AppState.workoutData[exerciseIndex];
        exerciseData.sets = [setData];

        // Save in-progress workout to localStorage immediately
        Storage.saveInProgressWorkout();

        // Mark as completed
        card.classList.add('completed');
        durationInput.disabled = true;
        const completeBtn = card.querySelector('.complete-duration-btn');
        completeBtn.disabled = true;
        completeBtn.textContent = '✓ Completed';

        // Log to Google Sheets if authenticated (non-blocking)
        if (AppState.isAuthenticated) {
            SheetsAPI.logSet(
                AppState.currentWorkout,
                exercise.name,
                'duration',
                1,
                `${duration}${unitAbbrev}`,
                0,
                exercise.rest
            ).catch(error => {
                console.error('Failed to log duration to Google Sheets:', error);
                // Data is already saved to localStorage, so this is not critical
            });
        }

        // Update UI
        UI.updateExerciseCard(exerciseIndex);

        // Start rest timer if applicable
        if (exercise.rest > 0) {
            UI.startRestTimer(exercise.rest);
        }
    },

    // Start duration timer (counts UP)
    startDurationTimer(exerciseIndex) {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const startBtn = card.querySelector('.start-duration-timer-btn');
        const timerDisplay = card.querySelector('.duration-timer-display');
        const timerTime = timerDisplay.querySelector('.duration-timer-time');
        const durationInput = card.querySelector('.duration-input');
        const unit = durationInput.dataset.unit;

        // Initialize timer state
        if (!AppState.durationTimers) {
            AppState.durationTimers = {};
        }

        // Hide start button, show timer display
        startBtn.classList.add('hidden');
        timerDisplay.classList.remove('hidden');

        // Start counting from 0
        const startTime = Date.now();
        AppState.durationTimers[exerciseIndex] = {
            startTime: startTime,
            interval: setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000); // seconds
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                timerTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000)
        };
    },

    // Stop duration timer and save value
    stopDurationTimer(exerciseIndex) {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const startBtn = card.querySelector('.start-duration-timer-btn');
        const timerDisplay = card.querySelector('.duration-timer-display');
        const durationInput = card.querySelector('.duration-input');
        const unit = durationInput.dataset.unit;

        if (AppState.durationTimers && AppState.durationTimers[exerciseIndex]) {
            const timer = AppState.durationTimers[exerciseIndex];
            clearInterval(timer.interval);

            // Calculate final time
            const elapsed = Math.floor((Date.now() - timer.startTime) / 1000); // seconds

            // Convert to appropriate unit
            let finalValue;
            if (unit === 'seconds') {
                finalValue = elapsed;
            } else {
                // Convert to minutes
                finalValue = (elapsed / 60).toFixed(1);
            }

            // Set input value
            durationInput.value = finalValue;

            // Clean up
            delete AppState.durationTimers[exerciseIndex];

            // Show start button, hide timer display
            startBtn.classList.remove('hidden');
            timerDisplay.classList.add('hidden');
        }
    },

    // Handle completion-based exercise toggle
    handleCompletionToggle(exerciseIndex) {
        // Get workout and exercise
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);
        const exercise = workout.exercises[exerciseIndex];

        // Get checkbox
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const checkbox = card.querySelector('.completion-checkbox');

        if (checkbox.checked) {
            // Mark as completed
            const setData = {
                setNumber: 1,
                reps: 'Completed',
                weight: 0,
                completed: true
            };

            // Add to workout data
            const exerciseData = AppState.workoutData[exerciseIndex];
            exerciseData.sets = [setData];

            // Save in-progress workout to localStorage immediately
            Storage.saveInProgressWorkout();

            // Mark card as completed
            card.classList.add('completed');

            // Log to Google Sheets if authenticated (non-blocking)
            if (AppState.isAuthenticated) {
                SheetsAPI.logSet(
                    AppState.currentWorkout,
                    exercise.name,
                    'completion',
                    1,
                    'Completed',
                    0,
                    exercise.rest
                ).catch(error => {
                    console.error('Failed to log completion to Google Sheets:', error);
                    // Data is already saved to localStorage, so this is not critical
                });
            }

            // Update UI
            UI.updateExerciseCard(exerciseIndex);

            // Start rest timer if applicable
            if (exercise.rest > 0) {
                UI.startRestTimer(exercise.rest);
            }
        } else {
            // Unchecked - remove from data
            const exerciseData = AppState.workoutData[exerciseIndex];
            exerciseData.sets = [];

            // Save in-progress workout to localStorage immediately
            Storage.saveInProgressWorkout();

            card.classList.remove('completed');

            // Update UI
            UI.updateExerciseCard(exerciseIndex);
        }
    },

    // Finish workout
    finishWorkout() {
        const duration = Math.round((Date.now() - AppState.workoutStartTime) / 1000); // seconds

        // Filter out exercises with no completed sets
        const completedExercises = AppState.workoutData.filter(e => e.sets.length > 0);

        if (completedExercises.length === 0) {
            alert('No exercises completed. Cannot finish workout.');
            return;
        }

        // Add substitution information to exercises
        const workout = AppState.isOptionalWorkout
            ? getOptionalWorkout(AppState.currentWorkout)
            : getWorkout(AppState.currentWorkout);
        completedExercises.forEach((exerciseData, index) => {
            const workoutExerciseIndex = workout.exercises.findIndex(e => e.name === exerciseData.name);
            if (AppState.substitutions[workoutExerciseIndex]) {
                exerciseData.substitutedWith = AppState.substitutions[workoutExerciseIndex];
            }
        });

        const workoutLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            workoutType: AppState.currentWorkout,
            exercises: completedExercises,
            duration: duration,
            completed: true,
            substitutions: { ...AppState.substitutions } // Save substitutions
        };

        // Save to localStorage
        Storage.saveWorkout(workoutLog);

        // Log summary to Google Sheets
        if (AppState.isAuthenticated) {
            const volume = SheetsAPI.calculateTotalVolume(workoutLog);
            SheetsAPI.logWorkoutSummary(
                AppState.currentWorkout,
                workout.name,
                volume,
                duration,
                completedExercises.length
            ).catch(error => {
                console.error('Failed to log workout summary to Google Sheets:', error);
            });
        }

        alert(`Workout complete!\nDuration: ${Math.round(duration / 60)} minutes\nExercises: ${completedExercises.length}`);

        // Reset and go home
        this.cancelWorkout();
    },

    // Cancel workout
    cancelWorkout() {
        AppState.currentWorkout = null;
        AppState.workoutData = [];
        AppState.substitutions = {};
        Storage.clearInProgressWorkout(); // Clear saved in-progress workout
        UI.stopRestTimer();
        UI.releaseWakeLock(); // Release wake lock when workout cancelled
        UI.switchView('home');
    }
};

// ==================== INITIALIZATION ====================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    UI.init();

    // Check for in-progress workout and offer to restore
    const inProgress = Storage.getInProgressWorkout();
    if (inProgress) {
        const lastSavedTime = new Date(inProgress.lastSaved);
        const timeSince = Math.round((Date.now() - inProgress.lastSaved) / 1000 / 60); // minutes

        const workoutDef = inProgress.isOptional
            ? getOptionalWorkout(inProgress.workoutType)
            : getWorkout(inProgress.workoutType);

        const message = `You have an in-progress workout:\n\n${workoutDef.name}\nLast saved: ${timeSince} minutes ago\n\nWould you like to continue this workout?`;

        if (confirm(message)) {
            // Restore workout state
            AppState.currentWorkout = inProgress.workoutType;
            AppState.isOptionalWorkout = inProgress.isOptional;
            AppState.workoutStartTime = inProgress.startTime;
            AppState.workoutData = inProgress.exercises;
            AppState.substitutions = inProgress.substitutions || {};

            // Switch to workout view and render
            UI.requestWakeLock();
            UI.switchView('workout');
            await UI.renderFullWorkout();

            // Mark previously completed sets as completed
            inProgress.exercises.forEach((exercise, exerciseIndex) => {
                exercise.sets.forEach(set => {
                    const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
                    if (!card) return;

                    // Find and mark the set row as completed
                    const setRow = card.querySelector(`.set-row[data-set="${set.setNumber}"]`);
                    if (setRow) {
                        const checkbox = setRow.querySelector('.set-checkbox');
                        const repsInput = setRow.querySelector('.reps-input');
                        const weightInput = setRow.querySelector('.weight-input');

                        if (checkbox) checkbox.checked = true;
                        if (repsInput) {
                            repsInput.value = set.reps;
                            repsInput.disabled = true;
                        }
                        if (weightInput) {
                            weightInput.value = set.weight;
                            weightInput.disabled = true;
                        }
                        setRow.classList.add('completed');
                    }
                });

                // Mark exercise card as completed if all sets done
                const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
                const exerciseDef = workoutDef.exercises[exerciseIndex];
                if (card && exercise.sets.length === exerciseDef.sets) {
                    card.classList.add('completed');
                }
            });

            UI.updateWorkoutProgress();
        } else {
            // User declined to restore - clear the saved workout
            Storage.clearInProgressWorkout();
        }
    }
});

// Handle page visibility changes (browser tab switching)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again - re-request wake lock if workout is active
        if (AppState.currentWorkout && !AppState.wakeLock) {
            UI.requestWakeLock();
        }
    }
    // Note: We don't pause the timer when hidden because the timestamp-based
    // timer continues accurately in the background
});

// Initialize Google APIs when loaded
window.gapiLoaded = () => {
    console.log('gapiLoaded callback called');
    gapi.load('client', () => SheetsAPI.initializeGapiClient());
};

window.gisLoaded = () => {
    console.log('gisLoaded callback called');
    SheetsAPI.initializeGisClient();
};

// Log when scripts are loaded
console.log('App.js loaded. Waiting for Google APIs...');
