import { describe, expect, it } from "vitest";
import { appendNameFilter } from "../src/base-filter";

describe("base-block-formatting", () => {
	describe("closing backticks preservation", () => {
		it("should preserve trailing newline so closing backticks stay on separate line", () => {
			const content = `filters:
  and:
    - file.name.contains("B")`;

			const result = appendNameFilter(content, "B");

			// The result should NOT end with the content on the same line as backticks
			// When this content is inserted between opening and closing backticks,
			// the closing backticks should remain on their own line

			// Verify content doesn't have trailing newline (that's handled by the editor replacement)
			expect(result).toBe(`filters:
  and:
    - file.name.contains("B")`);
		});

		it("should handle content with existing trailing newline", () => {
			const content = `filters:
  and:
    - file.name.contains("B")
`;

			const result = appendNameFilter(content, "B");

			// Should preserve the structure
			expect(result).toContain('file.name.contains("B")');
		});

		it("should work with empty base block", () => {
			const content = ``;

			const result = appendNameFilter(content, "B");

			// Empty content gets a leading newline, which is fine
			expect(result).toBe(`
filters:
  and:
    - file.name.contains("B")`);
		});

		it("should work with views section", () => {
			const content = `views:
  - type: table
    name: Table`;

			const result = appendNameFilter(content, "B");

			// Should insert filters before views
			const lines = result.split("\n");
			const filtersIndex = lines.findIndex((l) => l.trim() === "filters:");
			const viewsIndex = lines.findIndex((l) => l.trim() === "views:");

			expect(filtersIndex).toBeLessThan(viewsIndex);
			expect(result).toContain('file.name.contains("B")');
		});

		it("should handle user's exact example", () => {
			// User had:
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

			const content = `filters:
  and:
    - file.name.contains("B")`;

			const result = appendNameFilter(content, "B");

			// Verify the content structure is correct
			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('- file.name.contains("B")');

			// Verify no trailing content that would merge with closing backticks
			const lines = result.split("\n");
			const lastLine = lines[lines.length - 1];
			expect(lastLine.trim()).not.toBe("```");
			expect(lastLine).toContain('file.name.contains("B")');
		});

		it("should handle multiple filters with proper line endings", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name != "People"`;

			const result = appendNameFilter(content, "John");

			const lines = result.split("\n");
			expect(lines.length).toBeGreaterThan(2);

			// Last line should be a filter, not empty or backticks
			const lastLine = lines[lines.length - 1];
			expect(lastLine.trim()).toBeTruthy();
			expect(lastLine).not.toContain("```");
		});

		it("should handle content with leading empty lines", () => {
			const content = `

filters:
  and:
    - file.name.contains("B")`;

			const result = appendNameFilter(content, "B");

			// Should preserve structure
			expect(result).toContain("filters:");
			expect(result).toContain('file.name.contains("B")');
		});

		it("should handle content with trailing empty lines", () => {
			const content = `filters:
  and:
    - file.name.contains("B")


`;

			const result = appendNameFilter(content, "B");

			// Should preserve filters
			expect(result).toContain("filters:");
			expect(result).toContain('file.name.contains("B")');
		});
	});

	describe("editor replacement simulation", () => {
		it("should simulate correct editor replacement behavior", () => {
			// Simulate what happens in the editor:
			// Line 0: ```base
			// Line 1-3: content (filters, and, filter line)
			// Line 4: ```

			const editorLines = ["```base", "filters:", "  and:", '    - file.name.contains("B")', "```"];

			// Content between opening and closing backticks (lines 1-3)
			const content = editorLines.slice(1, -1).join("\n");

			// Apply filter
			const newContent = appendNameFilter(content, "B");

			// Replace lines 1-3 with newContent
			const newContentLines = newContent.split("\n");
			const updatedEditor = ["```base", ...newContentLines, "```"];

			// Verify closing backticks are on their own line
			expect(updatedEditor[updatedEditor.length - 1]).toBe("```");
			expect(updatedEditor[updatedEditor.length - 2]).not.toBe("```");
			expect(updatedEditor[updatedEditor.length - 2]).toContain("file.name.contains");
		});

		it("should handle empty content replacement", () => {
			const editorLines = ["```base", "", "```"];

			const content = editorLines.slice(1, -1).join("\n");
			const newContent = appendNameFilter(content, "B");

			const newContentLines = newContent.split("\n");
			const updatedEditor = ["```base", ...newContentLines, "```"];

			// Verify structure
			expect(updatedEditor[0]).toBe("```base");
			expect(updatedEditor[updatedEditor.length - 1]).toBe("```");
			expect(updatedEditor.join("\n")).toContain('file.name.contains("B")');
		});
	});
});
