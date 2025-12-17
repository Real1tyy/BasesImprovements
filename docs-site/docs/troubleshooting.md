---
sidebar_position: 5
---

# Troubleshooting

Having issues with Bases Improvements? This guide covers common problems and their solutions.

## 🔍 General Troubleshooting Steps

Before diving into specific issues, try these general steps:

1. **Restart Obsidian** - Many issues are resolved with a simple restart
2. **Check plugin is enabled** - Settings → Community Plugins → Bases Improvements
3. **Update to latest version** - Check for plugin updates
4. **Check console for errors** - Open Developer Console (Ctrl/Cmd + Shift + I)
5. **Disable other plugins** - Test if there's a conflict with another plugin
6. **Check Bases plugin** - Ensure the Bases plugin is installed and working

---

## 🐛 Common Issues

### Search Input Not Appearing

**Symptoms:**
- No search input above base code blocks
- Plugin is enabled but nothing happens

**Solutions:**

1. **Check "Show Filter Input" setting**
   - Settings → Bases Improvements → Show Filter Input
   - Ensure it's enabled (✅)

2. **Verify code fence language**
   - Check Settings → Bases Improvements → Code Fence Language
   - Default is `base` - make sure your blocks use this language
   - Example: ` ```base ` not ` ```bases `

3. **Reload the note**
   - Close and reopen the note
   - Or switch to another note and back

4. **Check if Bases plugin is installed**
   - The plugin enhances Bases, so Bases must be installed
   - Settings → Community Plugins → Search for "Bases"

5. **Restart Obsidian**
   - Sometimes a restart is needed after enabling the plugin

---

### Filter Not Applying

**Symptoms:**
- Search input appears but typing doesn't update the query
- Query doesn't change when typing

**Solutions:**

1. **Wait for debounce delay**
   - Default is 150ms - wait a moment after typing
   - Or press **Enter** to apply immediately

2. **Check console for errors**
   - Open Developer Console (Ctrl/Cmd + Shift + I)
   - Look for red error messages
   - Report errors on GitHub if found

3. **Verify query syntax**
   - Make sure your base query uses valid Bases syntax
   - Test the query without filtering first

4. **Check file permissions**
   - For embeds, ensure the `.base` file is writable
   - Check vault folder permissions

5. **Try a simple query**
   - Test with a minimal query:
     ````markdown
     ```base
     FROM notes
     SELECT title
     ```
     ````

---

### Embedded Queries Not Working

**Symptoms:**
- Inline blocks work, but embeds don't show search inputs
- Embedded `.base` files don't get filtered

**Solutions:**

1. **Check "Target Embeds" setting**
   - Settings → Bases Improvements → Target Embeds
   - Ensure it's enabled (✅)

2. **Verify file extension**
   - File must have `.base` extension
   - Example: `query.base` not `query.txt`

3. **Check embed syntax**
   - Correct: `![[query.base]]`
   - Incorrect: `![[query]]` or `[[query.base]]`

4. **Verify file exists**
   - Make sure the `.base` file actually exists in your vault
   - Check the file path is correct

5. **Reload the note**
   - Close and reopen the note with the embed

---

### Performance Issues

**Symptoms:**
- Obsidian feels slow or laggy
- Typing in search inputs is delayed
- Note loading is slow

**Solutions:**

1. **Increase debounce values**
   - Settings → Bases Improvements
   - Increase "Input Debounce" to 300-500ms
   - Increase "Update Debounce" to 300-500ms

2. **Disable embed support**
   - Settings → Bases Improvements → Target Embeds
   - Disable if you don't use embedded queries

3. **Simplify queries**
   - Use LIMIT clauses to reduce result sets
   - Add specific WHERE clauses to narrow searches
   - Avoid complex nested queries

4. **Check for plugin conflicts**
   - Disable other plugins temporarily
   - Test if performance improves
   - Re-enable plugins one by one to find the culprit

5. **Reduce base blocks per note**
   - Having many base blocks in one note can impact performance
   - Consider splitting into multiple notes

---

### Filter Persists Across Notes

**Symptoms:**
- Filtering in one note affects other notes
- Filter doesn't clear when expected

**Explanation:**

This is **expected behavior** for embedded `.base` files! When you filter an embedded query, the actual `.base` file is modified, which affects all notes embedding that file.

**Solutions:**

1. **Clear the filter when done**
   - Clear the search input to remove the filter
   - This updates the `.base` file back to original state

2. **Use inline blocks for independent filters**
   - If you want separate filters per note, use inline code blocks instead of embeds

3. **Create separate `.base` files**
   - Instead of sharing one `.base` file, create separate files for different use cases

---

### Query Syntax Errors

**Symptoms:**
- Base query shows errors after filtering
- WHERE clause looks malformed
- Query doesn't execute properly

**Solutions:**

1. **Check original query syntax**
   - Ensure your base query is valid before filtering
   - Test without the plugin enabled

2. **Report unusual syntax**
   - If the plugin mishandles your query syntax, report it on GitHub
   - Include the original query and the filtered result

3. **Use standard WHERE clause format**
   - The plugin expects standard Bases query syntax
   - Unusual formatting might not be handled correctly

4. **Check for special characters**
   - Special characters in search terms might cause issues
   - Try simple alphanumeric searches first

---

### Settings Not Saving

**Symptoms:**
- Changes to settings don't persist
- Settings reset after reloading Obsidian

**Solutions:**

1. **Check file permissions**
   - Ensure `.obsidian/plugins/bases-improvements/` is writable
   - Check vault folder permissions

2. **Check for sync conflicts**
   - If using iCloud, Dropbox, or other sync:
     - Ensure `data.json` isn't being overwritten
     - Add `.obsidian/plugins/bases-improvements/data.json` to sync exclusions if needed

3. **Manually edit settings file**
   - Close Obsidian
   - Edit `.obsidian/plugins/bases-improvements/data.json`
   - Reopen Obsidian

4. **Reinstall the plugin**
   - Disable and remove the plugin
   - Reinstall from Community Plugins or manually

---

### Plugin Not Loading

**Symptoms:**
- Plugin doesn't appear in Community Plugins
- Can't enable the plugin
- No settings tab for the plugin

**Solutions:**

1. **Check installation**
   - Verify files exist in `.obsidian/plugins/bases-improvements/`
   - Required files: `main.js`, `manifest.json`, `styles.css`

2. **Check manifest.json**
   - Ensure the file is valid JSON
   - Check for corruption or syntax errors

3. **Check Obsidian version**
   - Plugin requires Obsidian 1.4.16+
   - Update Obsidian if needed

4. **Check console for errors**
   - Open Developer Console (Ctrl/Cmd + Shift + I)
   - Look for errors related to "bases-improvements"

5. **Reinstall the plugin**
   - Delete the plugin folder
   - Reinstall from Community Plugins or manually

---

## 🔧 Advanced Troubleshooting

### Enable Debug Mode

To get more detailed error information:

1. Open Developer Console (Ctrl/Cmd + Shift + I)
2. Go to the **Console** tab
3. Look for messages prefixed with `[Bases Improvements]`
4. Copy error messages when reporting issues

### Check Plugin Files

Verify the plugin files are intact:

```
.obsidian/plugins/bases-improvements/
├── main.js          (should exist and be non-empty)
├── manifest.json    (should be valid JSON)
├── styles.css       (should exist)
└── data.json        (created after first run)
```

### Test with Minimal Setup

Create a minimal test case:

1. Create a new vault
2. Install only Bases and Bases Improvements
3. Create a simple base block
4. Test if filtering works

If it works in the minimal setup, the issue is likely a conflict with another plugin or vault-specific configuration.

### Check for Conflicts

Common plugin conflicts:

- **Dataview**: Generally compatible, but custom code fence languages might conflict
- **Templater**: Should be compatible
- **Custom CSS**: Might affect input styling
- **Other query plugins**: Might interfere with base block detection

To test for conflicts:

1. Disable all other plugins
2. Enable only Bases and Bases Improvements
3. Test functionality
4. Re-enable other plugins one by one

---

## 📊 Error Messages

### "Cannot read property 'contains' of undefined"

**Cause:** The Bases plugin isn't properly executing the query

**Solution:**
- Ensure Bases plugin is installed and enabled
- Check that your query syntax is valid
- Try the query without filtering first

### "File not found"

**Cause:** Embedded `.base` file doesn't exist or path is wrong

**Solution:**
- Verify the `.base` file exists
- Check the file path in the embed syntax
- Ensure file extension is `.base`

### "Permission denied"

**Cause:** Plugin can't write to files (for embeds)

**Solution:**
- Check file permissions
- Ensure vault folder is writable
- Check if file is open in another program

---

## 🆘 Getting Help

If you've tried everything and still have issues:

### 1. Check Existing Issues

Search [GitHub Issues](https://github.com/Real1tyy/BasesImprovements/issues) to see if others have reported the same problem.

### 2. Gather Information

Before reporting an issue, collect:

- Obsidian version
- Plugin version
- Operating system
- Steps to reproduce the problem
- Error messages from console
- Screenshots if applicable

### 3. Report the Issue

Create a new issue on [GitHub](https://github.com/Real1tyy/BasesImprovements/issues/new) with:

- Clear description of the problem
- Steps to reproduce
- Expected behavior vs actual behavior
- System information
- Error messages and screenshots

### 4. Community Help

Ask in:

- Obsidian Discord server
- Obsidian Forum
- Reddit r/ObsidianMD

---

## 📚 Additional Resources

- **[FAQ](/faq)** - Common questions and answers
- **[Configuration](/configuration)** - Detailed settings guide
- **[GitHub Issues](https://github.com/Real1tyy/BasesImprovements/issues)** - Known issues and bug reports
- **[Bases Plugin Docs](https://github.com/SkepticMystic/bases)** - Documentation for the Bases plugin

---

**Still stuck?** Don't hesitate to [open an issue on GitHub](https://github.com/Real1tyy/BasesImprovements/issues/new)—we're here to help!
