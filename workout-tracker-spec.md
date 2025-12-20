# Workout Tracker - Technical Specification

## Quick Reference

**Program Type:** 4-day Upper/Lower split with integrated conditioning  
**Training Focus:** Muscle hypertrophy and strength with cardiovascular health  
**Special Consideration:** Costochondritis-safe (no traditional bench press)  
**Progression Method:** Double progression (reps first, then weight)  
**Training Style:** Supersets for time efficiency  
**Typical Duration:** 60-75 minutes per session  
**Equipment:** Full gym access required (barbell, dumbbells, cables, machines)

## Overview
Workout tracking application for a 4-day split program designed to accommodate costochondritis recovery. Tracks exercises, sets, reps, weight, and rest periods with historical data persistence.

## Program Philosophy

### Design Principles
- **Chest-safe approach** - Avoids exercises that stress the sternum and costochondral joints
- **Double progression** - Progress reps within a range before adding weight
- **Efficiency focus** - Supersets reduce workout time without sacrificing volume
- **Integrated conditioning** - Cardio built into leg days instead of separate sessions
- **Progressive overload** - Structured progression from strength to hypertrophy across A/B splits

### Costochondritis Considerations
**Avoided movements:**
- Traditional flat/incline barbell bench press
- Wide-grip pressing movements
- Dips
- Push-ups with full range of motion
- Any movement causing sternum/rib discomfort

**Safe alternatives:**
- Neutral-grip dumbbell presses (reduces shoulder internal rotation stress)
- Floor press (limited range of motion protects chest)
- Cable pressing variations (adjustable angles, smooth resistance)
- Scapular retraction emphasis (reduces anterior chest strain)

## Program Structure

### Workout Split
Four distinct workouts that cycle:
- **Upper A** - Hypertrophy focus
- **Lower A** - Strength + Conditioning
- **Upper B** - Strength focus  
- **Lower B** - Hypertrophy + Conditioning

### Exercise Data Model
Each exercise contains:
- **name** - Exercise name
- **sets** - Number of sets
- **reps** - Rep range (e.g., "8-12", "30s", "10/side")
- **rest** - Rest period in seconds
- **superset** (optional) - Name of paired exercise
- **category** (optional) - "core" or "cardio"
- **notes** (optional) - Form cues or special instructions

## Workout Definitions

### Upper A - Hypertrophy
1. Neutral-Grip DB Floor Press - 4 sets, 8-12 reps, 180s rest
   - Notes: "Maintain scapular retraction"
2. Barbell Row - 4 sets, 8-12 reps, 120s rest
3. Cable Press (decline, neutral) - 3 sets, 10-12 reps, 90s rest
   - Superset: Cable Row
4. Cable Row - 3 sets, 10-12 reps, 90s rest
   - Superset: Cable Press
5. DB Lateral Raise - 3 sets, 12-15 reps, 90s rest
   - Superset: DB Reverse Fly
6. DB Reverse Fly - 3 sets, 12-15 reps, 90s rest
   - Superset: DB Lateral Raise
7. Bicep Curls (Myo-reps) - 2 sets, 12-15+3x3-5 reps, 30s rest
8. Tricep Pushdowns (Myo-reps) - 2 sets, 12-15+3x3-5 reps, 30s rest
9. Pallof Press - 3 sets, 10/side reps, 60s rest [CORE]
10. Dead Bug - 3 sets, 12/side reps, 60s rest [CORE]
11. Side Plank - 3 sets, 30s/side reps, 60s rest [CORE]

### Lower A - Strength + Conditioning
1. Back Squat - 5 sets, 4-6 reps, 180s rest
2. Romanian Deadlift - 3 sets, 8-10 reps, 120s rest
3. Leg Curl - 3 sets, 10-12 reps, 90s rest
   - Superset: Leg Extension
4. Leg Extension - 3 sets, 10-12 reps, 90s rest
   - Superset: Leg Curl
5. Standing Calf Raise - 4 sets, 12-15 reps, 60s rest
6. Hanging Knee Raise - 3 sets, 10-12 reps, 60s rest [CORE]
7. HIIT Bike Intervals - 1 set, 10x30s/30s, 0s rest [CARDIO]
   - Notes: "10 rounds: 30s sprint, 30s easy"

### Upper B - Strength
1. Neutral-Grip DB Floor Press - 5 sets, 4-6 reps, 180s rest
   - Notes: "Heavier than Upper A"
2. Barbell Row - 5 sets, 4-6 reps, 180s rest
3. Cable Press (incline) - 3 sets, 8-10 reps, 120s rest
4. Cable Pulldown - 3 sets, 8-10 reps, 120s rest
5. DB Overhead Press - 4 sets, 6-8 reps, 120s rest
6. Face Pulls - 3 sets, 15-20 reps, 60s rest
7. Hammer Curls - 3 sets, 8-10 reps, 90s rest
8. Close-Grip Pushdowns - 3 sets, 8-10 reps, 90s rest
9. Plank - 3 sets, 45s, 60s rest [CORE]
10. Bird Dog - 3 sets, 10/side reps, 60s rest [CORE]

### Lower B - Hypertrophy + Conditioning
1. Bulgarian Split Squat - 4 sets, 10-12/leg reps, 120s rest
2. Stiff-Leg Deadlift - 3 sets, 10-12 reps, 120s rest
3. Walking Lunges - 3 sets, 12/leg reps, 90s rest
   - Superset: Nordic Curls
4. Nordic Curls - 3 sets, AMRAP, 90s rest
   - Superset: Walking Lunges
   - Notes: "As many reps as possible"
5. Seated Calf Raise - 4 sets, 15-20 reps, 60s rest
6. Cable Woodchops - 3 sets, 12/side reps, 60s rest [CORE]
7. Steady-State Cardio - 1 set, 20 min, 0s rest [CARDIO]
   - Notes: "Zone 2 - conversational pace"

## Optional Workouts (Tue-Thu Add-ons)

### Overview
These are supplemental workouts designed for Tuesday-Thursday during office weeks when time permits. They are **truly optional** - the core 4-day program (Upper A/B, Lower A/B) is sufficient for progress. These add-ons provide extra volume, maintain training frequency, or support recovery without interfering with the main program.

### Key Principles
- **Not required for progress** - Core 4 workouts are sufficient
- **No progression tracking** - Use consistent moderate weights
- **Lighter intensity** - Leave 3-4 reps in reserve
- **Time-efficient** - All under 30 minutes
- **Skip if tired** - Recovery takes priority over bonus volume

### Optional Workout 1: Quick Upper Accessory

**Duration:** 25 minutes  
**Purpose:** Extra arm volume, maintain upper body frequency  
**Best for:** Tuesday or Wednesday when you have 30 minutes

**Exercises:**
1. Cable Face Pulls - 3 sets, 15 reps, 60s rest
2. Bicep Curls (DB or Cable) - 3 sets, 12 reps, 60s rest
3. Tricep Extensions (Cable) - 3 sets, 12 reps, 60s rest
4. Pallof Press - 2 sets, 10/side, 60s rest

**Notes:**
- Use same weight each session (don't progress)
- Focus on form and muscle contraction
- Can superset biceps + triceps to save time (90s rest between supersets)
- Skip if arms still sore from Upper A/B

### Optional Workout 2: Zone 2 Cardio

**Duration:** 30 minutes  
**Purpose:** Cardiovascular health, active recovery  
**Best for:** Any day Tue-Thu, especially after Upper days

**Options:**
- Stationary bike (easiest on legs)
- Incline treadmill walk (10-15% grade, 3.0-3.5 mph)
- Elliptical
- Rowing machine (low intensity)
- Swimming

**Target intensity:**
- Can hold a conversation throughout
- Breathing elevated but not labored
- Heart rate ~60-70% max (if tracking)
- Should feel easier as workout progresses (warm-up effect)

**Notes:**
- This aids recovery, doesn't hinder it
- Can be done on same day as accessory work (after lifting)
- Don't turn this into HIIT or tempo work

### Optional Workout 3: Core + Mobility

**Duration:** 20 minutes  
**Purpose:** Injury prevention, movement quality, feel better  
**Best for:** Tuesday or Wednesday, especially during office weeks

**Structure:**

**Mobility Work (8 min):**
- Thoracic extensions on foam roller - 10 passes
- Cat-cow - 15 reps
- World's greatest stretch - 5/side
- Wall slides - 10 reps
- Hip 90/90 stretches - 60s/side

**Core Circuit (10 min):**
- Dead bugs - 3 sets × 10/side, 30s rest
- Plank - 3 sets × 45-60s, 30s rest
- Suitcase carries - 2 sets × 40 yards/side, 60s rest
- Bird dogs - 2 sets × 10/side, 30s rest

**Cooldown (2 min):**
- Child's pose - 60s
- Deep breathing - 60s

**Notes:**
- Use this on days you feel stiff or tight
- Particularly valuable during office weeks (sedentary Tue-Thu)
- Can do this at home if gym access is limited

### Optional Workout 4: Upper Pump Session

**Duration:** 30 minutes  
**Purpose:** Extra volume without CNS fatigue before Friday's Upper A  
**Best for:** Thursday of home weeks only

**Exercises:**
1. Cable Press (any angle) - 3 sets, 12-15 reps, 90s rest
   - Use 50-60% of your DB floor press weight equivalent
2. Cable Row (any angle) - 3 sets, 12-15 reps, 90s rest
3. Lateral Raises - 3 sets, 15 reps, 60s rest
   - Very light weight, focus on deltoid burn
4. Cable Curls - 2 sets, 15 reps, 60s rest
5. Cable Tricep Pushdowns - 2 sets, 15 reps, 60s rest
6. Pallof Press - 2 sets, 10/side, 60s rest

**Notes:**
- **Only on Thursday** - gives 24h before Friday's Upper A
- **Never on Wednesday** - too close to Friday's heavy work
- Light weights, high reps, chase the pump
- Stop if shoulders feel fatigued
- Skip entirely during office weeks (not worth the fatigue)

### Optional Workout 5: Lower Body Accessories

**Duration:** 25 minutes  
**Purpose:** Extra glute/hamstring work, calf development  
**Best for:** Wednesday of home weeks (between Lower A and Upper B)

**Exercises:**
1. Glute Bridges - 3 sets, 15-20 reps, 60s rest
   - Can add barbell across hips if desired
2. Hamstring Curls - 3 sets, 12-15 reps, 60s rest
3. Standing Calf Raises - 4 sets, 20 reps, 45s rest
4. Adductor Machine (if available) - 2 sets, 15 reps, 60s rest
5. Abductor Machine (if available) - 2 sets, 15 reps, 60s rest

**Notes:**
- Avoid heavy compound movements (squats, deadlifts)
- Focus on isolation and muscle feel
- Skip if still sore from Monday's Lower B
- Particularly good if you want extra glute development

### Scheduling Guidelines

**Office Week (Tue-Thu in office):**
- Realistic: 0-1 optional workouts max
- Best choice: Core + Mobility (can do at home)
- Alternative: Zone 2 Cardio (if you can fit 30 min)
- **Don't force it** - rest is more valuable than rushed bonus work

**Home Week (More flexibility):**
- Realistic: 1-3 optional workouts
- Tuesday: Quick Upper Accessory OR Zone 2 Cardio
- Wednesday: Core + Mobility OR Lower Accessories
- Thursday: Upper Pump Session OR Zone 2 Cardio

**Priority ranking when deciding:**
1. **Core + Mobility** - Most bang for buck, aids recovery
2. **Zone 2 Cardio** - Cardiovascular health, easy recovery
3. **Quick Upper Accessory** - If arms are a focus
4. **Upper Pump Session** - Only if feeling great Thursday
5. **Lower Accessories** - Only if specific weak points

### Implementation Notes for Tracker

**Separate category:**
- List as "Optional Workouts" distinct from main 4-day program
- Clearly label as "Optional - Not Required"
- Different visual treatment (lighter colors, different icon)

**No progression tracking:**
- Don't show "last time you did this"
- Don't calculate volume or progression metrics
- Simple checkbox: "Completed" or not
- Optional notes field only

**Time/Energy check:**
- Before starting, prompt: "Do you have 20-30 minutes and feel recovered?"
- Suggest skipping if user logged <7 hours sleep
- Suggest skipping if last workout was <48 hours ago

**Smart suggestions:**
- If Tuesday: Suggest Core + Mobility or Zone 2
- If Wednesday: Suggest Lower Accessories (only if home week)
- If Thursday: Suggest Upper Pump (only if home week)
- Never suggest on Friday-Monday (core workout days)

**Usage tracking:**
- Track frequency: "You've done X optional workouts this month"
- Don't make this competitive or a streak
- Frame as: "Bonus volume when life allows"

## Exercise Substitutions

### Primary Pressing (Neutral-Grip DB Floor Press)
**If unavailable:**
- Neutral-grip dumbbell press on low incline (15-30°)
- Neutral-grip dumbbell press on flat bench (shorter range of motion)
- Landmine press (slight angle, neutral grip)

**Never substitute with:**
- Barbell bench press
- Wide-grip pressing variations
- Full range dips

### Rows (Barbell Row)
**If unavailable:**
- Pendlay row
- Chest-supported dumbbell row
- T-bar row
- Seal row

**Key focus:**
- Pull with back, not arms
- Maintain neutral spine
- Full scapular retraction

### Cable Pressing Variations
**If cable machine unavailable:**
- Resistance band press (same angle)
- Light dumbbell press (higher rep range)
- Machine press (if available with neutral grip)

**Angle substitutions:**
- Decline cable press → Low cable crossover position
- Incline cable press → High cable crossover position

### Squatting (Back Squat)
**If unavailable or uncomfortable:**
- Safety bar squat (reduced thoracic stress)
- Goblet squat (lighter load, good for hypertrophy)
- Hack squat machine
- Leg press (not ideal, but acceptable)

**Never skip:**
- Some form of bilateral squat pattern for Lower A

### Bulgarian Split Squat
**If balance issues:**
- Rear foot elevated split squat with support
- Regular split squat (both feet on ground)
- Single-leg leg press

### Nordic Curls
**If too difficult:**
- Eccentric-only nordic curls (just the lowering)
- Band-assisted nordic curls
- Lying leg curl with slow eccentric
- Glute-ham raise (easier variation)

**Progression:**
- Start with 1-3 reps per set
- Focus on 5-second eccentric
- Add reps before adding sets

### Deadlift Variations (RDL, Stiff-Leg)
**If lower back sensitive:**
- Dumbbell RDL (easier to control)
- Single-leg RDL (lighter load, unilateral work)
- Back extension with good morning pattern

**Form priority:**
- Hinge at hips, not round spine
- Keep bar close to legs
- Feel stretch in hamstrings, not lower back

### Overhead Press (DB Overhead Press)
**If shoulder discomfort:**
- Landmine press
- Arnold press (partial rotation)
- Machine shoulder press

**Avoid if costochondritis flares:**
- Can create sternum stress if going too heavy
- Drop weight, increase reps if needed

### Core Exercises
**Pallof Press alternatives:**
- Cable woodchops (if position is issue)
- Anti-rotation band holds
- Suitcase carries

**Dead Bug alternatives:**
- Bird dog (easier)
- Hollow body hold
- Modified dead bug (single leg)

**Side Plank alternatives:**
- Side plank from knees
- Side lying hip abduction
- Copenhagen plank (advanced)

**Hanging Knee Raise alternatives:**
- Captain's chair knee raise
- Lying leg raise
- Reverse crunches
- Decline sit-ups

### Cardio Equipment
**HIIT Bike alternatives:**
- Rowing machine intervals (10x30s/30s)
- Assault bike
- Ski erg
- Treadmill sprints (if no knee issues)

**Steady-State alternatives:**
- Incline treadmill walk
- Elliptical
- Swimming
- Rowing machine (lower intensity)

## Bodyweight Substitutions

### When to Use Bodyweight Versions

**Use bodyweight when:**
- Traveling for work (hotel room workouts)
- Gym closed (holidays, weather)
- Sick but feel okay to move (active recovery)
- Deload week (perfect for bodyweight)
- Testing exercises (learning movement patterns)
- No gym access for 1-3 weeks

**Important limitations:**
- Can maintain for 2-3 weeks without strength decline
- Beyond 3 weeks: expect some strength loss
- Not ideal for building maximal strength (need heavy loads)
- Harder to progressively overload compared to weights

**Best practice:**
- Mix gym and bodyweight based on schedule
- Keep some heavy stimulus (1-2 gym days per week minimum)
- Use bodyweight for flexibility, not as primary training method

### Quick Reference: Bodyweight Substitution Table

| Gym Exercise | Bodyweight Alternative | Notes |
|--------------|------------------------|-------|
| Neutral-Grip DB Floor Press | Elevated Push-ups (limited ROM) | Hands on books/platform, stop at 90° elbow |
| Barbell Row | Inverted Rows (under table) | Adjust height to modify difficulty |
| Cable Press (decline) | Decline Push-ups | Feet elevated, limited ROM |
| Cable Press (incline) | Pike Push-ups | Downward dog position |
| Cable Row | Towel Rows | Use towel over door or sturdy anchor |
| DB Overhead Press | Pike Push-ups or Handstand Push-ups | Pike easier, handstand against wall |
| DB Lateral Raise | Band Lateral Raises | Requires resistance band |
| DB Reverse Fly | Prone Y-raises | Lying face down, arms in Y position |
| Face Pulls | Band Face Pulls | Requires resistance band |
| Bicep Curls | Towel Curls | Curl using towel under foot |
| Hammer Curls | Backpack Curls | Load backpack with books/water |
| Tricep Pushdowns | Diamond Push-ups | Hands close together |
| Close-Grip Pushdowns | Close-Grip Push-ups | Limited ROM for chest safety |
| Back Squat | Pistol Squats or Jump Squats | Pistol harder, jump for power |
| Bulgarian Split Squat | Same (bodyweight or loaded backpack) | Can add weight via backpack |
| Romanian Deadlift | Single-Leg RDL (bodyweight) | Focus on balance and hamstring stretch |
| Stiff-Leg Deadlift | Good Mornings (bodyweight) | Hands behind head |
| Leg Curl | Nordic Curls or Hamstring Slides | Nordic hardest, slides on slick floor |
| Leg Extension | Sissy Squats or Wall Sits | Sissy squats advanced, wall sits easier |
| Standing Calf Raise | Single-Leg Calf Raise | Use stairs for range of motion |
| Seated Calf Raise | Seated Single-Leg Calf Raise | Place weight (backpack) on knee |
| Walking Lunges | Same (bodyweight) | Can add backpack for resistance |
| Pallof Press | Band Anti-Rotation Press | Requires resistance band |
| Dead Bug | Same (bodyweight) | No substitution needed |
| Bird Dog | Same (bodyweight) | No substitution needed |
| Plank | Same (bodyweight) | No substitution needed |
| Side Plank | Same (bodyweight) | No substitution needed |
| Hanging Knee Raise | Lying Leg Raise or Reverse Crunches | Reverse crunches safest for chest |
| Cable Woodchops | Band Woodchops | Requires resistance band |

### Bodyweight Workout Programs

#### Upper A - Hypertrophy (Bodyweight)
1. **Elevated Push-ups (limited ROM)** - 4 sets, 12-15 reps, 120s rest
   - Hands on 4-6" platform, stop when elbows at 90°
2. **Inverted Rows** - 4 sets, 10-12 reps, 90s rest
   - Under sturdy table or between two chairs
3. **Decline Push-ups** - 3 sets, 12-15 reps, 60s rest
   - Superset: Towel Rows
4. **Towel Rows** - 3 sets, 12-15 reps, 60s rest
   - Superset: Decline Push-ups
5. **Pike Push-ups** - 3 sets, 10-12 reps, 60s rest
   - Superset: Prone Y-raises
6. **Prone Y-raises** - 3 sets, 15-20 reps, 60s rest
   - Superset: Pike Push-ups
7. **Towel Curls** - 2 sets, 15-20 reps each arm, 30s rest
   - Myo-rep style: 15-20 + 3 mini-sets
8. **Diamond Push-ups** - 2 sets, 15-20 reps, 30s rest
   - Myo-rep style: 15-20 + 3 mini-sets
9. **Plank** - 3 sets, 45-60s, 60s rest
10. **Dead Bug** - 3 sets, 12/side, 60s rest
11. **Side Plank** - 3 sets, 30s/side, 60s rest

#### Lower A - Strength + Conditioning (Bodyweight)
1. **Pistol Squats (assisted)** - 5 sets, 6-8 reps/leg, 180s rest
   - Hold door frame or use TRX for assistance
2. **Single-Leg RDL** - 3 sets, 10-12 reps/leg, 120s rest
3. **Jump Squats** - 3 sets, 15-20 reps, 90s rest
   - Superset: Wall Sits
4. **Wall Sits** - 3 sets, 45-60s, 90s rest
   - Superset: Jump Squats
5. **Single-Leg Calf Raise** - 4 sets, 15-20 reps/leg, 60s rest
6. **Lying Leg Raises** - 3 sets, 12-15 reps, 60s rest
7. **HIIT Burpees** - 10 rounds, 30s work/30s rest
   - Modified: step-ups instead of jump if needed

#### Upper B - Strength (Bodyweight)
1. **Elevated Push-ups (limited ROM)** - 5 sets, 8-10 reps, 180s rest
   - Add tempo: 3 sec down, 1 sec pause, explosive up
2. **Inverted Rows** - 5 sets, 8-10 reps, 180s rest
   - Feet elevated for difficulty
3. **Pike Push-ups** - 3 sets, 10-12 reps, 120s rest
4. **Wide Inverted Rows** - 3 sets, 10-12 reps, 120s rest
5. **Handstand Push-ups (against wall)** - 4 sets, 6-8 reps, 120s rest
   - Or pike push-ups with feet elevated
6. **Prone Y-raises** - 3 sets, 20-25 reps, 60s rest
7. **Chin-ups (if bar available)** - 3 sets, 8-10 reps, 90s rest
   - Or towel curls with slow tempo
8. **Diamond Push-ups** - 3 sets, 10-12 reps, 90s rest
9. **Plank** - 3 sets, 60s, 60s rest
10. **Bird Dog** - 3 sets, 10/side, 60s rest

#### Lower B - Hypertrophy + Conditioning (Bodyweight)
1. **Bulgarian Split Squats** - 4 sets, 12-15/leg, 120s rest
   - Rear foot elevated on chair/couch
2. **Good Mornings** - 3 sets, 15-20 reps, 120s rest
   - Hands behind head, slow tempo
3. **Walking Lunges** - 3 sets, 15/leg, 90s rest
   - Superset: Nordic Curls
4. **Nordic Curls (eccentric only)** - 3 sets, 3-5 reps, 90s rest
   - Partner holds feet or anchor under couch
   - Superset: Walking Lunges
5. **Seated Single-Leg Calf Raise** - 4 sets, 20-25/leg, 60s rest
   - Backpack on knee for resistance
6. **Russian Twists** - 3 sets, 15/side, 60s rest
7. **Steady-State Cardio** - 20 minutes
   - Jump rope, running, or shadow boxing

### Minimal Equipment Options

**Essential items for bodyweight training:**
1. **Resistance bands** (set of 3-4 different tensions) - $15-30
2. **Door anchor** (for band exercises) - $10
3. **Pull-up bar** (doorway mount) - $25-40
4. **Gymnastics rings or TRX** (optional but very useful) - $30-60
5. **Jump rope** (cardio option) - $10

**With these items:** Can replicate 90% of gym program effectiveness

**Completely equipment-free:** Can still do 70-80% effectively with creative substitutions

### Bodyweight Progression Methods

#### 1. Tempo Manipulation
- **Slow eccentrics:** 3-5 second lowering phase
- **Pauses:** 2-3 second hold at hardest position
- **Explosive concentrics:** Fast/explosive lifting phase
- **Example:** Push-up: 3 sec down, 2 sec pause, explosive up

#### 2. Range of Motion
- **Increase depth gradually**
- **Deficit work:** Hands/feet elevated on books/blocks
- **Example:** Push-ups on books (deeper ROM)

#### 3. Leverage Changes
- **Move hands/feet wider or closer**
- **Change body angle** (more horizontal = harder)
- **Example:** Pike push-ups → Handstand push-ups

#### 4. Unilateral Progressions
- **Two legs → Single leg**
- **Two arms → Archer → Single arm**
- **Example:** Squats → Bulgarian → Shrimp → Pistol

#### 5. Volume Progression
- **Add reps** within range (8→12→15)
- **Add sets** (3→4→5)
- **Reduce rest time** (120s→90s→60s)

#### 6. Explosive/Plyometric
- **Add jump at top** of movement
- **Clap variations** (push-ups)
- **Example:** Squats → Jump squats → Box jumps

### Exercise Progression Paths

**Push-ups (Easiest → Hardest):**
1. Wall push-ups (45° angle)
2. Elevated push-ups (hands on counter)
3. Knee push-ups
4. Regular push-ups (limited ROM - **start here for chest safety**)
5. Regular push-ups (full ROM - **caution with costochondritis**)
6. Decline push-ups (feet elevated)
7. Archer push-ups (shifting weight side to side)
8. One-arm push-ups
9. Planche push-ups (very advanced)

**Squat Variations (Easiest → Hardest):**
1. Bodyweight squats
2. Pause squats (3 sec at bottom)
3. Jump squats
4. Bulgarian split squats
5. Shrimp squats (assisted with door frame)
6. Pistol squats (assisted)
7. Full pistol squats
8. Weighted pistol squats (backpack)

**Pull Variations (Easiest → Hardest):**
1. Doorway lean-back rows
2. Table rows (feet on ground)
3. Inverted rows (feet elevated)
4. Chin-ups (underhand grip, easier)
5. Pull-ups (overhand grip)
6. Wide-grip pull-ups
7. Archer pull-ups
8. One-arm pull-ups (very advanced)

### Bodyweight-Specific Warm-up

**Before Upper Body Days:**
1. Arm circles - 10 each direction
2. Scapular push-ups - 10 reps (push-up position, retract/protract shoulder blades)
3. Band pull-aparts - 15 reps (or just the motion without band)
4. Cat-cow - 10 reps
5. Wall slides - 10 reps

**Before Lower Body Days:**
1. Leg swings - 10 each direction per leg
2. Bodyweight squats - 15 reps
3. Lunges - 5 each leg
4. Glute bridges - 15 reps
5. Single-leg balance - 30s each leg

### Intensity Guidelines for Bodyweight Training

**Matching gym intensity:**
- Bodyweight often feels "easier" but can be equally effective
- Focus on **quality of movement**, not just reps
- Use tempo and pauses liberally to increase difficulty
- Don't rush through sets - control every rep

**Volume adjustments:**
- May need 15-20 reps instead of 8-12 for similar stimulus
- Add 1-2 sets to compensate for lighter load
- Reduce rest periods to increase density

**Costochondritis considerations:**
- **Limited ROM push-ups are mandatory** - never full depth
- **No dips** or movements that stretch chest
- **Stop immediately** if any chest/sternum pain
- Pike push-ups generally safer than horizontal pressing

### Sample Mixed Scheduling

**Week with travel (Tue-Thu in office/traveling):**
- **Monday (home):** Upper A - BODYWEIGHT
- **Tuesday (office):** Rest or light core at home
- **Wednesday (office):** Rest
- **Thursday (office):** Rest
- **Friday (home, gym access):** Lower A - GYM (heavy)
- **Saturday (gym access):** Upper B - GYM (heavy)
- **Sunday:** Lower B - BODYWEIGHT or GYM

**This approach:**
- Maintains some heavy loading (gym days)
- Provides workout flexibility (bodyweight when needed)
- Prevents complete detraining
- Adapts to irregular schedule

### Tracker Implementation Notes

**Bodyweight mode toggle:**
- Allow users to switch workout to "bodyweight mode"
- Automatically substitutes all exercises with bodyweight alternatives
- Adjusts rep ranges (typically higher for bodyweight)
- Maintains same workout structure and progression tracking

**Exercise swapping:**
- Include bodyweight substitution in exercise substitution menu
- Show equipment requirements clearly (None/Bands/Pull-up bar)
- Allow custom substitutions for user preferences

**Progression tracking:**
- Track volume via reps and tempo instead of weight
- Note when tempo changes (e.g., "3-0-1" = 3 sec down, 0 pause, 1 sec up)
- Flag when ready to progress to harder variation
- Suggest next progression step

## Equipment Requirements

### Essential Equipment
- Barbell with plates
- Dumbbells (multiple weights or adjustable)
- Cable machine with various attachments
- Squat rack or power cage
- Flat bench (for floor press alternative)
- Pull-up bar or lat pulldown machine

### Optional but Recommended
- Leg curl/extension machine
- Calf raise machine or platform
- Cardio equipment (bike, treadmill, rower)
- Resistance bands (for assistance/substitutions)
- Exercise mat (for core work)

### Gym Layout Considerations
**For supersets:**
- Need cable machine and nearby space for rows
- Leg curl/extension machines should be accessible together
- Core work area should be separate from main lifting zone

**Equipment alternatives included in substitutions section**

## Scheduling Information

### Standard Weekly Split
**Ideal schedule when fully flexible:**
- Monday: Upper A
- Tuesday: Lower A
- Wednesday: Rest
- Thursday: Upper B
- Friday: Lower B
- Weekend: Rest

### Office Week Adaptation (Tue-Thu in office)
**Week A - Office week:**
- Monday: Upper A (before office week)
- Tuesday: Rest (in office)
- Wednesday: Rest (in office)
- Thursday: Rest (in office)
- Friday: Lower A
- Saturday: Upper B
- Sunday: Lower B or Rest

**Week B - Home week:**
- Monday: Upper A
- Tuesday: Lower A (home - can workout)
- Wednesday: Rest
- Thursday: Upper B (home - can workout)
- Friday: Lower B
- Weekend: Rest

### Minimal Time Scheduling
**If workout time is limited:**
- Skip conditioning portions temporarily
- Core can be done at home on rest days
- Prioritize main compound lifts
- Reduce accessory volume (drop 1 set from isolation exercises)

### Recovery Priority
**If scheduling creates back-to-back sessions:**
- Never do Upper A + Upper B on consecutive days
- Never do Lower A + Lower B on consecutive days
- Can do Upper + Lower on consecutive days
- Prioritize sleep and nutrition if training 3+ days in a row

## Progression Methodology

### Double Progression System
**How it works:**
1. Start with weight at bottom of rep range for all sets
2. Work to hit top of rep range for ALL sets
3. Once top range achieved on all sets, increase weight
4. New weight will drop you back to bottom of range
5. Repeat cycle

**Example - DB Floor Press (8-12 reps):**
- Week 1: 50lbs × 8, 8, 8, 7 (not ready)
- Week 2: 50lbs × 9, 9, 8, 8 (not ready)
- Week 3: 50lbs × 10, 10, 9, 9 (not ready)
- Week 4: 50lbs × 12, 12, 11, 11 (not ready)
- Week 5: 50lbs × 12, 12, 12, 12 (READY TO PROGRESS)
- Week 6: 55lbs × 8, 8, 8, 8 (restart cycle)

### Weight Increments
**Upper body:**
- Dumbbells: 2.5-5 lbs per hand (5-10 lbs total)
- Barbell: 5 lbs total
- Cable: smallest increment available

**Lower body:**
- Squat/Deadlift: 5-10 lbs
- Accessories: 2.5-5 lbs per dumbbell

### Strength vs Hypertrophy Days
**Strength days (4-6 reps):**
- Longer rest periods (180s)
- Focus on weight progression
- Lower total volume
- Builds maximum strength base

**Hypertrophy days (8-12 reps):**
- Moderate rest (90-120s)
- Higher total volume
- More "time under tension"
- Builds muscle mass

**Why both:**
- Strength days drive up maximum capacity
- Hypertrophy days build muscle with submaximal loads
- Prevents plateaus from doing same thing every session
- Strength gains from A days carry over to heavier loads on B days

### Superset Execution
**Rest periods for supersets:**
- Exercise 1 → minimal rest (10-15s) → Exercise 2 → full rest → repeat
- Example: Cable Press → 10s → Cable Row → 90s → repeat for 3 sets

**Benefits:**
- Cuts workout time significantly
- Maintains training density
- Pushes/pulls paired reduce fatigue interference
- Upper/lower paired exercises enhance recovery between sets

### Myo-reps Protocol
**Structure (12-15+3x3-5):**
1. Activation set: 12-15 reps to near failure
2. Rest 15 seconds
3. Mini-set 1: 3-5 reps
4. Rest 15 seconds  
5. Mini-set 2: 3-5 reps
6. Rest 15 seconds
7. Mini-set 3: 3-5 reps

**Purpose:**
- High volume in minimal time
- Metabolic stress for arm growth
- Efficient way to hit 20-25 total reps per set
- Used for biceps/triceps due to time efficiency

### Progression Plateaus
**If stuck for 3+ weeks:**
- Check recovery (sleep, nutrition, stress)
- Reduce weight by 10%, focus on form
- Add 1 extra set temporarily
- Consider if exercise needs substitution
- Evaluate if volume is too high overall

## Training Guidelines

### Warm-up Protocol
**Before each workout:**
1. 5 minutes light cardio (bike, walk, row)
2. Dynamic stretching (arm circles, leg swings, torso rotations)
3. 2 warm-up sets for first exercise:
   - Set 1: 50% working weight × 8-10 reps
   - Set 2: 75% working weight × 4-6 reps

**Never skip warm-up with costochondritis history**

### Form Cues by Exercise Category

**Floor Press:**
- Shoulder blades pinched together throughout
- Elbows at 45° angle (not flared wide)
- Stop when triceps touch ground (don't bounce)
- Drive through heels (leg drive)
- Pause at bottom for 1 second

**Rows:**
- Lead with elbows, not hands
- Pull to lower chest/upper abdomen
- Squeeze shoulder blades together at top
- Control the negative (don't drop weight)
- Avoid shrugging shoulders

**Squats:**
- Chest up, core braced
- Hip hinge then knee bend
- Knees track over toes
- Depth to parallel or slightly below
- Drive through midfoot/heel

**Deadlift variations:**
- Hinge at hips, not waist
- Bar stays close to legs entire movement
- Neutral spine (no rounding)
- Shoulders over or slightly ahead of bar at start
- Squeeze glutes at top (don't hyperextend)

**Core work:**
- Breathe throughout (don't hold breath)
- Brace abs, don't suck in stomach
- Quality over quantity
- Stop if costochondritis pain occurs

### Deload Strategy
**Every 6-8 weeks:**
- Reduce volume by 50% (half the sets)
- OR reduce intensity by 20% (lighter weights, easier variations)
- Maintain frequency (still do all 4 workouts)
- Allows recovery and adaptation
- Prevents overtraining and injury

**Signs you need a deload:**
- Persistent fatigue despite rest days
- Weight moving slower than usual
- Nagging joint pain
- Sleep quality declining
- Motivation dropping

### Failure Management
**Never train to complete failure on:**
- Squats (safety risk)
- Deadlift variations (form breakdown)
- Any free weight press (chest safety)

**Can approach failure (1-2 reps in reserve) on:**
- Cable exercises
- Machine work
- Isolation movements (curls, raises)
- Last set of myo-reps

### Injury Prevention
**Red flags to stop immediately:**
- Sharp pain (distinct from muscle burn)
- Joint pain
- Chest/sternum discomfort
- Numbness or tingling
- Dizziness

**If costochondritis symptoms return:**
- Drop all pressing movements temporarily
- Focus on rows, squats, deadlifts
- Increase core and arm work
- Return to pressing with cables only, lighter weight
- Consult healthcare provider if persistent

### Testing Maxes
**Not required for this program**
- Double progression doesn't need 1RM testing
- Estimate 1RM from top end of rep range if curious
- If testing, do during deload week only
- Never test max with costochondritis history on pressing movements

## Required Features

### 1. Workout Selection
- User selects which workout to perform (Upper A, Lower A, Upper B, Lower B)
- Display workout name and full exercise list

### 2. Exercise Tracking
For each exercise, track per set:
- Set number (1, 2, 3, etc.)
- Reps completed (user input)
- Weight used (user input, optional for bodyweight exercises)
- Set completion status (checkbox/toggle)

### 3. Rest Timer
- Automatically start countdown after completing a set
- Display time remaining
- Allow manual start/stop/reset
- Different rest periods per exercise (specified in workout data)
- Visual/audio notification when rest period ends

### 4. Data Persistence
Store workout history including:
- Date of workout
- Workout type (Upper A, Lower A, etc.)
- For each exercise: sets completed, reps, weight used
- Enable viewing previous performance for same exercise

### 5. Historical Data Display
When starting an exercise, show:
- Last time this exercise was performed (date)
- Weight and reps from previous session for each set
- Comparison to previous best performance
- Total workouts completed for this exercise
- Weight progression history over time

**Example display:**
```
DB Floor Press
Last workout: Dec 10, 2024
Previous: 50lbs × 12, 12, 11, 10
Target today: 50lbs × 12, 12, 12, 12 (to progress)
```

### 6. Progression Tracking
Support double progression method:
- When user hits top of rep range for all sets, suggest weight increase
- Track if ready to progress on specific exercises
- Calculate suggested weight increase based on exercise type (upper vs lower body)
- Display progression status per exercise (e.g., "3/4 sets at top range")

### 7. Progression Indicators
Show per exercise:
- Current status: "In progress", "Ready to increase weight", or "Increased weight"
- Sets completed at top of rep range vs total sets
- Last weight increase date
- Percentage through current progression cycle

### 8. Exercise Notes Display
Show contextual information:
- Form cues for current exercise
- Superset pairings clearly indicated
- Special protocols (myo-reps, AMRAP, intervals)
- Safety reminders where relevant

## User Interface Requirements

### Workout View
- Clean list of exercises in order
- Clear visual grouping for supersets
- Exercise notes/cues visible when needed
- Progress indicator showing workout completion

### Exercise Entry
- Quick input for reps and weight
- Mark set as complete
- Easy navigation between sets and exercises
- Clear display of target reps and rest time

### Timer Display
- Prominent countdown display
- Pause/resume capability
- Skip rest period option
- Progress ring/bar showing time remaining

### History View
- List of past workouts by date
- Drill down to see specific workout details
- Compare performance across sessions

## Technical Requirements

### Data Storage
- Use localStorage or similar for persistence
- Store data in structured format for easy retrieval
- Handle data migration if structure changes

### State Management
- Track current workout, current exercise, current set
- Manage timer state independently
- Handle workout session (start, pause, complete, abandon)

### Performance
- Fast loading of workout data
- Smooth timer updates (1 second intervals)
- Quick data entry without lag

### Compatibility
- Work on mobile devices (primary use case is at gym)
- Responsive design for phone screens
- Consider offline functionality

## Google Sheets Integration

### Overview
The tracker integrates with Google Sheets for data persistence and backup. This allows workout data to be accessed across devices and provides a backup beyond localStorage.

### Google Sheets API Configuration

**API Credentials:**
- Client ID: `684177592462-7slnqfr7b3ng1k07daellkoar7no3n0n.apps.googleusercontent.com`
- Target Sheet ID: `115OSeN_PePPBGH_bSbaDOJj_vypCRb5yjiGXzbIFLo0`
- Required Scopes:
  - `https://www.googleapis.com/auth/spreadsheets` (read/write spreadsheet data)
  - `https://www.googleapis.com/auth/drive.file` (access files created by app)

**Note:** To use a different Google Sheet, simply update the Sheet ID in the code. Each user should ideally have their own personal sheet for their workout data.

**Authentication Flow:**
1. User clicks "Connect to Google Sheets"
2. OAuth 2.0 popup (or redirect) requests permission
3. User authorizes app to access their Google Sheets
4. App receives access token (client-side only - no backend)
5. Token stored securely in sessionStorage for current session

**OAuth Flow Type:**
- Use **OAuth 2.0 Implicit Flow** (legacy) or **PKCE Flow** (recommended)
- No backend server means no client secret
- All authentication happens in browser
- Client ID is public (safe for this use case)
- Access tokens are short-lived for security

### Sheet Structure

The target spreadsheet (ID: `115OSeN_PePPBGH_bSbaDOJj_vypCRb5yjiGXzbIFLo0`) should contain the following sheets (tabs):

**Setup Instructions:**
1. Open the Google Sheet with the ID above (or create a new one)
2. Create 4 sheets (tabs) with exact names: "Workout Log", "Exercise Library", "Progression Tracking", "Workout History"
3. Set up column headers as specified below
4. Share settings: "Anyone with the link can edit" OR specific Google account access
5. The app will read from Exercise Library and write to all sheets

#### Sheet 1: "Workout Log"
Columns:
- A: Date (YYYY-MM-DD format)
- B: Workout Type (Upper A, Lower A, Upper B, Lower B)
- C: Exercise Name
- D: Set Number (1, 2, 3, etc.)
- E: Reps Completed
- F: Weight Used (lbs)
- G: Rest Time (seconds)
- H: Notes (optional)

Example rows:
```
2024-12-15 | Upper A | Neutral-Grip DB Floor Press | 1 | 12 | 50 | 180 | Good form
2024-12-15 | Upper A | Neutral-Grip DB Floor Press | 2 | 12 | 50 | 180 |
2024-12-15 | Upper A | Neutral-Grip DB Floor Press | 3 | 11 | 50 | 180 |
```

#### Sheet 2: "Exercise Library"
Columns:
- A: Exercise Name
- B: Workout Type (Upper A, Lower A, Upper B, Lower B)
- C: Target Sets
- D: Target Rep Range
- E: Default Rest (seconds)
- F: Category (optional: core, cardio)
- G: Superset Partner (optional)
- H: Notes

This sheet serves as the source of truth for exercise definitions and can be modified to update the program.

#### Sheet 3: "Progression Tracking"
Columns:
- A: Exercise Name
- B: Current Weight (lbs)
- C: Last Weight Increase Date
- D: Sets at Top Range (count)
- E: Total Sets (count)
- F: Ready to Progress (TRUE/FALSE)
- G: Suggested Next Weight

This sheet tracks progression status for each exercise using formulas.

#### Sheet 4: "Workout History"
Columns:
- A: Date
- B: Workout Type
- C: Total Volume (sum of sets × reps × weight)
- D: Duration (minutes)
- E: Exercises Completed
- F: Notes

Summary view of each workout session.

### API Operations

#### Reading Data
**Get Exercise Library:**
- Range: `'Exercise Library'!A2:H`
- Returns: All exercise definitions
- Used: On app startup to populate workout templates

**Get Last Workout Data:**
- Range: `'Workout Log'!A2:H`
- Filter: Most recent date + matching exercise name
- Returns: Previous performance for comparison
- Used: When starting an exercise

**Get Progression Status:**
- Range: `'Progression Tracking'!A2:G`
- Returns: Current progression state for all exercises
- Used: To display "ready to progress" indicators

#### Writing Data
**Log Completed Set:**
- Range: `'Workout Log'!A:H`
- Operation: Append row
- Data: Date, workout type, exercise, set #, reps, weight, rest, notes
- Triggered: After each set completion

**Update Progression:**
- Range: `'Progression Tracking'!A:G`
- Operation: Update row (matching exercise name)
- Data: New weight, date, set counts, ready status
- Triggered: After completing all sets of an exercise

**Log Workout Summary:**
- Range: `'Workout History'!A:E`
- Operation: Append row
- Data: Date, workout type, total volume, duration, exercise count
- Triggered: When workout marked complete

### Data Sync Strategy

**On App Load:**
1. Check if online
2. If online: Fetch exercise library from Sheets
3. If offline: Use cached data from localStorage
4. Compare versions, update if Sheets is newer

**During Workout:**
1. Save to localStorage immediately (instant feedback)
2. Queue write operations for Sheets
3. Attempt sync after each set if online
4. If offline: Queue continues to grow

**On Reconnection:**
1. Detect network restoration
2. Process queued writes in chronological order
3. Verify all writes succeeded
4. Clear queue
5. Fetch latest progression data

**Conflict Resolution:**
- localStorage is source of truth during active workout
- Sheets is source of truth for historical data
- If conflict detected, prefer most recent timestamp
- Manual merge UI if large discrepancy detected

### Error Handling

**Authentication Errors:**
- Token expired: Automatically refresh using refresh token
- Refresh failed: Prompt user to re-authenticate
- User denied: Fall back to localStorage-only mode

**Network Errors:**
- Retry failed requests up to 3 times with exponential backoff
- After 3 failures: Queue operation and continue offline
- Display sync status indicator to user

**Data Validation:**
- Validate data format before writing to Sheets
- Reject invalid entries (negative weights, missing required fields)
- Log validation errors for debugging

**Rate Limiting:**
- Google Sheets API: 100 requests per 100 seconds per user
- Batch write operations when possible
- Implement request throttling to stay under limits
- Priority queue: immediate feedback > historical sync

### Security Considerations

**Token Storage:**
- Store access token in sessionStorage (cleared on browser close)
- Store refresh token in localStorage (if using PKCE flow)
- Never log tokens to console
- Tokens expire automatically (typically 1 hour for access tokens)

**Note for Static Sites:**
- No secure server-side storage available
- sessionStorage provides reasonable security for active workout session
- User must re-authenticate on new browser session
- Consider this acceptable trade-off for static site simplicity

**API Key Protection:**
- Client ID is public (safe to include in client code)
- No client secret in frontend code (not needed for PKCE/implicit flow)
- Restrict API key to authorized domains in Google Cloud Console
- Add only GitHub Pages URL to authorized origins
- Monitor for unauthorized usage in Google Cloud Console

**Data Privacy:**
- User's workout data stays in their Google account
- App only accesses specified sheet
- No data sent to external servers
- User can revoke access anytime via Google account settings

### Performance Optimization

**Batch Operations:**
- Collect multiple set completions before writing
- Use `batchUpdate` API for multiple operations
- Reduces API calls and improves responsiveness

**Caching:**
- Cache exercise library for duration of workout
- Only refetch if user explicitly refreshes
- Cache progression data, invalidate after updates

**Lazy Loading:**
- Load workout history only when user views history
- Paginate large datasets (load 30 days at a time)
- Implement infinite scroll for older data

### Testing Considerations

**Mock Mode:**
- Enable testing without real Google Sheets connection
- Use local JSON files to simulate API responses
- Toggle via developer settings or environment variable

**Test Sheet:**
- Separate test sheet ID for development
- Prevents pollution of production workout data
- Can reset test sheet easily

### Fallback Strategy

**If Google Sheets Unavailable:**
1. Continue using localStorage
2. Display offline mode indicator
3. Queue all sync operations
4. Allow export to CSV as backup
5. Manual import to Sheets later if needed

**Migration Path:**
- Export from localStorage to CSV
- Import CSV to Google Sheets manually
- Future sync will use Sheets as source

## Data Export Specifications

### Export Format
Should be able to export workout data in structured format (JSON or CSV) containing:
- Date
- Workout type
- Exercise name
- Sets, reps, weight per set
- Total volume (sets × reps × weight)
- Workout duration
- Notes

### Analysis Metrics
Track over time:
- Total volume per workout
- Total volume per muscle group
- Average weight used per exercise
- Total workouts completed
- Workout frequency (days per week)
- Personal records by exercise

### Useful Calculations
- **Volume:** Sets × Reps × Weight
- **Relative Intensity:** Weight / Estimated 1RM
- **Volume Load Progression:** Current volume vs. previous session
- **Time Under Tension:** Reps × tempo (if tempo tracked)

## Critical Program Notes

### First 2-4 Weeks
- Start conservative on weights (can hit top of rep range on first session)
- Focus on form mastery
- Learn superset timing and flow
- Establish baseline for all movements
- No progression pressure yet

### Chest Safety Reminders
- Stop immediately if sternum discomfort occurs
- Neutral grip is non-negotiable for pressing
- Floor press provides safety stop at bottom
- Scapular retraction must be maintained
- Cable pressing provides easiest load adjustment

### Core Work Purpose
- Rebuilds trunk stability post-injury
- Prevents compensatory patterns
- Essential for safe heavy lifting
- Anti-rotation focus protects spine
- Never skip core work to save time

### Conditioning Integration
- HIIT on Lower A prevents cardio interference with upper body recovery
- Steady-state on Lower B enhances recovery
- Never add extra cardio on upper body days
- If conditioning impacts leg day performance, reduce intensity (not frequency)

### Program Duration
- Run program minimum 12 weeks before making major changes
- First 4 weeks: learn and establish baselines
- Weeks 5-12: consistent progression phase
- After 12 weeks: reassess goals and potentially modify exercises
- Can run program 6-12 months with proper progression and deloads

## Implementation Priorities

### Phase 1 - Core Functionality (MVP)
1. Workout selection (4 workout types)
2. Exercise list display with sets/reps/rest
3. Set logging (reps, weight)
4. Rest timer
5. Basic data persistence (localStorage only)
6. View previous session data from localStorage

**Note:** Phase 1 works entirely offline with localStorage. No Google Sheets integration required for MVP.

### Phase 2 - Progression Support
1. Double progression tracking
2. Progression indicators (ready to increase weight)
3. Weight increase suggestions
4. Volume calculations
5. Workout history view
6. **Google Sheets integration (optional but recommended)**

**Note:** Phase 2 adds cloud sync for cross-device access and backup.

### Phase 3 - Enhanced UX
1. Superset visual grouping
2. Exercise notes/cues on demand
3. Form reminder notifications
4. Quick exercise substitution
5. Custom rest period adjustment

### Phase 4 - Advanced Features
1. Data export
2. Performance analytics
3. Deload week planning
4. Workout scheduling suggestions based on office calendar
5. Exercise video links or demonstrations

## Google Sheets API Implementation Notes

### Required Libraries
- Google API JavaScript Client: `https://apis.google.com/js/api.js`
- Google Identity Services: `https://accounts.google.com/gsi/client`

### Initialization Code Pattern
1. Load Google API library
2. Initialize gapi client with client ID
3. Discover Sheets API v4
4. Set up auth listener
5. Attempt silent sign-in if previously authorized

### Common API Calls

**Read Range:**
- Method: `gapi.client.sheets.spreadsheets.values.get`
- Parameters: `spreadsheetId`, `range`
- Returns: Values in 2D array format

**Append Row:**
- Method: `gapi.client.sheets.spreadsheets.values.append`
- Parameters: `spreadsheetId`, `range`, `valueInputOption` ('USER_ENTERED')
- Body: `{ values: [[col1, col2, col3, ...]] }`

**Update Range:**
- Method: `gapi.client.sheets.spreadsheets.values.update`
- Parameters: `spreadsheetId`, `range`, `valueInputOption` ('USER_ENTERED')
- Body: `{ values: [[col1, col2, col3, ...]] }`

**Batch Update:**
- Method: `gapi.client.sheets.spreadsheets.values.batchUpdate`
- Body: `{ data: [{ range, values }, ...], valueInputOption: 'USER_ENTERED' }`

### Sample Data Flow

**Logging a Set:**
1. User completes set in UI
2. Data saved to localStorage immediately
3. Format data for Sheets: `[date, workout, exercise, setNum, reps, weight, rest, notes]`
4. Append to 'Workout Log' sheet
5. If successful: mark as synced in localStorage
6. If failed: add to retry queue

**Loading Previous Performance:**
1. User selects exercise to start
2. Query 'Workout Log' for most recent matching entries
3. Filter by exercise name, sort by date descending
4. Take first N rows (where N = number of sets)
5. Display in UI as "Previous: 50lbs × 12, 12, 11, 10"

**Checking Progression Status:**
1. After completing final set of exercise
2. Fetch all sets from current workout for this exercise
3. Count sets where reps ≥ top of range
4. If count equals total sets: flag as "ready to progress"
5. Update 'Progression Tracking' sheet with new status
6. Calculate suggested weight increase (5-10 lbs based on exercise type)

### Sheet Formulas

**In 'Progression Tracking' sheet:**

Column F (Ready to Progress):
```
=IF(D2=E2, TRUE, FALSE)
```
Where D2 is "Sets at Top Range" and E2 is "Total Sets"

Column G (Suggested Next Weight):
```
=IF(F2=TRUE, IF(ISNUMBER(SEARCH("DB",A2)), B2+5, B2+10), "")
```
Suggests +5 lbs for DB exercises, +10 lbs for barbell

**In 'Workout History' sheet:**

Column C (Total Volume):
```
=SUMPRODUCT((FILTER('Workout Log'!E:E,'Workout Log'!A:A=A2))*(FILTER('Workout Log'!F:F,'Workout Log'!A:A=A2)))
```
Sums (reps × weight) for all sets on given date

### Mobile Considerations

**Google Sign-In Button:**
- Use standard Google Sign-In button for consistency
- Size: 'large' for desktop, 'medium' for mobile
- Theme: 'outline' for light mode, 'filled_blue' for dark mode

**OAuth Flow on Mobile:**
- Popup may be blocked on some mobile browsers
- Fallback to redirect flow if popup fails
- Store return URL to resume workout after auth

**Offline Detection:**
- Listen to `online`/`offline` events
- Show sync status indicator
- Disable Sheets-dependent features gracefully

### Development Workflow

**Setup:**
1. Create project in Google Cloud Console
2. Enable Google Sheets API
3. Create OAuth 2.0 credentials (Web application type)
4. Add authorized JavaScript origins (localhost for development)
5. Add authorized redirect URIs
6. Copy Client ID to app configuration

**Local Testing:**
- Use `http://localhost:3000` (or appropriate port)
- Add to authorized origins in Google Cloud Console
- Test with personal Google account
- Verify Sheet structure matches specification

**Production Deployment:**
- Update authorized origins with production domain
- Test authentication flow on production URL
- Monitor quota usage in Google Cloud Console
- Set up alerts for quota approaching limits

## GitHub Pages Deployment

### Quick Setup Reference

**URLs to Configure:**
- Local Development: `http://localhost:3000`
- Production: `https://yourusername.github.io/workout-tracker/`
- Replace `yourusername` with your actual GitHub username

**Google Cloud Console Settings:**
- OAuth 2.0 Client Type: Web application
- Authorized JavaScript origins: Add both local and production URLs
- Authorized redirect URIs: Add both local and production URLs

**GitHub Repository Settings:**
- Enable GitHub Pages: Settings > Pages
- Source: Deploy from branch `main` (or `gh-pages`)
- Folder: `/` (root)
- Enforce HTTPS: ✓ Enabled (required)

### Overview
The workout tracker will be deployed as a static site on GitHub Pages. This is a free hosting solution that works well for client-side applications with Google Sheets as the backend.

### GitHub Pages Configuration

**Repository Setup:**
- Repository name format: `username.github.io/workout-tracker` (custom path) OR `username.github.io` (root domain)
- Branch: `main` or `gh-pages` (configured in repository settings)
- Source folder: `/` (root) or `/docs` (configure in settings)
- GitHub Pages URL: `https://username.github.io/workout-tracker/`

**File Structure:**
```
/workout-tracker/
├── index.html          (main app file)
├── styles.css          (optional: external styles)
├── app.js              (optional: external JavaScript)
└── README.md           (documentation)
```

**For single-file deployment:**
- All HTML, CSS, and JavaScript in one `index.html` file
- Simplest approach for this project
- No build process required

### Google Cloud Console Configuration

**Authorized JavaScript Origins:**
Add these URLs to your OAuth 2.0 client settings:
- Development: `http://localhost:3000` (or your local dev port)
- Production: `https://yourusername.github.io`

**Authorized Redirect URIs:**
- Development: `http://localhost:3000` (or your local dev port)
- Production: `https://yourusername.github.io/workout-tracker/`

**Important:** GitHub Pages enforces HTTPS, which is required for Google OAuth 2.0. No additional configuration needed.

### Static Site Constraints

**No Backend:**
- All code runs in the browser
- No server-side processing or storage
- OAuth flow must be client-side only
- Use OAuth 2.0 implicit flow (for older implementations) or PKCE flow (recommended)

**Public Source Code:**
- All code visible in browser and GitHub repository
- Client ID is public (safe for OAuth 2.0 public clients)
- Sheet ID is visible (ensure sheet permissions are set correctly)
- No secrets or API keys in the code

**Storage Limitations:**
- localStorage limited to ~5-10MB depending on browser
- No server-side database
- Google Sheets serves as cloud backup
- Consider data size when storing historical workouts

### Deployment Process

**Initial Setup:**
1. Create GitHub repository
2. Enable GitHub Pages in repository Settings > Pages
3. Select branch (main) and folder (root)
4. Wait 1-2 minutes for deployment
5. Access at `https://yourusername.github.io/workout-tracker/`

**Updating the App:**
1. Make changes to index.html (or other files)
2. Commit changes to repository
3. Push to GitHub
4. GitHub automatically rebuilds and deploys
5. Changes live in 1-2 minutes
6. Hard refresh browser (Ctrl+F5) to see updates

**Versioning:**
- Use git tags for version releases
- Consider cache busting for major updates
- Add version number in HTML comment for tracking

### Custom Domain (Optional)

**If using custom domain:**
1. Purchase domain from registrar
2. Configure DNS records:
   - A records pointing to GitHub Pages IPs
   - CNAME record for www subdomain
3. Add CNAME file to repository with domain name
4. Update authorized origins in Google Cloud Console
5. Wait for DNS propagation (up to 48 hours)

**Example DNS setup:**
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   yourusername.github.io
```

### HTTPS Enforcement
- GitHub Pages provides free HTTPS via Let's Encrypt
- Enforce HTTPS in repository settings (recommended)
- Required for Google OAuth 2.0
- Automatic certificate renewal

### Mobile Access

**Progressive Web App (PWA) Considerations:**
- Add manifest.json for "Add to Home Screen" functionality
- Enable service worker for offline capability
- Cache static assets for faster loading
- Store workout data in IndexedDB for offline access

**Mobile-Optimized URL:**
- Users can bookmark `https://yourusername.github.io/workout-tracker/`
- Add to home screen creates app-like icon
- Opens in standalone mode (no browser chrome)
- Works like native app on mobile device

### Performance on GitHub Pages

**Loading Speed:**
- Static files load very fast
- No server processing delays
- CDN-backed (GitHub's infrastructure)
- Consider minifying HTML/CSS/JS for production

**API Calls:**
- Google Sheets API calls not affected by hosting
- Rate limits apply per user, not per domain
- Consider service worker for caching API responses
- Offline-first approach reduces API dependency

### Testing Strategy

**Local Development:**
1. Run local HTTP server: `python -m http.server 3000`
2. Or use VS Code Live Server extension
3. Or use `npx serve`
4. Access at `http://localhost:3000`

**Testing Before Push:**
- Test all features locally first
- Verify OAuth flow with localhost origin
- Check mobile responsiveness (browser dev tools)
- Test offline functionality (throttle network)

**Post-Deployment Testing:**
- Test OAuth flow on GitHub Pages URL
- Verify Google Sheets read/write
- Test on actual mobile device
- Check different browsers (Chrome, Safari, Firefox)

### Troubleshooting

**OAuth Errors:**
- Error: "redirect_uri_mismatch" → Check authorized redirect URIs include GitHub Pages URL
- Error: "origin_mismatch" → Add GitHub Pages domain to authorized origins
- Error: "popup_closed_by_user" → Implement redirect flow fallback

**Page Not Loading:**
- Check GitHub Pages is enabled in repository settings
- Verify source branch and folder are correct
- Ensure index.html exists in correct location
- Check browser console for errors

**Updates Not Showing:**
- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check GitHub Actions tab for deployment status
- Verify commit was pushed to correct branch

**Google Sheets Connection Issues:**
- Verify sheet ID is correct
- Check sheet permissions (anyone with link can edit)
- Verify sheet structure matches specification
- Test API calls in browser console

### Security Considerations for GitHub Pages

**Public Repository:**
- Anyone can view your source code
- Don't commit any secrets or passwords
- Client ID is safe to expose (designed for public clients)
- Sheet ID visibility is acceptable (controlled by sheet permissions)

**Sheet Permissions:**
- Set sheet to "Anyone with the link can edit"
- Or share specifically with your Google account
- Consider creating Apps Script for row-level security if needed
- Monitor sheet for unexpected changes

**XSS Protection:**
- Sanitize any user input before rendering
- Use textContent instead of innerHTML where possible
- Validate data from Google Sheets before using

### Backup Strategy

**Since GitHub Pages is static:**
- Repository itself is version-controlled backup of code
- Google Sheets holds workout data
- localStorage provides offline backup
- Consider periodic export to local CSV file
- User can clone repository for full backup

### Cost Analysis

**GitHub Pages:**
- Free for public repositories
- Free for private repositories (with GitHub Free)
- No bandwidth charges
- No storage charges for typical use

**Google Sheets API:**
- Free tier: 100 requests per 100 seconds per user
- Sufficient for typical workout tracking usage
- No charges unless exceeding free tier
- Monitor usage in Google Cloud Console

**Total Cost:** $0 for typical usage

### Scaling Considerations

**If App Becomes Popular:**
- Each user has their own Google Sheet
- No shared backend to scale
- No hosting costs increase
- Google API quotas are per-user, not per-app
- Can support unlimited users at no additional cost

**Data Migration:**
- Users own their data (in their Google Sheet)
- Easy to export and migrate
- Not locked into specific platform
- Can switch hosting providers without data loss