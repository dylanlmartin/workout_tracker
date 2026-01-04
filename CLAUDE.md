# Claude Code Guidelines for Workout Tracker Project

## Critical Development Practices

### Testing Requirements
**ALWAYS test and verify solutions before claiming they work.**

Before marking any fix as complete:
1. **Trace through the actual code flow** - Don't assume how code works
2. **Verify the root cause** - Understand WHY the bug exists before fixing it
3. **Check all related code paths** - Consider edge cases and different scenarios
4. **Test on the actual target** - Verify which DOM elements are used (e.g., which element actually scrolls)
5. **Consider all variations** - Check all exercise types, all user flows, all states

### Common Mistakes to Avoid
- Don't claim a fix works without tracing through the execution path
- Don't assume HTML structure - read the actual markup
- Don't assume CSS selectors target the right elements - verify in styles.css
- Don't fix one case and ignore others (e.g., fixing reps/weight but not duration/completion)
- Don't skip cleanup code (e.g., removing event listeners when components unmount)

### Formatting and Mobile-First
- **Always check formatting on mobile screens** before claiming UI fixes work
- Vertical layouts are safer than horizontal for mobile
- Test button layouts with long text
- Ensure modals and controls are accessible on small screens

## Project-Specific Context

### Exercise Type System
This app has **three exercise types** that must be handled separately:
1. **'reps'** (default) - Traditional set-based with reps and weight
2. **'duration'** - Time-based exercises (seconds or minutes)
3. **'completion'** - Simple checkbox exercises

When implementing features that affect exercises, ALWAYS handle all three types:
- Creating exercise cards
- Saving data
- Restoring workouts
- Marking completion
- Logging to Google Sheets

### Architecture Notes
- **Scrolling container**: `#main-content` has `overflow-y: auto`, NOT `#workout-view`
- **Substitutions**: Exercises can be substituted, affecting exercise type and properties
- **Data persistence**: Changes must be saved to localStorage via `Storage.saveInProgressWorkout()`
- **Google Sheets**: Authenticated users log data to Sheets asynchronously

### Key Files
- **app.js**: Main application logic, UI controllers, workout management
- **data.js**: Exercise definitions and workout programs
- **styles.css**: All styling, including responsive layouts
- **index.html**: DOM structure

### Data Flow
1. User completes a set → handler function saves to `AppState.workoutData`
2. Immediately call `Storage.saveInProgressWorkout()` to persist
3. On completion, log to Google Sheets (if authenticated)
4. On app reopen, restore from localStorage and mark completed sets as disabled

### Common Patterns
- Exercise type detection: `const exerciseType = actualExercise.exerciseType || 'reps';`
- Substitution lookup: Check `AppState.substitutions[exerciseIndex]` and `getSubstitutions()`
- Previous workout data: Fetch from Sheets if authenticated, fall back to localStorage
- Scroll listeners: Attach to `#main-content`, clean up in unmount/stop functions

## Commit Message Style
Based on repository history:
- Use imperative mood: "Fix..." not "Fixed..." or "Fixes..."
- Be specific about what changed: "Fix rest timer scroll listener - attach to main-content instead of workout-view"
- Format: `<action> <what> - <how/why if needed>`
- Examples:
  - "Fix workout restoration - mark completed sets for all exercise types"
  - "Add duration exercise timer with Start/Stop buttons"
  - "Remove auto-apply behavior that was breaking substitution button"

## User Expectations
- Clear, concise communication
- Don't over-engineer solutions
- Only make requested changes, don't add unrequested features
- Test thoroughly before claiming fixes work
- Acknowledge mistakes and fix them properly
