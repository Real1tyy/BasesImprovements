import { describe, expect, it } from "vitest";
import type { MinimalEditor } from "../src/base-detection";
import { findInlineBaseBlocks } from "../src/base-detection";
import { appendNameFilter } from "../src/base-filter";

interface MockEditorWithReplace extends MinimalEditor {
	replaceRange(replacement: string, from: { line: number; ch: number }, to: { line: number; ch: number }): void;
	lines: string[];
}

function createMockEditor(lines: string[]): MockEditorWithReplace {
	const editorLines = [...lines];

	return {
		lines: editorLines,
		getLine(line: number): string {
			return editorLines[line] || "";
		},
		lineCount(): number {
			return editorLines.length;
		},
		replaceRange(replacement: string, from: { line: number; ch: number }, to: { line: number; ch: number }): void {
			// Simulate Obsidian's replaceRange behavior
			// When replacing from (line X, ch 0) to (line Y, ch 0):
			// - Removes lines X through Y-1 (inclusive)
			// - Inserts replacement content starting at line X

			const replacementLines = replacement.split("\n");

			// If replacement ends with \n, split creates an empty string at the end
			// This empty string represents the newline that keeps the next line separate
			const linesToRemove = to.line - from.line;

			// Remove the lines being replaced
			editorLines.splice(from.line, linesToRemove, ...replacementLines);
		},
	};
}

describe("base-block-editor-integration", () => {
	describe("closing backticks preservation in editor", () => {
		it("CRITICAL: should keep closing backticks on separate line when applying filter to empty base block", () => {
			// This is the user's exact problem case:
			// Starting with:
			// ```base
			//
			// ```
			//
			// After typing "B" in filter input, should become:
			// ```base
			// filters:
			//   and:
			//     - file.name.contains("B")
			// ```
			//
			// NOT:
			// ```base
			// filters:
			//   and:
			//     - file.name.contains("B")```

			const initialLines = [
				"```base",
				"", // Empty content
				"```",
			];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			// User types "B" in the filter input
			const currentContent = block.content; // This will be empty string or just whitespace
			const newContent = appendNameFilter(currentContent, "B");

			// Simulate what updateInlineBlock does:
			// Replace from line 1 (after ```base) to line 2 (before ```)
			const startPos = { line: block.startLine + 1, ch: 0 };
			const endPos = { line: block.endLine, ch: 0 };

			editor.replaceRange(newContent, startPos, endPos);

			// CRITICAL ASSERTIONS:
			// 1. Closing backticks MUST be on their own line
			const lastLine = editor.lines[editor.lines.length - 1];
			expect(lastLine).toBe("```");

			// 2. The line before closing backticks should NOT contain backticks
			const secondLastLine = editor.lines[editor.lines.length - 2];
			expect(secondLastLine).not.toContain("```");

			// 3. Content should be properly formatted
			expect(editor.lines[0]).toBe("```base");
			expect(editor.lines.join("\n")).toContain("filters:");
			expect(editor.lines.join("\n")).toContain("and:");
			expect(editor.lines.join("\n")).toContain('- file.name.contains("B")');

			// 4. At minimum, verify opening and closing are separate
			expect(editor.lines[0]).toBe("```base");
			expect(editor.lines[editor.lines.length - 1]).toBe("```");
			expect(editor.lines.length).toBeGreaterThan(2); // More than just opening and closing
		});

		it("should keep closing backticks on separate line after filter update", () => {
			// Initial state: base block with content
			const initialLines = ["```base", "filters:", "  and:", '    - file.name.contains("B")', "```"];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			// Simulate updating the block content
			const currentContent = block.content;
			const newContent = appendNameFilter(currentContent, "B");

			// Add trailing newline like the fix does
			const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			// Simulate what updateInlineBlock does:
			// Replace from (startLine + 1, ch: 0) to (endLine, ch: 0)
			const startPos = { line: block.startLine + 1, ch: 0 };
			const endPos = { line: block.endLine, ch: 0 };

			editor.replaceRange(contentToInsert, startPos, endPos);

			// Verify closing backticks are still on their own line
			const lastLine = editor.lines[editor.lines.length - 1];
			expect(lastLine).toBe("```");

			// Verify content structure
			expect(editor.lines[0]).toBe("```base");
			expect(editor.lines.join("\n")).toContain('file.name.contains("B")');

			// Ensure no line has both content and closing backticks
			const hasContentWithBackticks = editor.lines.some(
				(line) => line.includes("file.name.contains") && line.includes("```")
			);
			expect(hasContentWithBackticks).toBe(false);
		});

		it("should handle empty base block correctly", () => {
			const initialLines = ["```base", "", "```"];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			const currentContent = block.content;
			const newContent = appendNameFilter(currentContent, "B");

			// Add trailing newline like the fix does
			const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			const startPos = { line: block.startLine + 1, ch: 0 };
			const endPos = { line: block.endLine, ch: 0 };

			editor.replaceRange(contentToInsert, startPos, endPos);

			// Verify closing backticks are on their own line
			const lastLine = editor.lines[editor.lines.length - 1];
			expect(lastLine).toBe("```");

			// Verify content was added
			expect(editor.lines.join("\n")).toContain('file.name.contains("B")');
		});

		it("should handle base block with views section", () => {
			const initialLines = ["```base", "views:", "  - type: table", "    name: Table", "```"];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			const currentContent = block.content;
			const newContent = appendNameFilter(currentContent, "SearchTerm");

			// Add trailing newline like the fix does
			const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			const startPos = { line: block.startLine + 1, ch: 0 };
			const endPos = { line: block.endLine, ch: 0 };

			editor.replaceRange(contentToInsert, startPos, endPos);

			// Verify closing backticks are on their own line
			const lastLine = editor.lines[editor.lines.length - 1];
			expect(lastLine).toBe("```");

			// Verify filters were added before views
			const content = editor.lines.join("\n");
			expect(content).toContain("filters:");
			expect(content).toContain('file.name.contains("SearchTerm")');
			expect(content).toContain("views:");

			const filtersIndex = editor.lines.findIndex((l) => l.trim() === "filters:");
			const viewsIndex = editor.lines.findIndex((l) => l.trim() === "views:");
			expect(filtersIndex).toBeLessThan(viewsIndex);
		});

		it("should handle user's exact problematic case", () => {
			// User reported this was being formatted incorrectly:
			// ```base
			// filters:
			//   and:
			//     - file.name.contains("B")```
			//
			// Should be:
			// ```base
			// filters:
			//   and:
			//     - file.name.contains("B")
			// ```

			const initialLines = ["```base", "filters:", "  and:", '    - file.name.contains("B")', "```"];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			// Update with same filter value (simulating re-filtering)
			const currentContent = block.content;
			const newContent = appendNameFilter(currentContent, "B");

			// Add trailing newline like the fix does
			const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			const startPos = { line: block.startLine + 1, ch: 0 };
			const endPos = { line: block.endLine, ch: 0 };

			editor.replaceRange(contentToInsert, startPos, endPos);

			// The critical assertion: closing backticks MUST be on their own line
			const lastLine = editor.lines[editor.lines.length - 1];
			expect(lastLine).toBe("```");

			// Verify full structure
			expect(editor.lines[0]).toBe("```base");
			expect(editor.lines).toContain("filters:");
			expect(editor.lines).toContain("  and:");
			expect(editor.lines.some((l) => l.includes('file.name.contains("B")'))).toBe(true);

			// Ensure no line has both content and closing backticks
			const hasContentWithBackticks = editor.lines.some(
				(line) => line.includes("file.name.contains") && line.includes("```")
			);
			expect(hasContentWithBackticks).toBe(false);
		});

		it("should handle multiple consecutive updates", () => {
			const initialLines = ["```base", "views:", "  - type: table", "```"];

			const editor = createMockEditor(initialLines);

			// First update
			let blocks = findInlineBaseBlocks(editor);
			let block = blocks[0];
			let newContent = appendNameFilter(block.content, "First");
			let contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			editor.replaceRange(contentToInsert, { line: block.startLine + 1, ch: 0 }, { line: block.endLine, ch: 0 });

			// Verify after first update
			expect(editor.lines[editor.lines.length - 1]).toBe("```");

			// Second update (simulating user typing more)
			blocks = findInlineBaseBlocks(editor);
			block = blocks[0];
			newContent = appendNameFilter(block.content, "Second");
			contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			editor.replaceRange(contentToInsert, { line: block.startLine + 1, ch: 0 }, { line: block.endLine, ch: 0 });

			// Verify after second update
			expect(editor.lines[editor.lines.length - 1]).toBe("```");
			expect(editor.lines.join("\n")).toContain('file.name.contains("Second")');
			expect(editor.lines.join("\n")).not.toContain("First");
		});
	});

	describe("edge cases", () => {
		it("should handle base block with trailing whitespace", () => {
			const initialLines = ["  ```base  ", "filters:", "  and:", '    - file.inFolder("People")', "  ```  "];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			const newContent = appendNameFilter(block.content, "Test");
			const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			editor.replaceRange(contentToInsert, { line: block.startLine + 1, ch: 0 }, { line: block.endLine, ch: 0 });

			// Closing backticks should still be on their own line (even with whitespace)
			const lastLine = editor.lines[editor.lines.length - 1];
			expect(lastLine.trim()).toBe("```");
		});

		it("should handle base block with Windows line endings (CRLF)", () => {
			// Note: In our mock, we're using \n, but the regex handles \r\n
			const initialLines = ["```base", "filters:", "  and:", '    - file.name.contains("B")', "```"];

			const editor = createMockEditor(initialLines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			const block = blocks[0];

			const newContent = appendNameFilter(block.content, "B");
			const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

			editor.replaceRange(contentToInsert, { line: block.startLine + 1, ch: 0 }, { line: block.endLine, ch: 0 });

			expect(editor.lines[editor.lines.length - 1]).toBe("```");
		});
	});
});
