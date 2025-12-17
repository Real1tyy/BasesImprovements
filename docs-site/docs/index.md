---
sidebar_position: 1
slug: /
---

# Introduction

**Bases Improvements** is an Obsidian plugin that enhances the [Bases plugin](https://github.com/SkepticMystic/bases) workflow by adding **dynamic search filtering** to your base code blocks and embeds.

## 🎯 What Does It Do?

Bases Improvements automatically injects a **search input field** above every `base` code block in your notes. As you type, the plugin dynamically updates the base block content to include a `file.name.contains("value")` filter, making it easy to search and filter your query results on the fly.

## ✨ Key Features

- **🔍 Dynamic Search Filtering** - Live search input injected above base blocks
- **📝 Smart Filter Injection** - Intelligently adds filters to existing WHERE clauses
- **🔗 Embed Support** - Works with both inline blocks and embedded `.base` files
- **⚡ Debounced Input** - Configurable debouncing prevents excessive updates
- **🎨 Clean UI** - Styled search inputs that integrate seamlessly with Obsidian
- **⚙️ Highly Configurable** - Customize code fence language, debounce timing, and more

## 🚀 Quick Example

### Before Typing

````markdown
```base
FROM notes
SELECT title, date
```
````

### After Typing "meeting"

````markdown
```base
FROM notes
WHERE file.name.contains("meeting")
SELECT title, date
```
````

The filter is automatically injected and your base query updates in real-time!

## 🎬 How It Works

1. **Detects Base Blocks** - Scans your active note for code blocks with the configured language (default: `base`)
2. **Injects Search Input** - Renders a styled search input above each detected block
3. **Live Updates** - As you type, the filter is automatically added or updated in the base block
4. **Smart Filtering** - Handles existing WHERE clauses by appending with AND logic

## 🔧 Requirements

- **Obsidian**: 1.4.16 or higher
- **Bases Plugin**: Required for base blocks to actually query your vault

## 📚 What's Next?

- **[Installation](/installation)** - Get the plugin installed and running
- **[Quick Start](/quickstart)** - Start using dynamic filtering in minutes
- **[Features](/features/overview)** - Explore all available features
- **[Configuration](/configuration)** - Customize the plugin to your workflow

## 💡 Use Cases

- **Quick Note Filtering** - Instantly filter notes by name without modifying your base query
- **Exploratory Queries** - Test different search terms without manually editing code blocks
- **Embedded Queries** - Filter embedded `.base` files just as easily as inline blocks
- **Rapid Prototyping** - Quickly iterate on query filters during note creation

## 🌟 Why Bases Improvements?

If you use the Bases plugin to query your vault, you know how powerful it is. But manually editing WHERE clauses to filter by file name gets tedious. **Bases Improvements** solves this by giving you a **live search interface** that automatically updates your queries.

---

**Ready to get started?** Head to the [Installation](/installation) guide!
