---
sidebar_position: 4
---

# Configuration

Settings → Community plugins → Bases Improvements

## Target Settings

### Code Fence Language
**Default:** `base`

Specify which code fence language to target.

**Example:** Change to `bases` or `dataview` if needed.

### Target Embeds
**Default:** Enabled

Enable/disable filter inputs for embedded `.base` files.

### Show Filter Input
**Default:** Enabled

Globally toggle search inputs on/off.

## Performance Settings

### Input Debounce
**Default:** 150ms
**Range:** 0-2000ms

Delay after typing before applying filter.

| System | Recommended |
|--------|-------------|
| Fast | 100-150ms |
| Average | 150-300ms |
| Slow/Large vault | 300-500ms |

**Tip:** Press Enter to bypass debounce

### Update Debounce
**Default:** 150ms
**Range:** 0-2000ms

Delay after editor changes before updating components.

## Keyboard Shortcuts

Settings → Hotkeys → "Focus filter input"

Assign a shortcut to focus and cycle through filter inputs.

**Recommended shortcuts:**
- `Ctrl+Shift+F` (Windows/Linux)
- `Cmd+Shift+F` (macOS)

## Settings Summary

| Setting | Default | Purpose |
|---------|---------|---------|
| Code Fence Language | `base` | Language to target |
| Target Embeds | Enabled | Filter `.base` embeds |
| Show Filter Input | Enabled | Toggle inputs globally |
| Input Debounce | 150ms | Typing delay |
| Update Debounce | 150ms | Component update delay |

## Configuration Scenarios

**Maximum Performance:**
- Target Embeds: Disabled
- Input Debounce: 500ms
- Update Debounce: 500ms

**Maximum Responsiveness:**
- Target Embeds: Enabled
- Input Debounce: 100ms
- Update Debounce: 100ms

**Inline Blocks Only:**
- Target Embeds: Disabled
- Other settings: Default

## Advanced

**Settings file:** `.obsidian/plugins/bases-improvements/data.json`

**Reset to defaults:** Delete `data.json` and reload plugin

**Settings schema:**
```json
{
  "codeFenceLanguage": "base",
  "targetEmbeds": true,
  "showFilterInput": true,
  "inputDebounceMs": 150,
  "updateDebounceMs": 150
}
```
