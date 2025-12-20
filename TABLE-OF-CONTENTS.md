# Workout Tracker Specification - Table of Contents

This document provides a navigational overview of the complete technical specification.

## Document Structure

### 1. Quick Reference
- Program type and focus
- Special considerations
- Progression method
- Training style and duration
- Equipment requirements

### 2. Overview
- Application purpose and scope

### 3. Program Philosophy
- **Design Principles**
  - Chest-safe approach
  - Double progression methodology
  - Efficiency focus with supersets
  - Integrated conditioning
  - Progressive overload structure

- **Costochondritis Considerations**
  - Avoided movements
  - Safe alternatives
  - Safety protocols

### 4. Program Structure
- **Workout Split** (4-day cycle)
  - Upper A - Hypertrophy
  - Lower A - Strength + Conditioning
  - Upper B - Strength
  - Lower B - Hypertrophy + Conditioning

- **Exercise Data Model**
  - Name, sets, reps, rest periods
  - Superset pairings
  - Category tags
  - Notes and cues

### 5. Workout Definitions

#### Upper A - Hypertrophy (11 exercises)
- Primary pressing: Neutral-Grip DB Floor Press
- Rowing: Barbell Row
- Cable work: Press/Row supersets
- Shoulders: Lateral Raise/Reverse Fly supersets
- Arms: Myo-reps protocol
- Core: Pallof Press, Dead Bug, Side Plank

#### Lower A - Strength + Conditioning (7 exercises)
- Strength: Back Squat (5×4-6)
- Posterior: Romanian Deadlift
- Isolation: Leg Curl/Extension supersets
- Calves: Standing Calf Raise
- Core: Hanging Knee Raise
- Cardio: HIIT Bike Intervals

#### Upper B - Strength (10 exercises)
- Strength: Neutral-Grip DB Floor Press (5×4-6)
- Rowing: Barbell Row (5×4-6)
- Cable work: Incline Press, Pulldown
- Shoulders: DB Overhead Press, Face Pulls
- Arms: Hammer Curls, Close-Grip Pushdowns
- Core: Plank, Bird Dog

#### Lower B - Hypertrophy + Conditioning (7 exercises)
- Unilateral: Bulgarian Split Squat
- Posterior: Stiff-Leg Deadlift
- Superset: Walking Lunges/Nordic Curls
- Calves: Seated Calf Raise
- Core: Cable Woodchops
- Cardio: 20min Steady-State

### 6. Optional Workouts (Tue-Thu Add-ons)
- **Overview**: Supplemental, not required
- **Key Principles**: No progression tracking, lighter intensity

#### Optional Workout 1: Quick Upper Accessory (25 min)
- Face Pulls, Bicep Curls, Tricep Extensions, Pallof Press

#### Optional Workout 2: Zone 2 Cardio (30 min)
- Bike, treadmill walk, elliptical, rowing, swimming

#### Optional Workout 3: Core + Mobility (20 min)
- Mobility work (8 min)
- Core circuit (10 min)
- Cooldown (2 min)

#### Optional Workout 4: Upper Pump Session (30 min)
- Thursday home weeks only
- Cable pressing/rowing, lateral raises, arms

#### Optional Workout 5: Lower Body Accessories (25 min)
- Glute bridges, hamstring curls, calves, adductors/abductors

#### Scheduling Guidelines
- Office week recommendations
- Home week recommendations
- Priority ranking

#### Tracker Implementation Notes
- Separate category display
- No progression tracking
- Smart suggestions by day

### 7. Exercise Substitutions

#### Primary Movement Substitutions
- Pressing variations (if equipment unavailable)
- Rowing alternatives
- Cable press/row options
- Squatting variations
- Deadlift variations
- Overhead press alternatives
- Core exercise alternatives
- Cardio equipment alternatives

### 8. Bodyweight Substitutions

#### When to Use
- Travel, gym closures, deload weeks
- Limitations (2-3 week max)
- Best practices for mixed training

#### Quick Reference Table
- Complete gym → bodyweight mapping
- 30+ exercise substitutions
- Equipment requirements noted

#### Complete Bodyweight Programs
- Upper A Bodyweight (11 exercises)
- Lower A Bodyweight (7 exercises)
- Upper B Bodyweight (10 exercises)
- Lower B Bodyweight (7 exercises)

#### Minimal Equipment Options
- Essential items ($50-100)
- Effectiveness ratings

#### Progression Methods
1. Tempo manipulation
2. Range of motion
3. Leverage changes
4. Unilateral progressions
5. Volume increases
6. Explosive/plyometric

#### Exercise Progression Paths
- Push-ups (9 levels)
- Squats (8 levels)
- Pulls (8 levels)

#### Bodyweight Protocols
- Warm-up routines
- Intensity guidelines
- Volume adjustments
- Safety considerations

#### Sample Mixed Scheduling
- Combining gym and bodyweight training

#### Tracker Implementation
- Bodyweight mode toggle
- Auto-substitution
- Progression tracking adaptations

### 9. Equipment Requirements
- Essential equipment list
- Optional but recommended items
- Gym layout considerations

### 10. Scheduling Information

#### Standard Weekly Split
- Ideal schedule when flexible

#### Office Week Adaptation
- Week A (Tue-Thu in office)
- Week B (Home week)
- Adaptation strategies

#### Minimal Time Scheduling
- Workout prioritization
- Volume reduction strategies

#### Recovery Priority
- Back-to-back session guidelines
- Sleep and nutrition emphasis

### 11. Progression Methodology

#### Double Progression System
- How it works (step-by-step)
- Example progression cycle
- Weight increments (upper vs. lower)

#### Strength vs Hypertrophy Days
- Rest period differences
- Volume and intensity focus
- Why both matter

#### Superset Execution
- Rest period management
- Benefits of pairing
- Time efficiency

#### Myo-reps Protocol
- Structure (activation + mini-sets)
- Purpose and benefits
- Application to arms

#### Progression Plateaus
- Troubleshooting stuck progress
- When to deload
- Volume adjustments

### 12. Training Guidelines

#### Warm-up Protocol
- General warm-up (5 min)
- Dynamic stretching
- Exercise-specific warm-up sets

#### Form Cues by Exercise Category
- Floor Press
- Rows
- Squats
- Deadlift variations
- Core work

#### Deload Strategy
- Frequency (every 6-8 weeks)
- Volume vs. intensity reduction
- Signs you need a deload

#### Failure Management
- When to avoid failure
- When approaching failure is OK
- Safety priorities

#### Injury Prevention
- Red flags to stop immediately
- Costochondritis symptom management
- Return-to-training protocol

#### Testing Maxes
- Not required for this program
- If testing, when and how
- Safety considerations

### 13. Google Sheets Integration

#### Overview
- Cloud backup and sync purpose
- Cross-device access

#### API Configuration
- Client ID (provided)
- Sheet ID (provided)
- Required OAuth scopes
- Authentication flow (PKCE recommended)

#### Sheet Structure
- **Sheet 1: Workout Log** - Set-by-set data
- **Sheet 2: Exercise Library** - Program definitions
- **Sheet 3: Progression Tracking** - Auto-calculated status
- **Sheet 4: Workout History** - Session summaries

#### API Operations
- Reading data (exercise library, last workout, progression)
- Writing data (logging sets, updating progression, workout summaries)

#### Data Sync Strategy
- On app load behavior
- During workout sync
- On reconnection handling
- Conflict resolution

#### Error Handling
- Authentication errors
- Network errors
- Data validation
- Rate limiting

#### Security Considerations
- Token storage (sessionStorage for static sites)
- API key protection
- Data privacy
- No backend secrets

#### Performance Optimization
- Batch operations
- Caching strategies
- Lazy loading

#### Testing Considerations
- Mock mode for development
- Test sheet setup

#### Fallback Strategy
- localStorage-only mode
- CSV export backup
- Manual import path

### 14. GitHub Pages Deployment

#### Quick Setup Reference
- URLs configuration
- Google Cloud Console settings
- Repository settings

#### Overview
- Static site hosting benefits

#### Configuration
- Repository setup
- File structure
- Single-file vs. multi-file

#### Google Cloud Console Setup
- Authorized JavaScript origins
- Authorized redirect URIs
- HTTPS enforcement

#### Static Site Constraints
- No backend capabilities
- Public source code
- Storage limitations

#### Deployment Process
- Initial setup
- Update workflow
- Versioning

#### Custom Domain (Optional)
- DNS configuration
- GitHub Pages setup

#### HTTPS Enforcement
- Automatic certificate
- OAuth requirement

#### Mobile Access
- PWA considerations
- Bookmarking and home screen
- Standalone mode

#### Performance
- Loading speed
- API call handling
- CDN benefits

#### Testing Strategy
- Local development
- Pre-deployment checks
- Post-deployment verification

#### Troubleshooting
- OAuth errors
- Page loading issues
- Update visibility
- Sheets connection problems

#### Security for GitHub Pages
- Public repository considerations
- Sheet permissions
- XSS protection

#### Backup Strategy
- Version control
- Data ownership
- Export capabilities

#### Cost Analysis
- GitHub Pages: $0
- Google Sheets API: $0
- Total: $0

#### Scaling Considerations
- Per-user architecture
- No shared backend
- Unlimited users at no cost

### 15. Data Export Specifications

#### Export Format
- JSON/CSV structure
- Data fields included

#### Analysis Metrics
- Volume tracking
- Frequency analysis
- Personal records

#### Useful Calculations
- Volume formulas
- Relative intensity
- Volume load progression
- Time under tension

### 16. Critical Program Notes

#### First 2-4 Weeks
- Conservative weight selection
- Form mastery focus
- Baseline establishment

#### Chest Safety Reminders
- Stop criteria
- Neutral grip requirement
- Floor press safety
- Scapular retraction

#### Core Work Purpose
- Trunk stability rebuilding
- Injury prevention
- Anti-rotation focus

#### Conditioning Integration
- HIIT placement rationale
- Steady-state recovery benefits
- Extra cardio warnings

#### Program Duration
- Minimum 12 weeks
- Phase breakdown
- Long-term sustainability

### 17. Implementation Priorities

#### Phase 1 - Core Functionality (MVP)
- Workout selection
- Exercise tracking
- Rest timer
- localStorage persistence
- Previous session view

#### Phase 2 - Progression Support
- Double progression tracking
- Weight increase suggestions
- Volume calculations
- Google Sheets integration

#### Phase 3 - Enhanced UX
- Superset visual grouping
- Exercise notes display
- Form reminders
- Quick substitutions
- Custom rest periods

#### Phase 4 - Advanced Features
- Data export
- Performance analytics
- Deload planning
- Schedule suggestions
- Exercise videos

### 18. Google Sheets API Implementation Notes

#### Required Libraries
- Google API JavaScript Client
- Google Identity Services

#### Initialization Pattern
- Load sequence
- Auth setup
- Silent sign-in

#### Common API Calls
- Read range
- Append row
- Update range
- Batch update

#### Sample Data Flows
- Logging a set
- Loading previous performance
- Checking progression status

#### Sheet Formulas
- Progression tracking formulas
- Volume calculations

#### Mobile Considerations
- Sign-in button sizing
- OAuth flow fallbacks
- Offline detection

#### Development Workflow
- Google Cloud setup
- Local testing
- Production deployment

## Quick Navigation

**For Program Understanding:**
- Start with sections 3-5 (Philosophy, Structure, Workout Definitions)
- Review section 11 (Progression Methodology)
- Check section 12 (Training Guidelines)

**For Implementation:**
- Review section 13 (Google Sheets Integration)
- Study section 14 (GitHub Pages Deployment)
- Follow section 17 (Implementation Priorities)

**For Exercise Reference:**
- Section 7 (Exercise Substitutions)
- Section 8 (Bodyweight Substitutions)
- Section 6 (Optional Workouts)

**For User Documentation:**
- Section 10 (Scheduling Information)
- Section 11 (Progression Methodology)
- Section 16 (Critical Program Notes)

## Document Statistics

- **Total Sections:** 18 major sections
- **Workout Programs:** 4 main + 4 bodyweight + 5 optional = 13 total
- **Exercise Substitutions:** 30+ alternatives documented
- **Total Length:** 1775 lines
- **Comprehensive coverage:** Program design, implementation, deployment, and usage
