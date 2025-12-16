# Workout Tracker - Quick Start Deployment Guide

## Prerequisites

- GitHub account
- Google account
- Basic familiarity with Git

## Step 1: GitHub Repository Setup (5 minutes)

1. **Create new repository:**
- Go to github.com
- Click “New repository”
- Name it `workout-tracker`
- Choose Public or Private
- Initialize with README
- Create repository
1. **Enable GitHub Pages:**
- Go to repository Settings > Pages
- Source: Deploy from branch `main`
- Folder: `/ (root)`
- Click Save
- Note your URL: `https://yourusername.github.io/workout-tracker/`
1. **Upload your code:**
- Create `index.html` file
- Commit and push to main branch
- Wait 1-2 minutes for deployment
- Visit your GitHub Pages URL to verify

## Step 2: Google Cloud Console Setup (10 minutes)

1. **Create Google Cloud Project:**
- Go to console.cloud.google.com
- Click “Create Project”
- Name it “Workout Tracker”
- Click Create
1. **Enable Google Sheets API:**
- In the left menu: APIs & Services > Library
- Search for “Google Sheets API”
- Click Enable
1. **Create OAuth 2.0 Credentials:**
- APIs & Services > Credentials
- Click “Create Credentials” > “OAuth client ID”
- Configure consent screen first (if prompted):
  - User Type: External
  - App name: “Workout Tracker”
  - User support email: your email
  - Developer contact: your email
  - Save and Continue through scopes/test users
- Application type: Web application
- Name: “Workout Tracker Web Client”
1. **Add Authorized Origins:**
   
   ```
   http://localhost:3000
   https://yourusername.github.io
   ```
   
   (Replace `yourusername` with your actual GitHub username)
1. **Add Authorized Redirect URIs:**
   
   ```
   http://localhost:3000
   https://yourusername.github.io/workout-tracker/
   ```
1. **Save and copy Client ID:**
- Example: `684177592462-7slnqfr7b3ng1k07daellkoar7no3n0n.apps.googleusercontent.com`
- You’ll need this in your code

## Step 3: Google Sheets Setup (5 minutes)

1. **Create or Open Google Sheet:**
- Option A: Use existing sheet (ID: `115OSeN_PePPBGH_bSbaDOJj_vypCRb5yjiGXzbIFLo0`)
- Option B: Create new sheet at sheets.google.com
- Copy the Sheet ID from the URL:
  `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
1. **Create 4 Sheets (tabs):**
- Sheet 1: “Workout Log”
- Sheet 2: “Exercise Library”
- Sheet 3: “Progression Tracking”
- Sheet 4: “Workout History”
1. **Set up headers in “Workout Log”:**
- Row 1: Date | Workout Type | Exercise Name | Set Number | Reps | Weight | Rest Time | Notes
1. **Set up headers in “Exercise Library”:**
- Row 1: Exercise Name | Workout Type | Target Sets | Target Rep Range | Default Rest | Category | Superset Partner | Notes
1. **Set up headers in “Progression Tracking”:**
- Row 1: Exercise Name | Current Weight | Last Weight Increase Date | Sets at Top Range | Total Sets | Ready to Progress | Suggested Next Weight
1. **Set up headers in “Workout History”:**
- Row 1: Date | Workout Type | Total Volume | Duration | Exercises Completed | Notes
1. **Share the sheet:**
- Click “Share” button
- Change to “Anyone with the link can edit”
- Or: Share with your specific Google account
- Copy the Sheet ID for your code

## Step 4: Update Your Code (2 minutes)

In your `index.html` file, update these values:

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const SHEET_ID = 'YOUR_SHEET_ID_HERE';
```

Replace with:

- Your OAuth Client ID from Step 2
- Your Google Sheet ID from Step 3

## Step 5: Deploy & Test (5 minutes)

1. **Commit and push changes:**
   
   ```bash
   git add index.html
   git commit -m "Add workout tracker with Google Sheets integration"
   git push origin main
   ```
1. **Wait for deployment:**
- Check Actions tab in GitHub for deployment status
- Usually takes 1-2 minutes
1. **Test on GitHub Pages:**
- Visit `https://yourusername.github.io/workout-tracker/`
- Click “Connect to Google Sheets”
- Sign in with Google account
- Grant permissions
- Verify data loads
1. **Test locally (optional):**
   
   ```bash
   # Navigate to your project folder
   python -m http.server 3000
   # OR
   npx serve -p 3000
   ```
- Visit `http://localhost:3000`
- Test all features

## Step 6: Mobile Setup (2 minutes)

1. **Open on mobile device:**
- Visit your GitHub Pages URL on phone
- Log in to Google account in mobile browser
1. **Add to home screen:**
- **iOS (Safari):** Tap Share icon > Add to Home Screen
- **Android (Chrome):** Menu > Add to Home Screen
- Icon appears like native app
1. **Test at gym:**
- Open app from home screen
- Verify it works offline (after initial load)
- Log a test workout

## Troubleshooting

### “redirect_uri_mismatch” error

- Double-check authorized redirect URIs in Google Cloud Console
- Ensure URL exactly matches (including trailing slash)
- Try both with and without trailing slash

### “origin_mismatch” error

- Add your GitHub Pages domain to authorized JavaScript origins
- Don’t include path, just domain: `https://yourusername.github.io`

### Page not loading on GitHub Pages

- Check Settings > Pages to verify it’s enabled
- Ensure index.html is in root directory
- Check Actions tab for deployment errors
- Hard refresh browser (Ctrl+F5)

### Google Sheets not connecting

- Verify Sheet ID is correct
- Check sheet sharing permissions
- Ensure Google Sheets API is enabled
- Check browser console for error messages

### Changes not showing

- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check GitHub Actions for deployment status

## Next Steps

1. **Populate Exercise Library:**
- Add all exercises from specification to “Exercise Library” sheet
- Include proper sets, reps, rest times
1. **Add progression formulas:**
- Add formulas to “Progression Tracking” sheet (see spec)
- Test automatic calculations
1. **Start logging workouts:**
- Complete your first workout
- Verify data appears in Google Sheets
- Check progression tracking works
1. **Customize as needed:**
- Adjust rest times
- Modify exercises
- Update workout split based on schedule

## Maintenance

### Regular Tasks

- Monitor Google Cloud quota usage (free tier is generous)
- Backup Google Sheet periodically (File > Download)
- Update authorized origins if changing domains
- Review workout data monthly for progress

### Updates

- Pull latest code from repository
- Test locally before deploying
- Commit and push to update GitHub Pages
- Clear browser cache after updates

## Cost Summary

- GitHub Pages: **FREE**
- Google Sheets API: **FREE** (within quota)
- Domain (optional): ~$10-15/year
- **Total: $0** for basic usage

## Support

If issues persist:

1. Check browser console for errors (F12)
1. Verify all URLs match exactly
1. Test in incognito mode (rules out extensions)
1. Try different browser
1. Review Google Cloud Console logs
