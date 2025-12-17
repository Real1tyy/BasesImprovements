---
sidebar_position: 3
---

# Quick Start

## Prerequisites

- Obsidian 1.4.16+
- Bases plugin installed and enabled
- Bases Improvements plugin installed and enabled

## Basic Usage

### 1. Create a Base Block

````markdown
```base
FROM notes
SELECT title, date
ORDER BY date DESC
```
````

### 2. Use the Search Input

A search input appears above the block. Type to filter:

````markdown
```base
FROM notes
WHERE file.name.contains("meeting")
SELECT title, date
ORDER BY date DESC
```
````

### 3. Clear the Filter

Clear the input to remove the filter.

## With Existing WHERE Clauses

**Before:**
````markdown
```base
FROM notes
WHERE date > "2024-01-01"
SELECT title
```
````

**After typing "project":**
````markdown
```base
FROM notes
WHERE date > "2024-01-01" AND file.name.contains("project")
SELECT title
```
````

## Embedded Base Files

**Create:** `my-query.base`
```
FROM notes
SELECT title, date
```

**Embed:** `![[my-query.base]]`

A search input appears above the embed.

**Note:** Enable "Target Embeds" in settings (default: enabled)

## Configuration

Settings → Bases Improvements:

- **Code Fence Language**: Default `base`
- **Target Embeds**: Default enabled
- **Show Filter Input**: Default enabled
- **Input Debounce**: Default 150ms

[Full Configuration Guide →](/configuration)

## Keyboard Shortcuts

**Setup:**
1. Settings → Hotkeys
2. Search "Focus filter input"
3. Assign shortcut (e.g., `Ctrl+Shift+F`)

**Use:** Press hotkey to focus/cycle through inputs

## Tips

**Adjust Debounce:** Increase for better performance on large vaults

**Press Enter:** Apply filter immediately (bypasses debounce)

**Combine Filters:** Name filter works with other WHERE conditions

**Case Insensitive:** `file.name.contains()` is case-insensitive

## Troubleshooting

**Input not appearing:**
- Check plugin is enabled
- Verify code fence language (` ```base `)
- Check "Show Filter Input" setting

**Filter not updating:**
- Wait for debounce (150ms)
- Press Enter to apply immediately
- Check console (Ctrl/Cmd + Shift + I)

**Embeds not working:**
- Enable "Target Embeds" in settings
- Verify `.base` file extension
- Reload note

[Full Troubleshooting Guide →](/troubleshooting)

## Next Steps

- [Features Overview](/features/overview)
- [Dynamic Filtering](/features/dynamic-filtering)
- [Configuration](/configuration)
