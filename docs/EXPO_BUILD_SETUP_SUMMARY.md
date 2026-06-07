# Expo Preview Build Setup — Complete Summary

**Status:** ✅ Configuration files created and ready for initialization

## What Was Created

### 1. `eas.json` — EAS Build Configuration
- **Three profiles:**
  - `dev`: Local development builds (no credentials needed)
  - `preview`: APK + IPA for testing/distribution (EAS-managed certs)
  - `production`: Future Play Store (AAB) + App Store releases
- **Android:** EAS-managed keystore (auto-generated, no local files)
- **iOS:** EAS-managed certificates + Ad-Hoc provisioning profile
- **TestFlight:** Configured for iOS distribution

### 2. Updated `app.json`
- Added `"runtimeVersion": "1.0.0"` (for future OTA updates)
- Added `"extra": { "eas": { "projectId": "will-be-set-by-eas-init" } }`
- Placeholder projectId will be replaced when you run `eas init`

### 3. Updated `package.json`
Added build convenience scripts:
- `pnpm run build:preview:android` — Build Android APK
- `pnpm run build:preview:ios` — Build iOS IPA
- `pnpm run build:preview` — Build both platforms
- `pnpm run build:dev:android` / `build:dev:ios` — Local testing builds

### 4. GitHub Actions Workflows — Manual Build Triggers
- **Android Workflow:** `.github/workflows/eas-build-preview.yml`
  - **Trigger:** Manual via GitHub Actions UI (`workflow_dispatch`)
  - **Output:** Android APK artifact
- **iOS Workflow:** `.github/workflows/eas-build-preview-ios.yml`
  - **Trigger:** Manual via GitHub Actions UI (`workflow_dispatch`)
  - **Output:** iOS IPA artifact
- **Each workflow:**
  1. Checkout code
  2. Setup Node 18 + pnpm 9
  3. Run full verify (typecheck + lint + tests)
  4. Build platform (APK or IPA)
  5. Upload artifact for download
- **Secrets:** Uses `EXPO_TOKEN` from GitHub Secrets

### 5. `docs/BUILD_PREVIEW.md` — Reference Guide
- Quick start commands
- Full setup walkthrough
- Local build instructions
- Distribution workflows for Android & iOS
- Troubleshooting reference
- GitHub Actions customization examples

## Next Steps (In Order)

### Phase 1: Local EAS Initialization (15 min)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Verify eas.json is in project root
ls eas.json

# 3. Initialize EAS project
eas init
# → Log in with Expo account (expo.dev)
# → Select "Create a new Expo project"
# → Confirm app name: "Manforge" and slug: "retain"
# → EAS auto-updates app.json with projectId
```

✅ **After this:** `app.json` will have your unique `projectId` (needed for all EAS commands)

### Phase 2: Configure Credentials (10-15 min per platform)

#### Android (EAS-Managed Keystore)
```bash
eas credentials
# → Select "Android"
# → Choose "Managed credentials"
# → Confirm (EAS auto-generates keystore on first build)
```

✅ **After this:** Android keystore securely stored in EAS Secrets (no local files)

#### iOS (EAS-Managed Certs + Provisioning Profiles)
```bash
eas credentials
# → Select "iOS"
# → Choose "Managed credentials"
# → Enter Apple ID (your Apple Developer email)
# → Enter Team ID (you have this ready)
# → Confirm 2FA when prompted
# → If blocked by 2FA: Generate app-specific password at appleid.apple.com → Security
```

✅ **After this:** iOS distribution certificate + Ad-Hoc provisioning profile stored securely

### Phase 3: iOS Developer Portal Checklist (5-10 min)

1. **Register Bundle ID** at developer.apple.com:
   - Certificates, Identifiers & Profiles → Identifiers → Register New
   - Bundle ID: `com.venkatramanks.retain`
   - Enable required capabilities (Push Notifications, etc.)

2. **Verify Team ID** matches what you gave EAS

3. **Prepare TestFlight** at appstoreconnect.apple.com:
   - Create app: "Manforge"
   - Bundle ID: `com.venkatramanks.retain`
   - (TestFlight is auto-configured to receive IPA builds)

✅ **After this:** iOS platform ready for preview builds

### Phase 4: Test Local Builds (20-30 min, runs in EAS cloud)

```bash
# Verify configuration
eas build --platform android --profile preview --dry-run
eas build --platform ios --profile preview --dry-run

# Build Android APK
pnpm run build:preview:android
# → Watch progress at expo.dev dashboard
# → Download APK when ready (~10 min typical)
# → Test: adb install -r retain.apk

# Build iOS IPA
pnpm run build:preview:ios
# → Download IPA when ready (~15 min typical)
# → Test via TestFlight or Xcode on device
```

✅ **After this:** Both platforms building successfully

### Phase 5: GitHub Actions Setup (10 min)

1. **Create Expo Personal Access Token:**
   - Go to expo.dev → Account Settings → Access Tokens
   - Create "Personal Access Token" (full permissions)
   - Copy token

2. **Add GitHub Secret:**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Create secret: `EXPO_TOKEN` = (paste token)

3. **Verify Workflow Files:**
   - Android: `.github/workflows/eas-build-preview.yml`
   - iOS: `.github/workflows/eas-build-preview-ios.yml`
   - Both committed to repo

4. **Trigger Manual Builds:**
   ```
   Go to GitHub repo → Actions tab
   → Select "EAS Build Preview Android" or "EAS Build Preview iOS"
   → Click "Run workflow" button
   → Watch progress, download artifact when ready
   ```

✅ **After this:** Manual build triggers available in GitHub Actions

### Phase 6: iOS TestFlight Distribution (Automatic)

iOS builds are **automatically submitted to TestFlight** in the workflow:

1. Build completes (~15 min)
2. Workflow auto-submits to TestFlight (~5 min)
3. Apple processes build (~1 hour) → appears in TestFlight
4. Go to App Store Connect → TestFlight → Builds
5. Add internal/external testers
6. Send TestFlight invite links via email
7. Testers install via TestFlight app (no developer mode needed)

✅ **After this:** iOS builds in TestFlight ready for testing

## From Expo Portal Perspective

### What to Do in Expo Dashboard (expo.dev)

1. **Initialize Project** (done via `eas init` in Phase 1)
   - Creates project record
   - Generates unique projectId

2. **Link GitHub Repository** (optional but recommended)
   - Project Settings → GitHub
   - Connect GitHub account
   - Select retain repo
   - Enables build status checks on PRs

3. **Monitor Builds**
   - View build history
   - Check logs
   - Download artifacts
   - Manage credentials via EAS Secrets (automatic)

4. **Create Personal Access Token** (Phase 5)
   - Account Settings → Access Tokens
   - Used by GitHub Actions

### What You DON'T Need to Do
- ❌ Manually upload certificates (EAS manages)
- ❌ Create provisioning profiles (EAS manages)
- ❌ Store secrets in repo (EAS Secrets handles it)
- ❌ Configure billing (Expo free tier covers preview builds)

## From iOS Developer Portal Perspective

### What You MUST Do (developer.apple.com)

1. **Register Bundle ID** (required before EAS can build)
   - Identifiers → Create new
   - Type: App IDs
   - Bundle ID: `com.venkatramanks.retain`
   - Register

2. **Create App in App Store Connect** (required for TestFlight)
   - Apps → Create app
   - Name: "Manforge"
   - Bundle ID: `com.venkatramanks.retain`
   - SKU: (any unique ID)

### What EAS Handles Automatically
- ✅ Fetching/creating distribution certificate
- ✅ Creating Ad-Hoc provisioning profile
- ✅ Managing certificate renewals
- ✅ Uploading IPA to TestFlight

### What You DON'T Need to Do
- ❌ Manually create certificates in Developer Portal (EAS does it)
- ❌ Manage provisioning profiles (EAS does it)
- ❌ Configure App Store metadata (future when submitting to App Store)

## From Android / Google Play Perspective

### Current Setup (Preview Only)
- ✅ EAS-managed keystore (no Play Store needed yet)
- ✅ APK builds work without Play Store account
- ✅ Direct APK distribution to testers

### When Ready for Play Store (Future)
You'll need:
1. Google Play Developer account ($25 one-time fee)
2. Upload keystore (generate and provide to EAS)
3. Google Play Console setup

For now, skip Google Play setup — preview APKs work without it.

## File Structure After Setup

```
retain/
├── eas.json                           ← NEW: Build profiles
├── .github/
│   └── workflows/
│       └── eas-build-preview.yml      ← NEW: GitHub Actions CI/CD
├── docs/
│   ├── BUILD_PREVIEW.md               ← NEW: Reference guide
│   ├── EXPO_BUILD_SETUP_SUMMARY.md    ← NEW: This file
│   ├── ARCHITECTURE.md
│   ├── OFFLINE_FIRST.md
│   └── ...
├── app.json                           ← MODIFIED: Added runtimeVersion + extra.eas
├── package.json                       ← MODIFIED: Added build scripts
├── babel.config.js
├── tsconfig.json
├── ...
```

## Build Artifact Locations

- **Android APK:** Downloaded from EAS build link or GitHub Actions artifacts
- **iOS IPA:** Downloaded from EAS build link or GitHub Actions artifacts
- **No local build artifacts** — all builds run on EAS cloud servers

## Secrets Management

### Stored in EAS Secrets (Encrypted, Not in Repo)
- iOS distribution certificate
- iOS provisioning profile
- Android keystore

### Stored in GitHub Secrets (Not in Repo)
- `EXPO_TOKEN` — Used by GitHub Actions to authenticate with EAS

### Never in Repo or Environment
- Apple ID password (use app-specific password)
- Private keys
- Keystores or certificates

All secrets are encrypted at rest and accessible only by authenticated processes.

## Verification Checklist

After completing all phases:

- [ ] `eas init` completed; projectId in app.json
- [ ] `eas credentials` set up both platforms
- [ ] iOS Bundle ID registered at developer.apple.com
- [ ] iOS app created in App Store Connect
- [ ] `eas build --platform android --profile preview --dry-run` succeeds
- [ ] `eas build --platform ios --profile preview --dry-run` succeeds
- [ ] `pnpm run build:preview:android` downloads working APK
- [ ] `pnpm run build:preview:ios` downloads working IPA
- [ ] `EXPO_TOKEN` secret created in GitHub
- [ ] Workflow file `.github/workflows/eas-build-preview.yml` in repo
- [ ] Push to main triggers GitHub Actions build
- [ ] APK/IPA artifacts upload to GitHub Actions
- [ ] iOS TestFlight build appears in App Store Connect (if auto-submit enabled)

## Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Install EAS + `eas init` | 5 min |
| 1 | Update app.json projectId | Auto |
| 2 | Android credentials | 5 min |
| 2 | iOS credentials + 2FA | 10 min |
| 3 | iOS Developer Portal setup | 10 min |
| 4 | Test Android APK build | 10 min |
| 4 | Test iOS IPA build | 15 min |
| 5 | Create Expo token + GitHub secret | 5 min |
| 5 | Verify CI/CD workflow | 5 min |
| **Total** | | **65 min** |

**Most time spent waiting for builds to compile on EAS servers, not local setup.**

## Troubleshooting Quick Links

See `docs/BUILD_PREVIEW.md` → Troubleshooting section for:
- Build fails with auth error
- EXPO_TOKEN invalid
- iOS build hangs on Apple ID
- Android APK won't install
- TestFlight shows "Missing Compliance"
- And more...

## Support Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Expo CLI Reference](https://docs.expo.dev/more/expo-cli/)
- [Expo Community Slack](https://chat.expo.dev/)

## Next Session

Start with **Phase 1** in the "Next Steps" section above. Follow each phase in order. Each phase unlocks the next.

**Do NOT skip phases** — each one builds on the previous setup.
