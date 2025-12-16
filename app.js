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
    isAuthenticated: false,
    gapiInited: false,
    gisInited: false,
    tokenClient: null,
    sheetId: null,
    activeExerciseIndex: null
};

// ==================== LOCAL STORAGE ====================

const Storage = {
    KEYS: {
        WORKOUTS: 'workout_tracker_workouts',
        CONFIG: 'workout_tracker_config',
        THEME: 'workout_tracker_theme'
    },

    // Save workout log
    saveWorkout(workout) {
        const workouts = this.getAllWorkouts();
        workouts.push(workout);
        localStorage.setItem(this.KEYS.WORKOUTS, JSON.stringify(workouts));
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
            UI.updateAuthStatus(false);
        }
    },

    // Handle authentication
    handleAuthClick() {
        AppState.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
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
            AppState.isAuthenticated = false;
            UI.updateAuthStatus(false);
            UI.setSyncStatus('offline');
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
            UI.setSyncStatus('offline');
            return false;
        }
    },

    // Log a completed set to Workout Log sheet
    async logSet(workoutType, exerciseName, setNumber, reps, weight, rest, notes = '') {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const row = [date, workoutType, exerciseName, setNumber, reps, weight, rest, notes];
        await this.appendToSheet('Workout Log!A:H', [row]);
    },

    // Log completed workout to Workout History sheet
    async logWorkoutSummary(workoutType, totalVolume, duration, exerciseCount, notes = '') {
        const date = new Date().toISOString().split('T')[0];
        const row = [date, workoutType, totalVolume, Math.round(duration / 60), exerciseCount, notes];
        await this.appendToSheet('Workout History!A:F', [row]);
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
                for (const set of exercise.sets) {
                    await this.logSet(
                        workout.workoutType,
                        exercise.name,
                        set.setNumber,
                        set.reps,
                        set.weight,
                        exercise.rest
                    );
                }
            }

            // Log workout summary
            const totalVolume = this.calculateTotalVolume(workout);
            await this.logWorkoutSummary(
                workout.workoutType,
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
    },

    // Render workout selection grid
    renderWorkoutGrid() {
        const grid = document.querySelector('.workout-grid');
        const workouts = getAllWorkouts();

        grid.innerHTML = workouts.map(workout => `
            <div class="workout-card" data-workout-id="${workout.id}">
                <h3>${workout.name}</h3>
                <div class="description">${workout.description}</div>
                <div class="focus">${workout.focus}</div>
                <div class="exercise-count">${workout.exercises.length} exercises</div>
            </div>
        `).join('');

        // Attach click handlers
        document.querySelectorAll('.workout-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const workoutId = e.currentTarget.dataset.workoutId;
                WorkoutController.startWorkout(workoutId);
            });
        });
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
    renderFullWorkout() {
        const workout = getWorkout(AppState.currentWorkout);
        const previousWorkout = Storage.getPreviousWorkout(AppState.currentWorkout);

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

    // Create an exercise card element
    createExerciseCard(exercise, exerciseIndex, previousWorkout) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.dataset.exerciseIndex = exerciseIndex;
        if (exercise.superset) card.classList.add('superset');

        // Get previous data for this exercise
        const previousExercise = previousWorkout?.exercises.find(e => e.name === exercise.name);

        let html = '<div class="exercise-header">';
        html += `<h3>${exercise.name}</h3>`;
        if (exercise.category) {
            html += `<span class="exercise-badge ${exercise.category}">${exercise.category}</span>`;
        }
        html += '</div>';

        html += `<div class="exercise-meta">${exercise.sets} sets × ${exercise.reps} reps • ${exercise.rest}s rest</div>`;

        if (exercise.superset) {
            html += `<span class="superset-indicator">⚡ Superset with ${exercise.superset}</span>`;
        }

        if (exercise.notes) {
            html += `<div class="exercise-notes">${exercise.notes}</div>`;
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

        // Sets grid
        html += '<div class="sets-grid">';
        for (let setNum = 1; setNum <= exercise.sets; setNum++) {
            const prevSet = previousExercise?.sets[setNum - 1];
            const prevWeight = prevSet ? prevSet.weight : '';

            html += `<div class="set-row" data-set="${setNum}">`;
            html += `<div class="set-number">${setNum}</div>`;
            html += `<input type="number"
                           class="reps-input"
                           placeholder="Reps"
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
        html += '</div>';

        card.innerHTML = html;

        // Attach event listeners to checkboxes
        card.querySelectorAll('.set-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                WorkoutController.handleSetComplete(exerciseIndex, parseInt(e.target.dataset.set));
            });
        });

        return card;
    },

    // Update exercise card completion status
    updateExerciseCard(exerciseIndex) {
        const card = document.querySelector(`[data-exercise-index="${exerciseIndex}"]`);
        const exerciseData = AppState.workoutData[exerciseIndex];
        const workout = getWorkout(AppState.currentWorkout);
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
        const workout = getWorkout(AppState.currentWorkout);
        const completedExercises = AppState.workoutData.filter(e =>
            e.sets.length === workout.exercises.find(ex => ex.name === e.name).sets
        ).length;

        document.getElementById('workout-progress').textContent =
            `${completedExercises}/${workout.exercises.length} exercises completed`;
    },

    // Start rest timer
    startRestTimer(duration) {
        AppState.remainingTime = duration;
        AppState.totalRestTime = duration;
        AppState.isTimerRunning = true;

        const timerElement = document.getElementById('rest-timer');
        timerElement.classList.remove('hidden');

        this.updateTimerDisplay();

        AppState.timerInterval = setInterval(() => {
            AppState.remainingTime--;
            this.updateTimerDisplay();

            if (AppState.remainingTime <= 0) {
                this.stopRestTimer();
                this.playTimerAlert();
            }
        }, 1000);
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

    // Stop rest timer
    stopRestTimer() {
        AppState.isTimerRunning = false;
        clearInterval(AppState.timerInterval);
        document.getElementById('rest-timer').classList.add('hidden');
    },

    // Play alert sound (browser notification)
    playTimerAlert() {
        // Play system beep
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwNUKvi77JlHAU7k9n0y38qBSd6y/HajDwHElyx6OyrWBUIR6Ll8r1mIwUufM/13I0+CBlntOvnsVkWCkeh4fG5ZB4FO5La8sp+KgUng8rx2Yk0CBhqvO/knE0MDFCr4u+wYhsFOpPZ9Mp/KgUngsvw2Ik1CBdpvO7kmkwNDVCt5O+vYBkFN5Db88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsODk6s5/CsXhgFNpHa88p9KQUlgc7w2Ik1CBhpvO3jmUsO');
        audio.play().catch(e => console.log('Could not play sound'));
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

    // Render workout history
    renderHistory() {
        const historyList = document.getElementById('history-list');
        const workouts = Storage.getAllWorkouts().sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        if (workouts.length === 0) {
            historyList.innerHTML = '<p style="color: var(--text-secondary);">No workout history yet. Start your first workout!</p>';
            return;
        }

        historyList.innerHTML = workouts.map(workout => {
            const date = new Date(workout.date).toLocaleDateString();
            const workoutInfo = getWorkout(workout.workoutType);
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

    // Attach all event listeners
    attachEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
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
                UI.stopRestTimer();
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

        document.getElementById('export-data-btn').addEventListener('click', () => {
            Storage.exportToCSV();
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            Storage.clearAll();
        });

        document.getElementById('save-config-btn').addEventListener('click', () => {
            this.saveConfig();
        });
    }
};

// ==================== WORKOUT CONTROLLER ====================

const WorkoutController = {
    // Start a new workout
    startWorkout(workoutId) {
        AppState.currentWorkout = workoutId;
        AppState.workoutData = [];
        AppState.workoutStartTime = Date.now();

        const workout = getWorkout(workoutId);

        // Initialize workout data structure
        workout.exercises.forEach(exercise => {
            AppState.workoutData.push({
                name: exercise.name,
                rest: exercise.rest,
                sets: []
            });
        });

        UI.switchView('workout');
        UI.renderFullWorkout();
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

        const workout = getWorkout(AppState.currentWorkout);
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

        // Mark row as completed
        setRow.classList.add('completed');

        // Disable inputs
        repsInput.disabled = true;
        weightInput.disabled = true;

        // Log to Google Sheets if authenticated
        if (AppState.isAuthenticated) {
            SheetsAPI.logSet(
                AppState.currentWorkout,
                exercise.name,
                setNumber,
                reps,
                weight,
                exercise.rest
            );
        }

        // Update UI
        UI.updateExerciseCard(exerciseIndex);

        // Start rest timer
        UI.startRestTimer(exercise.rest);
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

        const workoutLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            workoutType: AppState.currentWorkout,
            exercises: completedExercises,
            duration: duration,
            completed: true
        };

        // Save to localStorage
        Storage.saveWorkout(workoutLog);

        // Log summary to Google Sheets
        if (AppState.isAuthenticated) {
            const volume = SheetsAPI.calculateTotalVolume(workoutLog);
            SheetsAPI.logWorkoutSummary(
                AppState.currentWorkout,
                volume,
                duration,
                completedExercises.length
            );
        }

        alert(`Workout complete!\nDuration: ${Math.round(duration / 60)} minutes\nExercises: ${completedExercises.length}`);

        // Reset and go home
        this.cancelWorkout();
    },

    // Cancel workout
    cancelWorkout() {
        AppState.currentWorkout = null;
        AppState.workoutData = [];
        UI.stopRestTimer();
        UI.switchView('home');
    }
};

// ==================== INITIALIZATION ====================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
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
