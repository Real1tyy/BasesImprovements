import { describe, expect, it } from "vitest";
import { appendNameFilter, extractFilterValue, findBaseBlocks, type MinimalEditor } from "../src/main";
import { createMockEditor } from "./mocks/obsidian";

function mockEditor(lines: string[]): MinimalEditor {
	return createMockEditor(lines) as MinimalEditor;
}

describe("Base Block Detection", () => {
	describe("findBaseBlocks", () => {
		it("should detect a simple base block", () => {
			const lines = [
				"# Some heading",
				"",
				"```base",
				"filters:",
				"  and:",
				'    - file.inFolder("People")',
				'    - file.name != "People"',
				"```",
				"",
				"Some more text",
			];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].startLine).toBe(2);
			expect(blocks[0].endLine).toBe(7);
			expect(blocks[0].content).toContain('file.inFolder("People")');
		});

		it("should detect multiple base blocks", () => {
			const lines = ["```base", "content1", "```", "", "```base", "content2", "```"];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			expect(blocks).toHaveLength(2);
			expect(blocks[0].startLine).toBe(0);
			expect(blocks[0].endLine).toBe(2);
			expect(blocks[1].startLine).toBe(4);
			expect(blocks[1].endLine).toBe(6);
		});

		it("should handle base block with leading/trailing whitespace", () => {
			const lines = [
				"  ```base  ", // with whitespace
				"content",
				"  ```  ", // with whitespace
			];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
		});

		it("should return empty array when no base blocks exist", () => {
			const lines = ["# Just a heading", "Some regular text", "```javascript", "const x = 1;", "```"];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			expect(blocks).toHaveLength(0);
		});

		it("should handle unclosed base block gracefully", () => {
			const lines = ["```base", "content without closing", "more content"];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			// Unclosed blocks should not be detected
			expect(blocks).toHaveLength(0);
		});

		it("should detect base block from user's actual example", () => {
			const lines = [
				"---",
				"Segment: Cold Approach",
				"City: Brno",
				"First Contact: 2025-12-01",
				"Second Contact:",
				"Position:",
				"Status:",
				"Told About Business:",
				"Urgency:",
				"Ambitions:",
				"Dreams:",
				"Born On:",
				"Original City:",
				"Last Contact:",
				"Contact Channel:",
				"Status Business:",
				"Next Step:",
				"Likability:",
				"Social Energy:",
				"Reliability:",
				"Personality Type :",
				"Relationship Goal:",
				"Interests:",
				"History Note:",
				"Values:",
				"---",
				"",
				"",
				"",
				"```base",
				"",
				"",
				"",
				"filters:",
				"	and:",
				'		- file.inFolder("People")',
				'		- file.name != "People"',
				"",
				"",
				"```",
			];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].startLine).toBe(29); // Line where ```base starts
			expect(blocks[0].content).toContain('file.inFolder("People")');
		});

		it("should not confuse base with other code blocks", () => {
			const lines = ["```javascript", "const base = 'test';", "```", "", "```base", "actual base content", "```"];

			const editor = mockEditor(lines);
			const blocks = findBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].startLine).toBe(4);
			expect(blocks[0].content).toContain("actual base content");
		});
	});

	describe("extractFilterValue", () => {
		it("should extract filter value with double quotes", () => {
			const content = 'WHERE file.name.contains("test-value")';
			const result = extractFilterValue(content);
			expect(result).toBe("test-value");
		});

		it("should extract filter value with single quotes", () => {
			const content = "WHERE file.name.contains('test-value')";
			const result = extractFilterValue(content);
			expect(result).toBe("test-value");
		});

		it("should return empty string when no filter present", () => {
			const content = "filters:\n  and:\n    - file.inFolder('People')";
			const result = extractFilterValue(content);
			expect(result).toBe("");
		});

		it("should handle complex content with filter", () => {
			const content = `
filters:
  and:
    - file.inFolder("People")
    - file.name.contains("John")
`;
			const result = extractFilterValue(content);
			expect(result).toBe("John");
		});
	});

	describe("appendNameFilter", () => {
		it("should append filter to and: section with space indentation", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name != "People"
`;
			const result = appendNameFilter(content, "John");
			expect(result).toContain('file.name.contains("John")');
			expect(result).toContain('file.inFolder("People")');
			expect(result).toContain('file.name != "People"');
			// Check indentation matches (4 spaces)
			const filterLine = result.split("\n").find((l) => l.includes("file.name.contains"));
			expect(filterLine).toBe('    - file.name.contains("John")');
		});

		it("should replace existing filter value", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name.contains("OldValue")
`;
			const result = appendNameFilter(content, "NewValue");
			expect(result).toContain('file.name.contains("NewValue")');
			expect(result).not.toContain("OldValue");
		});

		it("should remove filter when value is empty", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name.contains("John")
`;
			const result = appendNameFilter(content, "");
			expect(result).not.toContain("file.name.contains");
			expect(result).toContain('file.inFolder("People")');
		});

		it("should preserve views section after filters", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name != "People"
views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "Adam");
			expect(result).toContain('file.name.contains("Adam")');
			expect(result).toContain("views:");
			expect(result).toContain("type: table");
			expect(result).toContain("name: Table");

			// Verify views section comes after the filter
			const lines = result.split("\n");
			const filterIndex = lines.findIndex((l) => l.includes("file.name.contains"));
			const viewsIndex = lines.findIndex((l) => l.trim() === "views:");
			expect(viewsIndex).toBeGreaterThan(filterIndex);
		});

		it("should insert filter before views section", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name != "People"
views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "Test");
			const lines = result.split("\n");

			const nameContainsIndex = lines.findIndex((l) => l.includes("file.name.contains"));
			const viewsIndex = lines.findIndex((l) => l.trim() === "views:");

			// Filter should be after existing filters but before views
			expect(nameContainsIndex).toBeGreaterThan(0);
			expect(nameContainsIndex).toBeLessThan(viewsIndex);
		});

		it("should maintain proper indentation with spaces", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
`;
			const result = appendNameFilter(content, "Test");
			const filterLine = result.split("\n").find((l) => l.includes("file.name.contains"));
			expect(filterLine).toMatch(/^ {4}- file\.name\.contains/); // 4 spaces
		});

		it("should maintain proper indentation with tabs", () => {
			const content = `filters:
\tand:
\t\t- file.inFolder("People")
`;
			const result = appendNameFilter(content, "Test");
			const filterLine = result.split("\n").find((l) => l.includes("file.name.contains"));
			expect(filterLine).toMatch(/^\t\t- file\.name\.contains/); // 2 tabs
		});

		it("should create filters section when only views exist", () => {
			const content = `views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "Adam");

			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('file.name.contains("Adam")');
			expect(result).toContain("views:");
			expect(result).toContain("type: table");

			// Verify filters comes before views
			const lines = result.split("\n");
			const filtersIndex = lines.findIndex((l) => l.trim() === "filters:");
			const viewsIndex = lines.findIndex((l) => l.trim() === "views:");
			expect(filtersIndex).toBeLessThan(viewsIndex);
		});

		it("should create filters section in empty base block", () => {
			const content = ``;
			const result = appendNameFilter(content, "Test");

			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('file.name.contains("Test")');
		});

		it("should create filters section with only whitespace content", () => {
			const content = `

`;
			const result = appendNameFilter(content, "Test");

			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('file.name.contains("Test")');
		});

		it("should handle base block with views only (user example)", () => {
			const content = `
views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "SearchTerm");

			// Should have filters section created
			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('file.name.contains("SearchTerm")');

			// Views should still be there
			expect(result).toContain("views:");
			expect(result).toContain("type: table");

			// Filters should come before views
			const lines = result.split("\n");
			const filtersIndex = lines.findIndex((l) => l.trim() === "filters:");
			const viewsIndex = lines.findIndex((l) => l.trim() === "views:");
			expect(filtersIndex).toBeLessThan(viewsIndex);
		});

		it("should always remove old filter before adding new one", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name.contains("OldSearch")
    - file.name != "People"
views:
  - type: table
`;
			const result = appendNameFilter(content, "NewSearch");

			// Old filter should be gone
			expect(result).not.toContain("OldSearch");

			// New filter should be added at the end of and: section
			expect(result).toContain('file.name.contains("NewSearch")');

			// Other filters should remain
			expect(result).toContain('file.inFolder("People")');
			expect(result).toContain('file.name != "People"');

			// Views should remain
			expect(result).toContain("views:");
		});

		it("should remove filter and leave content intact when empty value", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name.contains("ToRemove")
views:
  - type: table
`;
			const result = appendNameFilter(content, "");

			expect(result).not.toContain("file.name.contains");
			expect(result).toContain('file.inFolder("People")');
			expect(result).toContain("views:");
			expect(result).toContain("type: table");
		});

		it("should handle filters: without and: section", () => {
			const content = `filters:
views:
  - type: table
`;
			const result = appendNameFilter(content, "Test");

			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('file.name.contains("Test")');
			expect(result).toContain("views:");
		});

		it("should use default indentation (4 spaces) when no existing filters", () => {
			const content = `views:
  - type: table
`;
			const result = appendNameFilter(content, "Test");
			const filterLine = result.split("\n").find((l) => l.includes("file.name.contains"));
			expect(filterLine).toBe('    - file.name.contains("Test")');
		});
	});
});
