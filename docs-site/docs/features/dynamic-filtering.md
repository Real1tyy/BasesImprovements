---
sidebar_position: 2
---

# Dynamic Filtering

Filter base query results by file name without manually editing queries.

## How It Works

A search input appears above each base block. Type to filter:

````markdown
```base
FROM notes
SELECT title, date
```
````

Type "project" → becomes:

````markdown
```base
FROM notes
WHERE file.name.contains("project")
SELECT title, date
```
````

## Smart Filter Injection

**No WHERE clause:**
```
FROM notes → WHERE file.name.contains("search")
```

**Existing WHERE clause:**
```
WHERE date > "2024-01-01" → WHERE date > "2024-01-01" AND file.name.contains("search")
```

**Clear input:** Filter is automatically removed

## Keyboard Shortcuts

**Focus Filter Input:**
1. Settings → Hotkeys → "Focus filter input"
2. Assign a shortcut (e.g., `Ctrl+Shift+F`)
3. Press to focus/cycle through inputs

**Single input:** Always focuses same input
**Multiple inputs:** Cycles through in order (0 → 1 → 2 → 0...)

## Debouncing

**Input Debounce (default: 150ms):** Waits after typing before applying filter

- Lower (0-100ms): More responsive
- Medium (100-300ms): Balanced (recommended)
- Higher (300-2000ms): Better for slow systems

**Tip:** Press **Enter** to bypass debounce

## Configuration

Settings → Bases Improvements:

- **Code Fence Language**: Target language (default: `base`)
- **Input Debounce**: Typing delay (default: 150ms)
- **Update Debounce**: Component update delay (default: 150ms)
- **Show Filter Input**: Toggle on/off globally
- **Target Embeds**: Enable for `.base` file embeds

## Troubleshooting

**Input not appearing:**
- Check plugin is enabled
- Verify code fence language setting
- Check "Show Filter Input" is enabled

**Filter not applying:**
- Wait for debounce delay (150ms)
- Press Enter to apply immediately
- Check console for errors (Ctrl/Cmd + Shift + I)

**Performance issues:**
- Increase debounce values
- Disable embed support if not needed
