---
sidebar_position: 2
---

# Installation

Bases Improvements can be installed through several methods. Choose the one that works best for you.

## 📦 Method 1: Community Plugins (Recommended)

Once approved, Bases Improvements will be available in the Obsidian Community Plugins directory:

1. Open **Settings** → **Community plugins**
2. Click **Browse** to open the community plugins browser
3. Search for **"Bases Improvements"**
4. Click **Install**
5. Click **Enable** to activate the plugin

## 🔧 Method 2: BRAT (Beta Testing)

For early access to new features and beta versions:

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat) if you haven't already
2. Open **Settings** → **BRAT**
3. Click **Add Beta Plugin**
4. Enter the repository URL: `Real1tyy/BasesImprovements`
5. Click **Add Plugin**
6. The plugin will appear in your Community Plugins list
7. Enable it from there

## 📥 Method 3: Manual Installation

For manual installation from GitHub releases:

1. Download the latest `main.js`, `manifest.json`, and `styles.css` from the [Releases page](https://github.com/Real1tyy/BasesImprovements/releases)
2. Navigate to your vault's `.obsidian/plugins/` folder
3. Create a new folder named `bases-improvements`
4. Copy the downloaded files into this folder
5. Reload Obsidian or restart the app
6. Enable the plugin in **Settings** → **Community plugins**

## 🛠️ Method 4: From Source (Development)

For developers who want to build from source:

1. Clone the repository into your vault's `.obsidian/plugins/` directory:
   ```bash
   cd /path/to/vault/.obsidian/plugins/
   git clone https://github.com/Real1tyy/BasesImprovements.git bases-improvements
   cd bases-improvements
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the plugin:
   ```bash
   pnpm build
   ```

4. Reload Obsidian or restart the app
5. Enable the plugin in **Settings** → **Community plugins**

### Development Mode

For active development with hot reload:

```bash
pnpm dev
```

This will watch for file changes and automatically rebuild the plugin.

## ✅ Verification

After installation, verify everything is working:

1. Open **Settings** → **Community plugins**
2. Confirm **Bases Improvements** is listed and enabled
3. You should see a **Bases Improvements** settings tab in the main Settings page
4. Create a test note with a base block:

````markdown
```base
FROM notes
SELECT title
```
````

5. You should see a search input appear above the base block

## 🔄 Updating

### Community Plugins

Updates will be available automatically through the Community Plugins interface. Simply click **Update** when a new version is available.

### BRAT

BRAT will automatically check for updates. You can manually check by:

1. Opening **Settings** → **BRAT**
2. Clicking **Check for updates**
3. Updating if a new version is available

### Manual Installation

Download the latest release files and replace the existing files in your plugin folder.

### From Source

Pull the latest changes and rebuild:

```bash
git pull
pnpm install
pnpm build
```

## 🐛 Troubleshooting

If you encounter issues during installation:

- **Plugin not appearing**: Make sure you've restarted Obsidian after installation
- **Settings tab missing**: Check that the plugin is enabled in Community Plugins
- **Search inputs not appearing**: Verify that the Bases plugin is installed and you have base blocks in your note
- **Errors in console**: Check the Developer Console (Ctrl/Cmd + Shift + I) for error messages

For more help, see the [Troubleshooting Guide](/troubleshooting) or [open an issue on GitHub](https://github.com/Real1tyy/BasesImprovements/issues).

## 📋 Prerequisites

Before using Bases Improvements, make sure you have:

- **Obsidian 1.4.16+** installed
- **Bases Plugin** installed and enabled (this plugin enhances Bases, so you need it!)

## 🎯 Next Steps

Once installed, check out the [Quick Start Guide](/quickstart) to configure and start using Bases Improvements!
