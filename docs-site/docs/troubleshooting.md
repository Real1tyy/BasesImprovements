---
sidebar_position: 5
---

# Troubleshooting

## Quick Fixes

1. Restart Obsidian
2. Check plugin is enabled
3. Update to latest version
4. Check console (Ctrl/Cmd + Shift + I)
5. Verify Bases plugin is installed

## Common Issues

### Input Not Appearing

- Check "Show Filter Input" is enabled
- Verify code fence language (default: `base`)
- Reload the note
- Restart Obsidian

### Filter Not Applying

- Wait for debounce (150ms) or press **Enter**
- Check console for errors
- Verify query syntax is valid
- Try a simple query first

### Embeds Not Working

- Enable "Target Embeds" in settings
- Verify `.base` file extension
- Check embed syntax: `![[query.base]]`
- Ensure file exists and is writable

### Performance Issues

- Increase debounce values (300-500ms)
- Disable embed support if not needed
- Simplify queries (use LIMIT)
- Check for plugin conflicts

### Filter Persists Across Notes

**This is expected for embeds!** Embeds modify the actual `.base` file.

**Solutions:**
- Clear filter when done
- Use inline blocks for independent filters
- Create separate `.base` files

## Advanced

### Check Plugin Files

```
.obsidian/plugins/bases-improvements/
├── main.js
├── manifest.json
├── styles.css
└── data.json
```

### Test for Conflicts

1. Disable all other plugins
2. Enable only Bases + Bases Improvements
3. Test functionality
4. Re-enable plugins one by one

### Debug Mode

Open Developer Console (Ctrl/Cmd + Shift + I) → Console tab → Look for errors

## Getting Help

**Before reporting:**
- Obsidian version
- Plugin version
- Operating system
- Steps to reproduce
- Console errors

**Report:** [GitHub Issues](https://github.com/Real1tyy/BasesImprovements/issues)
