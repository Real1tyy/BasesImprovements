---
sidebar_position: 4
---

# Configuration

Bases Improvements offers several configuration options to customize the plugin to your workflow. This guide covers all available settings and how to use them.

## ⚙️ Accessing Settings

1. Open **Settings** (Ctrl/Cmd + ,)
2. Navigate to **Community plugins** section
3. Find **Bases Improvements** in the list
4. Click on the plugin name to open settings

## 🎯 Target Settings

These settings control **what** the plugin targets for filtering.

### Code Fence Language

**What it does:** Specifies which code fence language to target for inline base blocks

**Default:** `base`

**Type:** Text input

**Examples:**
- `base` - Standard Bases plugin syntax
- `bases` - Alternative syntax
- `dataview` - If you want to target Dataview blocks (experimental)
- `custom` - Any custom language identifier

**Use Case:**

If you use a custom language identifier for your base blocks:

````markdown
```bases
FROM notes
SELECT title
```
````

Set "Code Fence Language" to `bases` in settings.

**Note:** The plugin only injects filters—it doesn't execute queries. The Bases plugin must support your chosen language.

---

### Target Embeds

**What it does:** Controls whether to inject filter inputs above embedded `.base` files

**Default:** Enabled (✅)

**Type:** Toggle

**When Enabled:**
- Search inputs appear above `![[file.base]]` embeds
- Embedded files are modified when filtering
- Works across all notes embedding the same file

**When Disabled:**
- Only inline code blocks get search inputs
- Embedded files are not modified
- Reduces plugin overhead

**Use Case:**

Disable if you:
- Only use inline base blocks
- Don't want embedded files modified
- Want to improve performance

---

### Show Filter Input

**What it does:** Globally enables or disables the rendering of search inputs

**Default:** Enabled (✅)

**Type:** Toggle

**When Enabled:**
- Search inputs appear above all targeted blocks
- Full plugin functionality

**When Disabled:**
- No search inputs are rendered
- Plugin is effectively inactive (but still loaded)
- Useful for temporary disabling without unloading the plugin

**Use Case:**

Disable temporarily when:
- Giving a presentation
- Exporting notes
- You don't need filtering for a while
- Testing if the plugin causes conflicts

---

## ⚡ Performance Settings

These settings control **how** the plugin responds to input and updates.

### Input Debounce (ms)

**What it does:** Controls how long to wait after typing before applying the filter

**Default:** 150ms

**Range:** 0-2000ms

**Type:** Slider

**How It Works:**

When you type in a search input, the plugin waits for this duration of inactivity before applying the filter. This prevents excessive updates while you're still typing.

**Examples:**

- **0ms**: Filter applies immediately after each keystroke (not recommended)
- **100ms**: Very responsive, good for fast typers
- **150ms**: Balanced (default)
- **300ms**: Less responsive, better for slow systems
- **500ms+**: Noticeable delay, best for large vaults or complex queries

**Recommendations:**

| System/Use Case | Recommended Value |
|----------------|-------------------|
| Fast system, small vault | 100-150ms |
| Average system | 150-300ms |
| Slow system, large vault | 300-500ms |
| Complex queries | 500-1000ms |

**Tip:** Press **Enter** in the search input to bypass debounce and apply the filter immediately.

---

### Update Debounce (ms)

**What it does:** Controls how long to wait after editor changes before updating filter components

**Default:** 150ms

**Range:** 0-2000ms

**Type:** Slider

**How It Works:**

When you edit your note (add/remove blocks, change content), the plugin waits for this duration of inactivity before re-scanning for base blocks and updating filter components.

**Examples:**

- **0ms**: Components update immediately after each edit (not recommended)
- **100ms**: Very responsive to note changes
- **150ms**: Balanced (default)
- **300ms**: Less frequent updates
- **500ms+**: Infrequent updates, best for performance

**Recommendations:**

| System/Use Case | Recommended Value |
|----------------|-------------------|
| Fast system | 100-150ms |
| Average system | 150-300ms |
| Slow system | 300-500ms |
| Many base blocks per note | 500-1000ms |

**Tip:** If you notice lag when editing notes with base blocks, increase this value.

---

## 📊 Settings Summary

| Setting | Default | Type | Purpose |
|---------|---------|------|---------|
| Code Fence Language | `base` | Text | Language identifier to target |
| Target Embeds | Enabled | Toggle | Filter embedded `.base` files |
| Show Filter Input | Enabled | Toggle | Globally enable/disable inputs |
| Input Debounce | 150ms | Slider | Delay before applying filter |
| Update Debounce | 150ms | Slider | Delay before updating components |

---

## 🎯 Configuration Scenarios

### Scenario 1: Maximum Performance

**Goal:** Minimize plugin overhead for large vaults or slow systems

**Configuration:**
- Code Fence Language: `base`
- Target Embeds: **Disabled**
- Show Filter Input: Enabled
- Input Debounce: **500ms**
- Update Debounce: **500ms**

**Result:** Fewer updates, better performance, but less responsive

---

### Scenario 2: Maximum Responsiveness

**Goal:** Instant feedback for fast typers on powerful systems

**Configuration:**
- Code Fence Language: `base`
- Target Embeds: Enabled
- Show Filter Input: Enabled
- Input Debounce: **100ms**
- Update Debounce: **100ms**

**Result:** Very responsive, but more frequent updates

---

### Scenario 3: Inline Blocks Only

**Goal:** Only filter inline code blocks, not embeds

**Configuration:**
- Code Fence Language: `base`
- Target Embeds: **Disabled**
- Show Filter Input: Enabled
- Input Debounce: 150ms
- Update Debounce: 150ms

**Result:** Simpler workflow, no embedded file modifications

---

### Scenario 4: Custom Language

**Goal:** Use with a custom code fence language

**Configuration:**
- Code Fence Language: **`custom`** (your language)
- Target Embeds: Enabled
- Show Filter Input: Enabled
- Input Debounce: 150ms
- Update Debounce: 150ms

**Result:** Works with your custom syntax

---

### Scenario 5: Temporary Disable

**Goal:** Disable filtering without unloading the plugin

**Configuration:**
- Code Fence Language: `base`
- Target Embeds: Enabled
- Show Filter Input: **Disabled**
- Input Debounce: 150ms
- Update Debounce: 150ms

**Result:** Plugin loaded but inactive

---

## 🔧 Advanced Configuration

### Settings Storage

Settings are stored in:

```
.obsidian/plugins/bases-improvements/data.json
```

You can manually edit this file if needed (while Obsidian is closed).

### Default Settings

If you want to reset to defaults, delete `data.json` and reload the plugin.

### Settings Schema

The settings file uses the following structure:

```json
{
  "codeFenceLanguage": "base",
  "targetEmbeds": true,
  "showFilterInput": true,
  "inputDebounceMs": 150,
  "updateDebounceMs": 150
}
```

---

## 💡 Configuration Tips

### Tip 1: Start with Defaults

The default settings work well for most users. Only adjust if you experience issues or have specific needs.

### Tip 2: Adjust Debounce Based on Typing Speed

If you're a fast typer, lower the input debounce. If you're a slow typer, you can increase it.

### Tip 3: Monitor Performance

If you notice lag or slowness:
1. Increase both debounce values
2. Disable embed support if not needed
3. Check for other plugin conflicts

### Tip 4: Use Show Filter Input for Quick Toggle

Instead of disabling the plugin, use "Show Filter Input" to quickly turn filtering on/off.

### Tip 5: Experiment with Settings

Settings changes take effect immediately—experiment to find what works best for you!

---

## 🐛 Troubleshooting Settings

### Settings Not Saving

**Problem:** Changes to settings don't persist after reloading Obsidian

**Solutions:**
1. Check file permissions for `.obsidian/plugins/bases-improvements/`
2. Ensure Obsidian has write access to the vault
3. Try disabling and re-enabling the plugin
4. Check console for errors

### Settings Reset to Defaults

**Problem:** Settings keep resetting to default values

**Solutions:**
1. Check if `data.json` is being overwritten by sync (iCloud, Dropbox, etc.)
2. Ensure the file isn't read-only
3. Check for conflicts with other plugins

### Invalid Settings Values

**Problem:** Settings show unexpected or invalid values

**Solutions:**
1. Delete `data.json` and reload the plugin
2. Manually edit `data.json` with valid values (while Obsidian is closed)
3. Reinstall the plugin if corruption persists

---

**Next:** Check out the [Troubleshooting Guide](/troubleshooting) for common issues and solutions!
