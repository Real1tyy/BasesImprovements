---
sidebar_position: 3
---

# Quick Start

Get up and running with Bases Improvements in just a few minutes!

## 🎯 Prerequisites

Before starting, make sure you have:

- ✅ Obsidian 1.4.16 or higher installed
- ✅ Bases plugin installed and enabled
- ✅ Bases Improvements plugin installed and enabled

## 🚀 Basic Usage

### Step 1: Create a Base Block

Create a new note or open an existing one, and add a base code block:

````markdown
```base
FROM notes
SELECT title, date
ORDER BY date DESC
```
````

### Step 2: See the Search Input

Once you add the base block, you should immediately see a **search input field** appear above it. This is automatically injected by Bases Improvements.

### Step 3: Start Filtering

Type a search term in the input field, for example: `meeting`

The base block will automatically update to:

````markdown
```base
FROM notes
WHERE file.name.contains("meeting")
SELECT title, date
ORDER BY date DESC
```
````

The Bases plugin will then execute this updated query and show only files with "meeting" in their name!

### Step 4: Clear the Filter

To remove the filter, simply **clear the search input**. The WHERE clause will be automatically removed.

## 🎨 Working with Existing WHERE Clauses

If your base block already has a WHERE clause, Bases Improvements will **intelligently append** the filter:

### Before Typing

````markdown
```base
FROM notes
WHERE date > "2024-01-01"
SELECT title, date
```
````

### After Typing "project"

````markdown
```base
FROM notes
WHERE date > "2024-01-01" AND file.name.contains("project")
SELECT title, date
```
````

The existing condition is preserved, and the name filter is added with `AND` logic!

## 🔗 Working with Embedded Base Files

Bases Improvements also works with **embedded `.base` files**!

### Step 1: Create a Base File

Create a file named `my-query.base` with your base query:

```
FROM notes
SELECT title, date
ORDER BY date DESC
```

### Step 2: Embed the File

In any note, embed the base file:

```markdown
![[my-query.base]]
```

### Step 3: Filter the Embed

A search input will appear above the embedded query, and you can filter it just like inline blocks!

> **Note**: Embed filtering must be enabled in settings (it's on by default). See [Configuration](/configuration) for details.

## ⚙️ Basic Configuration

### Accessing Settings

1. Open **Settings** → **Bases Improvements**
2. You'll see several configuration options

### Key Settings

- **Code Fence Language**: The language identifier to target (default: `base`)
- **Target Embeds**: Whether to inject filters above embedded `.base` files (default: enabled)
- **Show Filter Input**: Toggle the search input on/off globally (default: enabled)
- **Input Debounce**: How long to wait after typing before applying the filter (default: 150ms)

For detailed configuration options, see the [Configuration Guide](/configuration).

## 💡 Tips & Tricks

### Tip 1: Use Keyboard Shortcuts

While there's no built-in command to focus filters yet, you can click the input to start typing immediately.

### Tip 2: Adjust Debounce for Performance

If you have large vaults or complex queries, increase the **Input Debounce** setting to reduce the frequency of updates while typing.

### Tip 3: Combine with Other Filters

The name filter works great alongside other WHERE conditions:

````markdown
```base
FROM notes
WHERE tags.contains("project") AND date > "2024-01-01"
SELECT title, date
```
````

Type "alpha" in the search input, and it becomes:

````markdown
```base
FROM notes
WHERE tags.contains("project") AND date > "2024-01-01" AND file.name.contains("alpha")
SELECT title, date
```
````

### Tip 4: Case Sensitivity

The `file.name.contains()` filter is **case-insensitive** by default (this is how Bases works). Searching for "Meeting" will match "meeting", "MEETING", and "Meeting".

## 🎯 Common Use Cases

### Use Case 1: Daily Notes Dashboard

Create a dashboard with filtered daily notes:

````markdown
# Daily Notes

```base
FROM notes
WHERE file.folder = "Daily Notes"
SELECT title, date
ORDER BY date DESC
LIMIT 20
```
````

Use the search input to quickly find specific days!

### Use Case 2: Project Filtering

Filter project notes on the fly:

````markdown
# Projects

```base
FROM notes
WHERE tags.contains("project")
SELECT title, status, due-date
```
````

Type a project name to narrow down the results.

### Use Case 3: Meeting Notes

Find meeting notes by participant or topic:

````markdown
# Meetings

```base
FROM notes
WHERE file.folder = "Meetings"
SELECT title, date, attendees
ORDER BY date DESC
```
````

Search for a person's name or meeting topic instantly.

## 🐛 Troubleshooting

### Search Input Not Appearing

1. **Check plugin is enabled**: Settings → Community Plugins → Bases Improvements
2. **Verify code fence language**: Make sure you're using ` ```base ` (or your configured language)
3. **Check "Show Filter Input" setting**: Settings → Bases Improvements → Show Filter Input

### Filter Not Updating

1. **Check debounce timing**: The filter applies after you stop typing (default: 150ms)
2. **Press Enter**: You can press Enter to apply the filter immediately
3. **Check console for errors**: Open Developer Console (Ctrl/Cmd + Shift + I)

### Embedded Queries Not Working

1. **Check "Target Embeds" setting**: Settings → Bases Improvements → Target Embeds (should be enabled)
2. **Verify file extension**: Make sure the embedded file has a `.base` extension
3. **Reload the note**: Try closing and reopening the note

For more troubleshooting help, see the [Troubleshooting Guide](/troubleshooting).

## 🎓 Next Steps

Now that you're up and running, explore more features:

- **[Features Overview](/features/overview)** - Learn about all available features
- **[Dynamic Filtering](/features/dynamic-filtering)** - Deep dive into filtering capabilities
- **[Configuration](/configuration)** - Customize the plugin to your workflow
- **[FAQ](/faq)** - Common questions and answers

---

**Happy filtering!** 🎉
