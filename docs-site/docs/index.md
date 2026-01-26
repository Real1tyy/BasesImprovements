---
sidebar_position: 1
slug: /
---

<div align="center">
  <img src="/img/logo.jpeg" alt="Bases Improvements Logo" width="400" />
</div>

# Introduction

**Bases Improvements** - Supercharge your Obsidian Bases workflow with dynamic search filtering — filter any base query instantly

## 🎥 Quick Tutorial

Watch this quick video tutorial to see Bases Improvements in action:

<div align="center">
  <iframe
    width="315"
    height="560"
    src="https://www.youtube.com/embed/vqOCACgueKU"
    title="Bases Improvements Tutorial"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

**[Watch on YouTube](https://www.youtube.com/shorts/vqOCACgueKU)**

## 🎯 What Does It Do?

Bases Improvements automatically injects a **search input field** above every `base` code block in your notes. As you type, the plugin dynamically updates the base block content to include a `file.name.contains("value")` filter, making it easy to search and filter your query results on the fly.

## ✨ Key Features

- **🔍 Dynamic Search Filtering** - Live search input injected above base blocks
- **📝 Smart Filter Injection** - Intelligently adds filters to existing WHERE clauses
- **🔗 Embed Support** - Works with both inline blocks and embedded `.base` files
- **⚡ Debounced Input** - Configurable debouncing prevents excessive updates

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

---

## 📚 What's Next?

- **[Installation](/installation)** - Get the plugin installed and running
- **[Quick Start](/quickstart)** - Start using dynamic filtering in minutes
- **[Features](/features/overview)** - Explore all available features
- **[Configuration](/configuration)** - Customize the plugin to your workflow
