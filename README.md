# Workout Tracker

A comprehensive workout tracking application designed for a 4-day Upper/Lower split program with integrated conditioning and costochondritis-safe exercise selection.

## Features

- **4 Workout Programs:** Upper A/B and Lower A/B with varying intensity focuses
- **Progressive Tracking:** Double progression system (reps → weight)
- **Rest Timer:** Automatic countdown with different periods per exercise
- **Google Sheets Sync:** Cloud backup and cross-device access
- **Offline Support:** Works without internet via localStorage
- **Mobile Optimized:** Designed for use at the gym on your phone
- **History View:** Track progress over time with previous performance display
- **Superset Support:** Efficient workout structure with paired exercises

## Live Demo

Visit: <https://yourusername.github.io/workout-tracker/>

(Replace `yourusername` with your actual GitHub username)

## Quick Start

### For Users

1. Visit the live site
1. Click “Connect to Google Sheets”
1. Authorize with your Google account
1. Select your workout and start training!

Add to your phone’s home screen for app-like experience.

### For Developers

See <deployment-guide.md> for complete setup instructions.

**Quick setup:**

```bash
# Clone this repository
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker

# Open locally
python -m http.server 3000
# Visit http://localhost:3000
```

## Documentation

- **<workout-tracker-spec.md>** - Complete technical specification including:
  - Full workout program details
  - Exercise substitutions and safety guidelines
  - Google Sheets API integration specs
  - Data structure and progression methodology
- **<deployment-guide.md>** - Step-by-step deployment instructions:
  - GitHub Pages setup
  - Google Cloud Console configuration
  - Google Sheets structure
  - Troubleshooting guide

## Program Overview

### Workout Split

- **Upper A** - Hypertrophy focus (8-12 reps)
- **Lower A** - Strength + HIIT conditioning (4-6 reps + cardio)
- **Upper B** - Strength focus (4-6 reps)
- **Lower B** - Hypertrophy + steady-state cardio (10-12 reps + 20min cardio)

### Special Considerations

- Designed for **costochondritis safety** (no traditional bench press)
- Uses neutral-grip dumbbell floor press as primary chest exercise
- Scapular retraction emphasis throughout pressing movements
- Integrated conditioning on leg days only

### Progression System

**Double Progression:**

1. Hit top of rep range for ALL sets
1. Increase weight by 5-10 lbs
1. Drop back to bottom of rep range
1. Repeat

## Technology Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Hosting:** GitHub Pages (static site)
- **Storage:** Browser localStorage + Google Sheets API
- **Authentication:** Google OAuth 2.0 (PKCE flow)

## Configuration

Update these values in `index.html`:

```javascript
const CLIENT_ID = 'YOUR_GOOGLE_OAUTH_CLIENT_ID';
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
```

## Google Sheets Structure

Your sheet needs 4 tabs:

1. **Workout Log** - Raw set-by-set data
1. **Exercise Library** - Program definitions (editable)
1. **Progression Tracking** - Auto-calculated progression status
1. **Workout History** - Session summaries

See <workout-tracker-spec.md> for detailed schema.

## Privacy & Data

- All workout data stored in **your personal Google Sheet**
- No external servers or databases
- localStorage backup for offline access
- You own and control all your data
- Can export to CSV anytime

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS and macOS)
- Mobile browsers (iOS Safari, Chrome Android)

## Offline Functionality

- Works offline after first load
- Data queued for sync when reconnected
- localStorage ensures no data loss
- Full workout capability without internet

## Mobile Usage

**Add to Home Screen:**

- **iOS:** Safari > Share > Add to Home Screen
- **Android:** Chrome > Menu > Add to Home Screen

Opens in standalone mode like a native app.

## Contributing

This is a personal workout tracker, but suggestions welcome:

1. Fork the repository
1. Create feature branch
1. Make your changes
1. Test thoroughly
1. Submit pull request

## Cost

**$0** - Completely free to deploy and use

- GitHub Pages: Free
- Google Sheets API: Free tier (sufficient for personal use)
- No backend costs

## License

MIT License - feel free to use and modify for personal use.

## Support

For issues or questions:

1. Check <deployment-guide.md> troubleshooting section
1. Review browser console for errors (F12)
1. Verify Google Cloud Console configuration
1. Open an issue in this repository

## Acknowledgments

Program designed for:

- Progressive overload and muscle hypertrophy
- Cardiovascular health integration
- Safe training with costochondritis history
- Efficient workouts with supersets
- Sustainable long-term progression

-----

**Note:** Always consult with healthcare providers before starting any new exercise program, especially if you have pre-existing conditions like costochondritis.
