---
sidebar_position: 2
---

# Dynamic Filtering

Dynamic filtering is the core feature of Bases Improvements. This guide covers everything you need to know about how it works and how to use it effectively.

## 🎯 What is Dynamic Filtering?

Dynamic filtering allows you to **search and filter base query results by file name** without manually editing the query. A search input is automatically injected above each base block, and as you type, the plugin updates the query with a `file.name.contains()` filter.

## 🔍 How It Works

### Step-by-Step Process

1. **Detection**: Plugin scans your active note for base code blocks
2. **Injection**: Search input is rendered above each detected block
3. **Input Handling**: As you type, input is debounced (default: 150ms)
4. **Filter Application**: Query is updated with `file.name.contains("your-search")`
5. **Query Execution**: Bases plugin re-executes the updated query
6. **Results Update**: Filtered results appear in real-time

### Visual Example

**Original Query:**

````markdown
```base
FROM notes
SELECT title, date
ORDER BY date DESC
```
````

**After Typing "project":**

````markdown
```base
FROM notes
WHERE file.name.contains("project")
SELECT title, date
ORDER BY date DESC
```
````

## 🧠 Smart Filter Injection

The plugin intelligently handles different query structures:

### Case 1: No Existing WHERE Clause

**Before:**
```
FROM notes
SELECT title
```

**After (typing "meeting"):**
```
FROM notes
WHERE file.name.contains("meeting")
SELECT title
```

### Case 2: Existing WHERE Clause

**Before:**
```
FROM notes
WHERE date > "2024-01-01"
SELECT title
```

**After (typing "meeting"):**
```
FROM notes
WHERE date > "2024-01-01" AND file.name.contains("meeting")
SELECT title
```

### Case 3: Multiple Conditions

**Before:**
```
FROM notes
WHERE tags.contains("project") AND status = "active"
SELECT title
```

**After (typing "alpha"):**
```
FROM notes
WHERE tags.contains("project") AND status = "active" AND file.name.contains("alpha")
SELECT title
```

### Case 4: Clearing the Filter

When you **clear the search input**, the filter is automatically removed:

**With Filter:**
```
FROM notes
WHERE file.name.contains("meeting")
SELECT title
```

**After Clearing:**
```
FROM notes
SELECT title
```

## ⚡ Debouncing

Debouncing prevents excessive updates while you're typing, improving performance and user experience.

### Input Debounce

**What it does:** Waits for you to stop typing before applying the filter

**Default:** 150ms

**Configurable:** 0-2000ms (Settings → Bases Improvements → Input Debounce)

**Example:**
- You type: "m" → "me" → "mee" → "meet" → "meeti" → "meetin" → "meeting"
- Filter applies: Only after 150ms of no typing (once at "meeting")

### Update Debounce

**What it does:** Waits after editor changes before updating filter components

**Default:** 150ms

**Configurable:** 0-2000ms (Settings → Bases Improvements → Update Debounce)

**Use Case:** Prevents component re-renders while you're actively editing the note

### Adjusting Debounce

**Lower values (0-100ms):**
- ✅ More responsive
- ❌ More frequent updates
- 💡 Best for: Fast typers, small vaults

**Medium values (100-300ms):**
- ✅ Balanced performance
- ✅ Good user experience
- 💡 Best for: Most users (default)

**Higher values (300-2000ms):**
- ✅ Fewer updates
- ✅ Better performance on slow systems
- ❌ Less responsive
- 💡 Best for: Large vaults, complex queries, slower systems

## 🎨 Filter Input UI

### Appearance

The search input is styled to match Obsidian's interface:

- Clean, minimal design
- Matches theme (light/dark)
- Proper spacing and padding
- Clear placeholder text

### Placeholder Text

Default: `"Filter files by name..."`

The placeholder gives a clear indication of what the input does.

### Keyboard Interaction

- **Type**: Start filtering immediately
- **Enter**: Apply filter instantly (bypasses debounce)
- **Blur (click away)**: Apply filter instantly
- **Clear**: Remove filter and restore original query

### Focus Detection

The plugin detects when you're actively typing in a filter input and **prevents updates** that could interrupt your typing. This ensures a smooth user experience.

## 🔧 Filter Syntax

### Generated Filter

The plugin generates the following filter syntax:

```
file.name.contains("search-term")
```

### Case Sensitivity

The `contains()` function is **case-insensitive** by default (this is how Bases works):

- Searching for "Project" matches "project", "PROJECT", "Project"
- Searching for "MEETING" matches "meeting", "Meeting", "MEETING"

### Special Characters

Search terms with special characters are automatically handled:

- Quotes are escaped
- Spaces are preserved
- Special regex characters are treated literally

### Multiple Words

You can search for multiple words:

- **"project alpha"** → matches files with "project alpha" in the name
- **"meeting 2024"** → matches files with "meeting 2024" in the name

## 💡 Advanced Usage

### Combining with Other Filters

Dynamic filtering works great alongside other WHERE conditions:

```base
FROM notes
WHERE tags.contains("project")
  AND date > "2024-01-01"
  AND status = "active"
SELECT title, date
```

Type "alpha" in the search input:

```base
FROM notes
WHERE tags.contains("project")
  AND date > "2024-01-01"
  AND status = "active"
  AND file.name.contains("alpha")
SELECT title, date
```

### Filtering Specific Folders

Combine folder filters with name filters:

```base
FROM notes
WHERE file.folder = "Projects"
SELECT title
```

Type "client" in the search input:

```base
FROM notes
WHERE file.folder = "Projects" AND file.name.contains("client")
SELECT title
```

### Filtering by Date Range

Combine date filters with name filters:

```base
FROM notes
WHERE date >= "2024-01-01" AND date <= "2024-12-31"
SELECT title, date
```

Type "quarterly" in the search input:

```base
FROM notes
WHERE date >= "2024-01-01" AND date <= "2024-12-31" AND file.name.contains("quarterly")
SELECT title, date
```

## 🎯 Use Cases

### Use Case 1: Quick Note Lookup

**Scenario:** You have hundreds of daily notes and want to find a specific day

**Solution:** Use dynamic filtering to search by date or event

```base
FROM notes
WHERE file.folder = "Daily Notes"
SELECT title, date
ORDER BY date DESC
```

Type "2024-03-15" or "birthday" to find the specific note.

### Use Case 2: Project Filtering

**Scenario:** You have multiple projects and want to filter by project name

**Solution:** Use dynamic filtering to narrow down results

```base
FROM notes
WHERE tags.contains("project")
SELECT title, status, due-date
```

Type "alpha" or "client-x" to see only relevant projects.

### Use Case 3: Meeting Notes

**Scenario:** You want to find meetings with a specific person or topic

**Solution:** Use dynamic filtering to search meeting notes

```base
FROM notes
WHERE file.folder = "Meetings"
SELECT title, date, attendees
ORDER BY date DESC
```

Type "john" or "standup" to find relevant meetings.

### Use Case 4: Research Notes

**Scenario:** You're researching a topic and want to filter by keyword

**Solution:** Use dynamic filtering to find related notes

```base
FROM notes
WHERE tags.contains("research")
SELECT title, summary
```

Type "quantum" or "ai" to find notes on specific topics.

## 🐛 Troubleshooting

### Filter Not Applying

**Problem:** Typing in the input doesn't update the query

**Solutions:**
1. Wait for debounce delay (default: 150ms)
2. Press Enter to apply immediately
3. Check console for errors (Ctrl/Cmd + Shift + I)
4. Verify the Bases plugin is enabled

### Filter Applied Incorrectly

**Problem:** The WHERE clause looks wrong or duplicated

**Solutions:**
1. Check if your query has unusual syntax
2. Ensure you're using standard Bases query format
3. Report the issue on GitHub with your query example

### Input Not Appearing

**Problem:** No search input above base blocks

**Solutions:**
1. Verify plugin is enabled
2. Check "Show Filter Input" setting
3. Ensure you're using the correct code fence language
4. Reload the note

### Performance Issues

**Problem:** Typing feels laggy or slow

**Solutions:**
1. Increase input debounce (Settings → Input Debounce)
2. Increase update debounce (Settings → Update Debounce)
3. Simplify your base queries
4. Check for other plugin conflicts

## 📊 Performance Tips

1. **Use appropriate debounce values** for your system
2. **Keep queries simple** when possible
3. **Limit result sets** with LIMIT clause
4. **Use specific folder filters** to reduce search scope
5. **Close unused notes** to reduce plugin overhead

---

**Next:** Learn about [Embed Support](/features/embed-support) for filtering embedded base files!
