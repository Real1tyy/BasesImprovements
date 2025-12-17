---
sidebar_position: 3
---

# Embed Support

Bases Improvements doesn't just work with inline code blocks—it also supports **embedded `.base` files**! This allows you to create reusable query files and filter them dynamically.

## 🎯 What is Embed Support?

Embed support allows you to:

1. Create standalone `.base` query files
2. Embed them in your notes with `![[query.base]]`
3. Filter the embedded query results just like inline blocks

This is perfect for **reusable queries** that you want to use across multiple notes.

## 📝 Creating Embedded Base Files

### Step 1: Create a Base File

Create a new file with the `.base` extension (e.g., `my-query.base`):

```
FROM notes
WHERE tags.contains("project")
SELECT title, status, due-date
ORDER BY due-date ASC
```

### Step 2: Embed in a Note

In any note, embed the base file:

```markdown
# My Projects

![[my-query.base]]
```

### Step 3: Filter the Embed

A search input will automatically appear above the embedded query, and you can filter it just like inline blocks!

## 🔍 How It Works

### Detection

The plugin scans your note for embed syntax:

```markdown
![[file.base]]
```

When it finds an embed with a `.base` extension, it:

1. Reads the embedded file content
2. Injects a search input above the embed
3. Monitors the input for changes
4. Updates the embedded file content with filters

### Filter Application

When you type in the search input, the plugin:

1. Reads the current content of the `.base` file
2. Adds or updates the `file.name.contains()` filter
3. Writes the updated content back to the `.base` file
4. Bases plugin re-renders the embedded query

### File Updates

**Important:** When you filter an embedded query, the **actual `.base` file is modified**. This means:

- ✅ The filter persists across notes that embed the same file
- ✅ You can see the filter in the original `.base` file
- ⚠️ Clearing the filter updates all notes embedding that file

## ⚙️ Configuration

### Enabling/Disabling Embed Support

Embed support can be toggled in settings:

**Settings → Bases Improvements → Target Embeds**

- **Enabled (default)**: Search inputs appear above embedded `.base` files
- **Disabled**: Only inline code blocks get search inputs

### Why Disable?

You might want to disable embed support if:

- You only use inline base blocks
- You don't want embedded files to be modified
- You want to reduce plugin overhead
- You have many embeds and don't need filtering

## 💡 Use Cases

### Use Case 1: Shared Dashboard Queries

**Scenario:** You have multiple dashboard notes that use the same queries

**Solution:** Create reusable `.base` files and embed them

**Example:**

Create `active-projects.base`:
```
FROM notes
WHERE tags.contains("project") AND status = "active"
SELECT title, status, due-date
ORDER BY due-date ASC
```

Embed in multiple dashboards:

```markdown
# Personal Dashboard
![[active-projects.base]]

# Team Dashboard
![[active-projects.base]]
```

Filter in any dashboard, and the query updates everywhere!

### Use Case 2: Template Queries

**Scenario:** You have standard queries you use in different contexts

**Solution:** Create template `.base` files for common queries

**Examples:**

- `recent-notes.base` - Last 10 modified notes
- `untagged-notes.base` - Notes without tags
- `orphaned-notes.base` - Notes without links
- `todos.base` - All incomplete tasks

Embed them where needed and filter dynamically.

### Use Case 3: Report Queries

**Scenario:** You generate regular reports with base queries

**Solution:** Create report-specific `.base` files

**Example:**

Create `weekly-report.base`:
```
FROM notes
WHERE date >= "2024-01-01" AND date <= "2024-01-07"
SELECT title, date, summary
ORDER BY date DESC
```

Embed in your weekly report note and filter by topic or keyword.

### Use Case 4: Folder-Specific Queries

**Scenario:** You have queries specific to certain folders

**Solution:** Store `.base` files in the same folder as the notes they query

**Example:**

In `Projects/` folder, create `projects-query.base`:
```
FROM notes
WHERE file.folder = "Projects"
SELECT title, status
```

Embed in project overview notes and filter by project name.

## 🎨 Embed vs Inline Comparison

| Feature | Inline Blocks | Embedded Files |
|---------|--------------|----------------|
| Search Input | ✅ | ✅ |
| Dynamic Filtering | ✅ | ✅ |
| Reusable | ❌ | ✅ |
| Modifies Source | ❌ (note only) | ✅ (base file) |
| Multiple Uses | ❌ | ✅ |
| Version Control | Per note | Per base file |
| Can be Disabled | ❌ | ✅ |

## 🔧 Advanced Usage

### Combining Inline and Embedded

You can use both inline blocks and embedded files in the same note:

```markdown
# My Dashboard

## Inline Query
```base
FROM notes
WHERE date = today
SELECT title
```

## Embedded Query
![[weekly-summary.base]]
```

Both will have search inputs and can be filtered independently.

### Nested Embeds

If a `.base` file is embedded in multiple notes, filtering in one note updates all instances:

**Note 1:**
```markdown
![[shared-query.base]]
```

**Note 2:**
```markdown
![[shared-query.base]]
```

Filtering in Note 1 updates the `.base` file, which affects Note 2 as well.

### Embed with Additional Context

You can add context around embedded queries:

```markdown
# Project Status

Here are all active projects:

![[active-projects.base]]

Use the search above to filter by project name or client.
```

## 🐛 Troubleshooting

### Search Input Not Appearing for Embeds

**Problem:** Inline blocks work, but embeds don't show search inputs

**Solutions:**
1. Check "Target Embeds" setting (Settings → Bases Improvements)
2. Verify the file has a `.base` extension
3. Ensure the embed syntax is correct: `![[file.base]]`
4. Reload the note

### Embedded File Not Updating

**Problem:** Typing in the search input doesn't update the embedded query

**Solutions:**
1. Check file permissions (ensure the `.base` file is writable)
2. Verify the Bases plugin is installed and enabled
3. Check console for errors (Ctrl/Cmd + Shift + I)
4. Try closing and reopening the note

### Filter Persists Across Notes

**Problem:** Filtering in one note affects other notes embedding the same file

**Explanation:** This is expected behavior! Embedded files are modified directly.

**Solutions:**
1. Use inline blocks if you want independent filters
2. Create separate `.base` files for different use cases
3. Clear the filter when done to reset the embedded file

### Performance with Many Embeds

**Problem:** Note loads slowly with many embedded `.base` files

**Solutions:**
1. Disable "Target Embeds" if you don't need filtering
2. Increase update debounce (Settings → Update Debounce)
3. Reduce the number of embeds per note
4. Use inline blocks for simple queries

## 📊 Best Practices

### 1. Organize Base Files

Keep your `.base` files organized in a dedicated folder:

```
Queries/
├── projects.base
├── meetings.base
├── daily-notes.base
└── research.base
```

### 2. Use Descriptive Names

Name your `.base` files clearly:

- ✅ `active-projects.base`
- ✅ `recent-meetings.base`
- ❌ `query1.base`
- ❌ `temp.base`

### 3. Document Your Queries

Add comments in your `.base` files:

```
# Active projects with upcoming deadlines
FROM notes
WHERE tags.contains("project") AND status = "active"
SELECT title, due-date
ORDER BY due-date ASC
```

### 4. Clear Filters When Done

If you're filtering a shared embedded file, **clear the filter** when you're done so it doesn't affect other notes.

### 5. Use Inline for One-Off Queries

If a query is only used in one note, use an **inline block** instead of creating a separate `.base` file.

### 6. Version Control

If you use Git or another version control system, `.base` files are tracked like any other file. Be mindful of filter changes in commits.

## 🎯 When to Use Embeds vs Inline

### Use Embedded Files When:

- ✅ Query is used in multiple notes
- ✅ Query is complex and reusable
- ✅ You want centralized query management
- ✅ You want to version control queries separately

### Use Inline Blocks When:

- ✅ Query is specific to one note
- ✅ Query is simple or experimental
- ✅ You want independent filters per note
- ✅ You don't want to create extra files

---

**Next:** Learn how to [Configure](/configuration) Bases Improvements to match your workflow!
