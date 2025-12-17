---
sidebar_position: 1
---

# Features

## 🔍 Dynamic Filtering

Search inputs automatically appear above base code blocks. Type to filter by file name in real-time.

**Example:**

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

### Smart Filter Injection

**No WHERE clause:**
```
FROM notes → WHERE file.name.contains("search")
```

**Existing WHERE clause:**
```
WHERE date > "2024-01-01" → WHERE date > "2024-01-01" AND file.name.contains("search")
```

**Clear input:** Filter removed automatically

## 📎 Embed Support

Works with embedded `.base` files:

**Create:** `my-query.base`
```
FROM notes
WHERE tags.contains("project")
SELECT title, status
```

**Embed:** `![[my-query.base]]`

Search input appears above the embed. **Note:** Filtering modifies the actual `.base` file.

**Use Cases:**
- Reusable queries across multiple notes
- Shared dashboard queries
- Template queries

**Toggle:** Settings → Target Embeds (default: enabled)

## ⌨️ Keyboard Shortcuts

**Focus Filter Input:**
1. Settings → Hotkeys → "Focus filter input"
2. Assign shortcut (e.g., `Ctrl+Shift+F`)
3. Press to focus/cycle through inputs

**Behavior:**
- Single input: Always focuses same input
- Multiple inputs: Cycles in order (0 → 1 → 2 → 0...)

## ⚙️ Configuration

Settings → Bases Improvements:

- **Code Fence Language**: Target language (default: `base`)
- **Input Debounce**: Typing delay (default: 150ms)
- **Update Debounce**: Component update delay (default: 150ms)
- **Show Filter Input**: Toggle globally
- **Target Embeds**: Enable for `.base` embeds

[Full Configuration →](/configuration)

[Full Troubleshooting →](/troubleshooting)
