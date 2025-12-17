---
sidebar_position: 7
---

# Contributing

We welcome contributions and feedback from the community! Here's how you can help make Bases Improvements better.

## 🐛 Found a Bug?

If you encounter any issues, please **[create an issue on GitHub](https://github.com/Real1tyy/BasesImprovements/issues/new)**.

**Before creating an issue, please:**

- Check if the issue already exists in our [issue tracker](https://github.com/Real1tyy/BasesImprovements/issues)
- Include your Obsidian version and operating system
- Provide steps to reproduce the problem
- Share relevant error messages or screenshots
- Include your base query if relevant

## 💡 Feature Requests

Have an idea for a new feature? We'd love to hear it! **[Submit a feature request](https://github.com/Real1tyy/BasesImprovements/issues/new)** with:

- Clear description of the feature
- Use case or problem it solves
- Any mockups or examples (if applicable)
- How it would integrate with existing features

## 🔧 Contributing Code

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/BasesImprovements.git
   cd BasesImprovements
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

### Development Workflow

1. **Make your changes** in the `src/` directory

2. **Test your changes**:
   ```bash
   pnpm dev  # Development build with hot reload
   ```

3. **Run quality checks**:
   ```bash
   pnpm check:fix  # Lint and format
   pnpm typecheck  # Type checking
   pnpm test       # Run tests
   ```

4. **Build the plugin**:
   ```bash
   pnpm build
   ```

5. **Test manually** in Obsidian:
   - Copy `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/bases-improvements/`
   - Reload Obsidian
   - Test your changes thoroughly

### Code Quality Standards

This project uses:

- **TypeScript** for type safety
- **Biome** for linting and formatting
- **Vitest** for testing
- **ESBuild** for fast builds

**Before submitting:**

- ✅ All tests pass (`pnpm test`)
- ✅ No linting errors (`pnpm check:fix`)
- ✅ No TypeScript errors (`pnpm typecheck`)
- ✅ Code builds successfully (`pnpm build`)
- ✅ Manual testing completed in Obsidian

### Submitting a Pull Request

1. **Commit your changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```

2. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```

3. **Open a Pull Request** on GitHub with:
   - Clear description of changes
   - Reference to related issues (if any)
   - Screenshots or GIFs for UI changes
   - Test cases covered
   - Breaking changes (if any)

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear commit messages
- Update documentation if needed
- Add tests for new features
- Ensure all CI checks pass
- Respond to review feedback promptly

## 📝 Documentation Contributions

### Help Us Improve the Docs

Bases Improvements has **comprehensive documentation** covering features, configuration, and troubleshooting. If you spot something that's incorrect, outdated, or unclear, **we'd love your help!**

**How you can contribute:**

- **Spot an error?** Create a PR to fix it
- **Found unclear explanations?** Suggest improvements
- **Missing information?** Add what's needed
- **Better examples?** Share them with us

Documentation contributions are **highly appreciated** and help everyone in the community.

**Where to contribute:**

- Documentation source is in `docs-site/docs/`
- Edit pages directly on GitHub or submit a PR
- Follow the existing style and structure
- No contribution is too small — typo fixes are welcome!

### Documentation Structure

```
docs-site/
├── docs/
│   ├── index.md                    # Introduction
│   ├── installation.md             # Installation guide
│   ├── quickstart.md               # Quick start guide
│   ├── configuration.md            # Configuration reference
│   ├── troubleshooting.md          # Troubleshooting guide
│   ├── faq.md                      # FAQ
│   ├── contributing.md             # This file
│   ├── support.md                  # Support page
│   └── features/
│       ├── overview.md             # Features overview
│       ├── dynamic-filtering.md    # Dynamic filtering guide
│       └── embed-support.md        # Embed support guide
├── docusaurus.config.ts            # Docusaurus configuration
├── sidebars.ts                     # Sidebar navigation
└── src/
    └── css/
        └── custom.css              # Custom styles
```

### Documentation Style Guide

- Use clear, concise language
- Include code examples where helpful
- Use headings to organize content
- Add emoji sparingly for visual interest (🎯 ✅ ❌)
- Use tables for comparisons
- Include screenshots for UI features
- Cross-reference related pages

## 🧪 Testing

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
```

### Writing Tests

Tests are located in the `tests/` directory:

```
tests/
├── base-detection.test.ts    # Base block detection tests
├── base-filter.test.ts       # Filter logic tests
├── css-utils.test.ts         # CSS utility tests
└── setup.ts                  # Test setup
```

**When adding features:**

1. Write tests for new functionality
2. Ensure existing tests still pass
3. Aim for high test coverage
4. Test edge cases and error conditions

### Test Guidelines

- Use descriptive test names
- Test one thing per test
- Use arrange-act-assert pattern
- Mock external dependencies
- Clean up after tests

## 🎨 Code Style

### TypeScript Guidelines

- Use TypeScript for all code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes
- Export types that might be reused

### Naming Conventions

- **Classes**: PascalCase (e.g., `BaseBlockProcessor`)
- **Functions**: camelCase (e.g., `updateFilters`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_DEBOUNCE_MS`)
- **Files**: kebab-case (e.g., `base-filter-input.ts`)

### Code Organization

- Keep files focused and single-purpose
- Extract reusable logic to utilities
- Use components for UI elements
- Separate concerns (detection, filtering, UI)
- Document complex logic with comments

## 🏗️ Project Structure

```
BasesImprovements/
├── src/
│   ├── main.ts                      # Main plugin class
│   ├── base-block-processor.ts      # Block processing logic
│   ├── base-detection.ts            # Block detection logic
│   ├── base-filter.ts               # Filter logic
│   ├── constants.ts                 # Constants
│   ├── components/
│   │   ├── base-filter-input.ts     # Filter input component
│   │   └── index.ts                 # Component exports
│   ├── core/
│   │   ├── settings-store.ts        # Settings management
│   │   └── index.ts                 # Core exports
│   ├── settings/
│   │   ├── settings-tab.ts          # Settings UI
│   │   └── index.ts                 # Settings exports
│   ├── types/
│   │   ├── settings.ts              # Settings types
│   │   └── index.ts                 # Type exports
│   └── utils/
│       ├── css-utils.ts             # CSS utilities
│       └── index.ts                 # Utility exports
├── tests/                           # Test files
├── docs-site/                       # Documentation site
├── styles.css                       # Plugin styles
├── manifest.json                    # Plugin manifest
├── esbuild.config.mjs              # Build configuration
├── tsconfig.json                    # TypeScript config
├── vitest.config.ts                # Test configuration
└── package.json                     # Dependencies
```

## 🤝 Getting Help

### Development Questions

- **Documentation**: Check the code documentation and comments
- **Architecture**: Review the project structure above
- **Obsidian API**: Check [Obsidian API docs](https://github.com/obsidianmd/obsidian-api)
- **Bases Plugin**: Review [Bases plugin source](https://github.com/SkepticMystic/bases)

### Community

- **GitHub Discussions**: Ask questions and discuss ideas
- **Issues**: Report bugs and request features
- **Pull Requests**: Submit code contributions

## 📋 Contribution Checklist

Before submitting a contribution:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code builds successfully
- [ ] Manual testing completed
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] PR description is complete

## 🙏 Thank You!

Every contribution, no matter how small, makes Bases Improvements better for everyone. Thank you for helping improve the plugin!

---

**Ready to contribute?** [Fork the repository](https://github.com/Real1tyy/BasesImprovements) and start making improvements!
