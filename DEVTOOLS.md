# Chrome DevTools Configuration

This document explains how Chrome DevTools are configured in the tymtLauncher application.

## Configuration

### 1. Runtime DevTools Opening

DevTools are automatically opened in the following scenarios:

#### Debug Builds
DevTools automatically open when running in debug mode:
```bash
yarn tauri dev
```

#### Production/Staging Builds
DevTools can be enabled in production builds by setting the `ENABLE_DEVTOOLS` environment variable:

```bash
# For local testing
ENABLE_DEVTOOLS=true yarn tauri build

# On macOS/Linux
export ENABLE_DEVTOOLS=true
yarn tauri build

# On Windows
set ENABLE_DEVTOOLS=true
yarn tauri build
```

### 3. CI/CD Configuration

The GitHub Actions workflow automatically enables DevTools for staging builds:
- **Production branch (`prod`)**: DevTools are disabled
- **Staging branch (`staging`)**: DevTools are enabled

This is controlled by the environment variable in `.github/workflows/release.yml`:
```yaml
ENABLE_DEVTOOLS: ${{ github.ref_name == 'staging' && 'true' || 'false' }}
```

## Manual DevTools Access

Even when DevTools don't automatically open, users can still access them manually:
- **Windows/Linux**: Right-click on the app window and select "Inspect Element" (if context menu is enabled)
- **macOS**: Right-click on the app window and select "Inspect Element" (if context menu is enabled)
- **Keyboard Shortcut**: `Cmd+Option+I` (macOS) or `Ctrl+Shift+I` (Windows/Linux)

## Security Considerations

- DevTools should never be enabled in production releases for end users
- The current setup ensures DevTools are only available in:
  - Development builds
  - Staging builds for testing
  - Production builds when explicitly enabled via environment variable

## Troubleshooting

If DevTools are not appearing when expected:
1. Verify the `devtools` property is set to `true` in `tauri.conf.json`
2. Check that the environment variable `ENABLE_DEVTOOLS` is properly set
3. Ensure you're building with the correct configuration
4. Try manually opening DevTools using keyboard shortcuts