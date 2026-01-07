# Bases Improvements

An Obsidian plugin that enhances the Bases plugin workflow by adding dynamic search filtering to `base` code blocks.

📚 **[View Full Documentation](https://real1tyy.github.io/BasesImprovements/)**

## 🎥 Quick Tutorial

Watch a quick tutorial on how to use Bases Improvements:

[![Bases Improvements Tutorial](https://img.youtube.com/vi/vqOCACgueKU/maxresdefault.jpg)](https://www.youtube.com/shorts/vqOCACgueKU)

**[Watch on YouTube →](https://www.youtube.com/shorts/vqOCACgueKU)**

## Features

### 🔍 Dynamic Search Filtering

Automatically injects a search input field above every `base` code block in your notes. As you type, the plugin dynamically updates the base block content to include a `file.name.contains("value")` filter.

**How it works:**

1. **Detects `base` blocks** - The plugin watches your active note for any code blocks with the `base` language identifier
2. **Injects input form** - Renders a styled search input above each base block
3. **Live updates** - As you type, the filter is automatically added/updated in the base block with debounced input (150ms)
4. **Smart filtering** - Intelligently adds the filter to existing WHERE clauses or creates new ones

### Example Usage

Before typing in the filter:

````markdown
```base
FROM notes
SELECT title, date
```
````

After typing "meeting" in the injected input:

````markdown
```base
FROM notes
WHERE file.name.contains("meeting")
SELECT title, date
```
````

If there's already a WHERE clause, it appends with AND:

````markdown
```base
FROM notes
WHERE date > "2024-01-01" AND file.name.contains("meeting")
SELECT title, date
```
````

## Installation

For detailed installation instructions, see the **[Installation Guide](https://real1tyy.github.io/BasesImprovements/installation)**.

### Quick Install (Community Plugins)

Once approved:
1. Open **Settings** → **Community plugins**
2. Search for **"Bases Improvements"**
3. Click **Install** and **Enable**

### Development

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm dev` for development with hot reload
4. Make changes to files in `src/`

## Documentation

📚 **[Full Documentation](https://real1tyy.github.io/BasesImprovements/)**

- [Quick Start Guide](https://real1tyy.github.io/BasesImprovements/quickstart)
- [Features Overview](https://real1tyy.github.io/BasesImprovements/features/overview)
- [Configuration](https://real1tyy.github.io/BasesImprovements/configuration)
- [Troubleshooting](https://real1tyy.github.io/BasesImprovements/troubleshooting)
- [FAQ](https://real1tyy.github.io/BasesImprovements/faq)

## Architecture

The plugin uses a clean component-based architecture:

- **`BaseFilterInput`** - Reusable component that handles input rendering, debouncing, and events
- **`BasesImprovementsPlugin`** - Main plugin class that manages component lifecycle and base block detection
- **Event-driven updates** - Listens to workspace changes to dynamically update filters

### Key Features

- ✅ **Debounced input** - 150ms debounce prevents excessive updates
- ✅ **Smart filter injection** - Handles both new filters and updates to existing filters
- ✅ **Component composition** - Clean separation of concerns with reusable components
- ✅ **Memory management** - Proper cleanup of components and event listeners

## Configuration

The plugin offers several configuration options:

- **Code Fence Language** - Target custom language identifiers (default: `base`)
- **Target Embeds** - Enable/disable filtering for embedded `.base` files
- **Show Filter Input** - Globally toggle search inputs on/off
- **Input Debounce** - Adjust responsiveness (0-2000ms)
- **Update Debounce** - Control component update frequency

For detailed configuration, see the **[Configuration Guide](https://real1tyy.github.io/BasesImprovements/configuration)**.

## Technical Details

### Component Structure

```
src/
├── components/
│   ├── base-filter-input.ts  # Reusable filter input component
│   └── index.ts               # Component exports
└── main.ts                    # Main plugin class
```

### How It Works

1. **Detection**: The plugin scans the active note for `base` code blocks using line-by-line parsing
2. **Injection**: For each base block found, creates a `BaseFilterInput` component and injects it into the DOM
3. **Updates**: When the input changes, the component triggers a callback that:
   - Extracts the current block content
   - Adds/updates the `file.name.contains()` filter
   - Replaces the block content in the editor
4. **Cleanup**: Components are properly destroyed when the note changes or the plugin unloads

## Compatibility

- **Obsidian**: 1.8.7+
- **Bases Plugin**: Required for the base blocks to actually query your vault

## Development

### Build Commands

- `pnpm dev` - Development build with hot reload
- `pnpm build` - Production build
- `pnpm typecheck` - Type checking
- `pnpm check:fix` - Run Biome linting and formatting

### Code Quality

This project uses:
- **Biome** for linting and formatting
- **TypeScript** for type safety
- **ESBuild** for fast builds

## License

MIT License - See LICENSE file for details

## Author

Real1tyy

## Support

If you find this plugin helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting new features
- 📢 Sharing with others
- 💰 [Supporting my work](https://github.com/Real1tyy#-support-my-work)

See the **[Support Page](https://real1tyy.github.io/BasesImprovements/support)** for more ways to help!
