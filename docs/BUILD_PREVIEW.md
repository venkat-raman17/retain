# Preview Build Setup & Distribution Guide

This guide covers building and distributing preview builds of Retain for Android and iOS via EAS Build.

## Quick Start

### Local Android APK Build
```bash
pnpm run build:preview:android
```
- Builds APK via EAS cloud (no local compilation needed)
- Download link appears in terminal
- Install on Android device: `adb install -r retain.apk`

### Local iOS IPA Build
```bash
pnpm run build:preview:ios
```
- Builds IPA via EAS cloud
- Download link appears in terminal
- Install on iOS device via TestFlight or Xcode

### Build Both Platforms
```bash
pnpm run build:preview
```
- Kicks off Android and iOS builds in parallel
- Both complete independently

## Setup Process

### Initial Setup (One-Time)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   # or: pnpm add -D eas-cli
   ```

2. **Initialize EAS:**
   ```bash
   eas init
   ```
   - Log in with Expo account (create at expo.dev if needed)
   - Confirm project name and slug
   - EAS creates projectId and updates app.json

3. **Configure Credentials:**
   ```bash
   eas credentials
   ```
   - Select platform (Android or iOS)
   - Choose "Managed credentials" (EAS handles everything)
   - For iOS: Provide Apple ID and Team ID (2FA required)
   - For Android: EAS auto-generates keystore

### Expo Portal (expo.dev)

1. **Link GitHub Repository:**
   - Go to project dashboard → Settings → GitHub
   - Connect GitHub account
   - Select your retain repo
   - Authorize Expo to receive push notifications

2. **Create Personal Access Token:**
   - Go to Account Settings → Access Tokens
   - Create new Personal Access Token
   - Copy token

### GitHub Secrets (GitHub Repository)

1. **Add EXPO_TOKEN Secret:**
   - Go to repo Settings → Secrets and variables → Actions
   - Create secret: `EXPO_TOKEN` = (paste token from Expo Portal)
   - Used by GitHub Actions workflow to authenticate with EAS

### iOS Developer Portal (developer.apple.com)

1. **Register Bundle ID:**
   - Certificates, Identifiers & Profiles → Identifiers
   - Create Identifier: `com.venkatramanks.retain`
   - Enable required capabilities (Push Notifications, etc.)

2. **App Store Connect (appstoreconnect.apple.com):**
   - Create new app: "Retain"
   - Set bundle ID: `com.venkatramanks.retain`
   - TestFlight will receive IPA builds from EAS

## Building for Distribution

### Android Preview (Direct APK)

**Local build:**
```bash
pnpm run build:preview:android
```

**In GitHub Actions:**
- Push to main automatically triggers build
- APK available in Actions artifacts tab
- Share download link with testers

**Distribution:**
- Direct APK link from EAS dashboard
- Share via email or file hosting
- Testers install with `adb install`

### iOS Preview (TestFlight)

**Local build:**
```bash
pnpm run build:preview:ios
```

**Auto-submit to TestFlight (optional):**
```bash
eas submit --platform ios --latest
```

**In GitHub Actions:**
- Push to main automatically triggers build
- Manually submit from Actions workflow (future enhancement)
- Or configure auto-submit in eas.json

**Distribution:**
- TestFlight link in App Store Connect
- Send to testers via email
- Testers install via TestFlight app on iOS device

## Monitoring Builds

### Via Terminal
```bash
eas build --status              # View recent builds
eas build --latest              # Download latest build
```

### Via Expo Portal
- Go to expo.dev → Project Dashboard
- View build history
- Download build artifacts
- Monitor build logs

### Via GitHub Actions
- Go to GitHub repo → Actions tab
- View workflow runs
- Check build status and logs
- Download artifacts

## Versioning

### Android versionCode
- Increments per build (prevent overlapping APK versions)
- Configured in `app.json` → `android.versionCode`
- Or auto-increment in CI (future setup)

### iOS Build Number
- Set in EAS build process
- Or managed via App Store Connect
- Increments per TestFlight build

### App Version
- Same across all builds: `app.json` → `version: "1.0.0"`
- Increment when releasing new feature versions

## Troubleshooting

### Build Fails with Auth Error
```
Error: Credentials not found
```
**Solution:** Run `eas credentials` to set up or regenerate credentials

### EXPO_TOKEN Invalid
```
Error: Unauthorized (401)
```
**Solution:** Regenerate token at expo.dev → Account Settings → Access Tokens; update GitHub Secrets

### iOS Build Hangs on Apple ID
```
? How would you like to handle signing certificates?
(appears to hang)
```
**Solution:** 
- Generate app-specific password at appleid.apple.com → Security
- Use that password when prompted (not your main Apple ID password)
- Or cancel (Ctrl+C) and try again with `eas credentials`

### Android APK Won't Install
```
Error: INSTALL_FAILED_INVALID_APK
```
**Solution:** Check Android SDK version compatibility (min API 24 for Expo 56)

### TestFlight Shows "Missing Compliance"
**Solution:** Go to App Store Connect → TestFlight → Builds → Select build → Check "Exempt from ITAR" or specify compliance

## GitHub Actions CI/CD

### Workflow Files
- **Android:** `.github/workflows/eas-build-preview.yml`
- **iOS:** `.github/workflows/eas-build-preview-ios.yml`

**Trigger:** Manual only (`workflow_dispatch`)

### Running Builds via GitHub Actions

1. Go to your repo → Actions tab
2. Select workflow:
   - "EAS Build Preview Android" — builds APK
   - "EAS Build Preview iOS" — builds IPA
3. Click "Run workflow" button
4. Wait for build to complete (10-20 minutes typical)
5. Download artifact from build summary

### Each Workflow Steps
1. Checkout code
2. Setup Node 18 + pnpm 9
3. Install dependencies
4. Run `pnpm run verify` (typecheck + lint + tests)
5. Build platform-specific artifact (APK or IPA)
6. Upload artifact

**Access Results:**
- Go to Actions tab → Select workflow run
- View build logs in real-time
- Download artifact (APK or IPA) from summary

### Customizing Triggers

To change from manual to automatic:

**Push to main:**
```yaml
on:
  push:
    branches:
      - main
```

**Release tags only:**
```yaml
on:
  push:
    tags:
      - 'v*'
```

**Pull requests:**
```yaml
on:
  pull_request:
    branches:
      - main
```

## Next Steps

### Future Enhancements
- [ ] Auto-increment version codes in CI
- [ ] Auto-submit iOS builds to TestFlight
- [ ] Play Store setup (AAB builds)
- [ ] OTA updates (expo-updates)
- [ ] Automated release notes generation
- [ ] Slack notifications on build completion

### Play Store Setup (When Ready)
1. Create Google Play Developer account
2. Generate upload keystore (or use existing)
3. Configure in eas.json → `submit.production.android`
4. Set up Google Play Console for app listing
5. First upload requires manual review; subsequent builds auto-submit

### OTA Updates (When Ready)
1. Enable expo-updates in project
2. Configure update strategy in eas.json
3. Push JS changes without rebuilding native
4. Controlled rollout to users

## References

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo CLI Reference](https://docs.expo.dev/more/expo-cli/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)
- [Apple Developer Portal](https://developer.apple.com/account/)
