# Muzik2Go Android (preview companion shell)

WebView shell around the production web app. Requires internet.
On-device recording arrives with the future native build.

## Build (needs Expo account + `eas login` approval)

```
cd mobile
pnpm add expo react-native-webview
pnpm add -D eas-cli
eas login
eas build -p android --profile preview
```

Download the APK from the EAS build page into `dist-android/`,
then verify: signature, package `com.muzik2go.app`, launcher activity,
versionCode 1, minSdk, SHA-256.

## Limitations (preview)
- Internet required (loads https://web-one-xi-90.vercel.app)
- No offline mode yet; no background audio
- Preview-signed by EAS (not a store release key)
