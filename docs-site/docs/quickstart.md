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
