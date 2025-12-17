---
sidebar_position: 6
---

# FAQ

Frequently asked questions about Bases Improvements.

## General Questions

### What is Bases Improvements?

Bases Improvements is an Obsidian plugin that enhances the [Bases plugin](https://github.com/SkepticMystic/bases) by adding dynamic search filtering to base code blocks and embedded `.base` files.

### Do I need the Bases plugin?

**Yes!** Bases Improvements enhances the Bases plugin—it doesn't replace it. You must have the Bases plugin installed and enabled for queries to actually execute.

### Is it free?

Yes, Bases Improvements is completely free and open source under the MIT license.

### Where can I get support?

- Check the [Troubleshooting Guide](/troubleshooting)
- Search [GitHub Issues](https://github.com/Real1tyy/BasesImprovements/issues)
- Open a new issue if your problem isn't covered

---

## Installation & Setup

### How do I install the plugin?

See the [Installation Guide](/installation) for detailed instructions. The easiest method is through Obsidian's Community Plugins browser (once approved).

### What version of Obsidian do I need?

Obsidian 1.4.16 or higher is required.

### Can I use it on mobile?

Yes! The plugin works on both desktop and mobile versions of Obsidian.

### How do I update the plugin?

Updates are available through Obsidian's Community Plugins interface. You'll see an "Update" button when a new version is available.

---

## Features & Usage

### What does "dynamic filtering" mean?

Dynamic filtering means you can search and filter base query results by typing in a search input, without manually editing the query code. The plugin automatically updates the WHERE clause as you type.

### Does it work with embedded base files?

Yes! The plugin supports both inline ` ```base ` code blocks and embedded `![[file.base]]` files. Embed support can be toggled in settings.

### Can I filter by things other than file name?

Currently, the plugin only supports filtering by file name using `file.name.contains()`. Other filter types may be added in future versions.

### Does filtering modify my notes?

- **Inline blocks**: Yes, the note content is updated with the filter
- **Embedded files**: Yes, the `.base` file itself is modified
- **Original content**: The filter is added/removed cleanly without affecting other parts of the query

### Can I use custom code fence languages?

Yes! You can configure the code fence language in settings. The default is `base`, but you can change it to `bases`, `dataview`, or any custom identifier.

---

## Configuration

### How do I access settings?

Settings → Community Plugins → Bases Improvements (click the plugin name)

### What is debouncing?

Debouncing is a delay before an action is performed. It prevents excessive updates while you're typing. The default is 150ms, meaning the filter applies 150ms after you stop typing.

### Can I disable the search inputs temporarily?

Yes! Toggle "Show Filter Input" in settings to disable search inputs without unloading the plugin.

### Can I disable embed support?

Yes! Toggle "Target Embeds" in settings to disable filtering for embedded `.base` files.

---

## Troubleshooting

### Why isn't the search input appearing?

Common causes:
1. Plugin isn't enabled
2. "Show Filter Input" is disabled in settings
3. Code fence language doesn't match settings (default: `base`)
4. Note needs to be reloaded

See the [Troubleshooting Guide](/troubleshooting#search-input-not-appearing) for detailed solutions.

### Why isn't the filter applying?

Common causes:
1. Need to wait for debounce delay (default: 150ms)
2. Query syntax errors
3. Bases plugin not installed or enabled
4. File permission issues (for embeds)

See the [Troubleshooting Guide](/troubleshooting#filter-not-applying) for detailed solutions.

### Why is filtering slow or laggy?

Try these solutions:
1. Increase debounce values in settings (300-500ms)
2. Disable embed support if not needed
3. Simplify your base queries
4. Check for plugin conflicts

See the [Troubleshooting Guide](/troubleshooting#performance-issues) for more details.

### Why does filtering in one note affect another?

This is **expected behavior** for embedded `.base` files! When you filter an embedded query, the actual file is modified, which affects all notes embedding that file.

**Solutions:**
- Clear the filter when done
- Use inline blocks for independent filters
- Create separate `.base` files for different use cases

---

## Technical Questions

### How does the plugin work?

1. Scans active note for base code blocks
2. Injects search inputs above each block
3. Monitors input for changes
4. Updates query with `file.name.contains()` filter
5. Bases plugin re-executes the updated query

### Does it affect performance?

The plugin is designed to be lightweight and efficient. It uses debouncing and smart component management to minimize overhead. If you experience performance issues, increase debounce values in settings.

### Is my data safe?

Yes! The plugin only modifies base query syntax—it doesn't touch your actual note content (except for the query blocks themselves). All changes are made through Obsidian's API, which supports undo/redo.

### Can I undo filter changes?

Yes! Use Obsidian's undo (Ctrl/Cmd + Z) to revert filter changes.

### Does it work with version control (Git)?

Yes! The plugin works fine with Git or other version control systems. Note that embedded `.base` files will show changes when filtered.

---

## Compatibility

### Does it work with Dataview?

The plugin is designed for the Bases plugin, not Dataview. However, you could theoretically configure it to target Dataview blocks by changing the code fence language setting. This is experimental and not officially supported.

### Does it work with Templater?

Yes, there should be no conflicts with Templater.

### Does it work with other query plugins?

The plugin is specifically designed for Bases. Compatibility with other query plugins is not guaranteed.

### Does it work with custom themes?

Yes! The plugin uses standard Obsidian styling and should work with all themes. If you encounter styling issues, report them on GitHub.

---

## Development & Contributing

### Is the plugin open source?

Yes! The source code is available on [GitHub](https://github.com/Real1tyy/BasesImprovements) under the MIT license.

### Can I contribute?

Absolutely! Contributions are welcome. See the [Contributing Guide](/contributing) for details.

### How do I report a bug?

Open an issue on [GitHub](https://github.com/Real1tyy/BasesImprovements/issues/new) with:
- Clear description of the problem
- Steps to reproduce
- System information (Obsidian version, OS, etc.)
- Error messages from console

### How do I request a feature?

Open an issue on [GitHub](https://github.com/Real1tyy/BasesImprovements/issues/new) with:
- Clear description of the feature
- Use case or problem it solves
- Any mockups or examples

### Can I fork the plugin?

Yes! The MIT license allows forking and modification. Please maintain attribution to the original project.

---

## Future Plans

### Will there be more filter types?

Possibly! Future versions may include:
- Tag filtering
- Folder filtering
- Date filtering
- Custom filter syntax

### Will there be saved filter presets?

This is being considered for future versions. Upvote the feature request on GitHub if you'd like to see this!

### Will there be keyboard shortcuts?

Keyboard shortcuts for focusing filter inputs are planned for a future release.

### Will there be filter history?

This is a potential future feature. Let us know if you'd like to see this!

---

## Support

### How can I support the project?

- ⭐ Star the [GitHub repository](https://github.com/Real1tyy/BasesImprovements)
- 📢 Share the plugin with others
- 🐛 Report bugs and suggest features
- 💻 Contribute code or documentation
- 💰 [Support the developer](https://github.com/Real1tyy#-support-my-work)

### Where can I find more information?

- **[Documentation](/)** - Complete plugin documentation
- **[GitHub](https://github.com/Real1tyy/BasesImprovements)** - Source code and issues
- **[Bases Plugin](https://github.com/SkepticMystic/bases)** - The plugin this enhances

---

**Have a question not answered here?** [Open an issue on GitHub](https://github.com/Real1tyy/BasesImprovements/issues/new) or check the [Troubleshooting Guide](/troubleshooting)!
