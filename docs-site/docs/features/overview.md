---
sidebar_position: 1
---

# Features Overview

Bases Improvements is designed to enhance your Bases plugin workflow with powerful, intuitive features. Here's everything the plugin can do.

## 🔍 Core Features

### Dynamic Search Filtering

The primary feature of Bases Improvements is **dynamic search filtering**. A search input is automatically injected above every base code block, allowing you to filter results by file name in real-time.

**Key Benefits:**
- ✅ No manual editing of WHERE clauses
- ✅ Instant visual feedback as you type
- ✅ Debounced input prevents excessive updates
- ✅ Automatically preserves existing filters

[Learn more →](/features/dynamic-filtering)

### Embed Support

Works seamlessly with **embedded `.base` files**, not just inline code blocks. Filter embedded queries just as easily as inline ones.

**Key Benefits:**
- ✅ Reusable query files with dynamic filtering
- ✅ Consistent experience across inline and embedded queries
- ✅ Can be toggled on/off in settings

[Learn more →](/features/embed-support)

## ⚙️ Configuration Features

### Customizable Code Fence Language

Target any code fence language, not just `base`. Useful if you use custom language identifiers or multiple query systems.

**Default:** `base`

**Example:** Change to `dataview` or `bases` if needed

### Adjustable Debouncing

Fine-tune the responsiveness of the plugin with configurable debounce timings:

- **Input Debounce**: How long to wait after typing before applying the filter
- **Update Debounce**: How long to wait after editor changes before updating components

**Benefits:**
- ⚡ Reduce lag on slower systems
- 🎯 Balance between responsiveness and performance
- 🔧 Customize to your typing speed

### Toggle Filter Inputs

Globally enable or disable the search input rendering without uninstalling the plugin.

**Use Cases:**
- Temporarily disable for presentations
- Turn off when not needed
- Quick toggle without plugin reload

## 🎨 UI Features

### Styled Search Inputs

Clean, modern search inputs that integrate seamlessly with Obsidian's interface:

- Consistent with Obsidian's design language
- Supports both light and dark themes
- Proper spacing and alignment
- Clear visual hierarchy

### Non-Intrusive Design

The plugin enhances your workflow without getting in the way:

- Inputs appear only when needed
- Minimal visual footprint
- Preserves your note's readability
- Easy to ignore when not in use

## 🚀 Performance Features

### Smart Component Management

Efficient component lifecycle management ensures smooth performance:

- Components are created only when needed
- Automatic cleanup when notes change
- Memory-efficient implementation
- No memory leaks

### Debounced Updates

Multiple levels of debouncing prevent excessive processing:

- Input debouncing reduces filter updates while typing
- Update debouncing reduces component re-renders
- Configurable timing for different use cases

### Focus Detection

The plugin intelligently detects when you're actively using a filter input and prevents unnecessary updates that could interrupt your typing.

## 🔧 Developer Features

### Clean Architecture

Built with maintainability and extensibility in mind:

- Component-based architecture
- Separation of concerns
- Reusable utilities
- Well-documented code

### TypeScript

Fully typed with TypeScript for better development experience:

- Type safety throughout
- Better IDE support
- Fewer runtime errors
- Self-documenting code

### Modern Build System

Uses modern tooling for fast development:

- ESBuild for lightning-fast builds
- Hot reload during development
- Biome for linting and formatting
- Vitest for testing

## 📊 Feature Comparison

| Feature | Inline Blocks | Embedded Files |
|---------|--------------|----------------|
| Search Input | ✅ | ✅ |
| Dynamic Filtering | ✅ | ✅ |
| WHERE Clause Detection | ✅ | ✅ |
| Debounced Input | ✅ | ✅ |
| Focus Detection | ✅ | ✅ |
| Configurable | ✅ | ✅ (can be disabled) |

## 🎯 Feature Roadmap

Potential future features (not yet implemented):

- 🔮 Multiple filter types (tags, folders, dates)
- 🔮 Saved filter presets
- 🔮 Keyboard shortcuts for filter focus
- 🔮 Filter history
- 🔮 Advanced filter syntax
- 🔮 Filter templates

Want to see a feature? [Request it on GitHub](https://github.com/Real1tyy/BasesImprovements/issues)!

## 📚 Feature Documentation

Dive deeper into specific features:

- **[Dynamic Filtering](/features/dynamic-filtering)** - Complete guide to search filtering
- **[Embed Support](/features/embed-support)** - Working with embedded base files

## 💡 Feature Highlights

### Intelligent Filter Injection

The plugin doesn't just blindly add filters—it intelligently analyzes your base block:

1. **Detects existing WHERE clauses** and appends with AND
2. **Preserves your query structure** and formatting
3. **Handles edge cases** like multiple WHERE keywords
4. **Removes filters cleanly** when search is cleared

### Real-Time Updates

See results instantly as you type:

1. Type in the search input
2. Filter is applied after debounce delay (default: 150ms)
3. Bases plugin re-executes the query
4. Results update in real-time

### Seamless Integration

Works perfectly with the Bases plugin:

- No conflicts with Bases functionality
- Respects Bases query syntax
- Compatible with all Bases features
- Enhances without replacing

---

**Ready to explore?** Check out the detailed feature guides or jump to [Configuration](/configuration) to customize your experience!
