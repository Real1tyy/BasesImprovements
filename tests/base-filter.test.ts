import { describe, expect, it } from "vitest";
import { appendNameFilter, extractFilterValue } from "../src/base-filter";

describe("base-filter", () => {
	describe("CRITICAL: no duplication bugs", () => {
		it("should NOT duplicate views section when adding filter", () => {
			const content = `views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "popel");

			// Count occurrences of "views:"
			const viewsCount = (result.match(/views:/g) || []).length;
			expect(viewsCount).toBe(1);

			// Count occurrences of "name: Table"
			const nameTableCount = (result.match(/name: Table/g) || []).length;
			expect(nameTableCount).toBe(1);

			expect(result).toContain("filters:");
			expect(result).toContain("and:");
			expect(result).toContain('file.name.contains("popel")');
		});

		it("should NOT duplicate any content when adding filter to views-only block", () => {
			const content = `views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "test");

			// The result should have exactly the same number of lines as original + 3 (filters:, and:, filter line)
			const originalLines = content.split("\n").length;
			const resultLines = result.split("\n").length;
			expect(resultLines).toBe(originalLines + 3);
		});

		it("should NOT duplicate content with leading empty lines", () => {
			const content = `

views:
  - type: table
    name: Table
`;
			const result = appendNameFilter(content, "test");

			const viewsCount = (result.match(/views:/g) || []).length;
			expect(viewsCount).toBe(1);

			const nameTableCount = (result.match(/name: Table/g) || []).length;
			expect(nameTableCount).toBe(1);
		});

		it("should work correctly when called multiple times (simulate re-filtering)", () => {
			const original = `views:
  - type: table
    name: Table
`;
			// First filter application
			const result1 = appendNameFilter(original, "first");
			expect((result1.match(/views:/g) || []).length).toBe(1);

			// Second filter application on the result (simulate typing more)
			const result2 = appendNameFilter(result1, "second");
			expect((result2.match(/views:/g) || []).length).toBe(1);
			expect((result2.match(/name: Table/g) || []).length).toBe(1);
			expect(result2).toContain('file.name.contains("second")');
			expect(result2).not.toContain("first");
		});

		it("should handle content ending without newline", () => {
			const content = `views:
  - type: table
    name: Table`;
			const result = appendNameFilter(content, "test");

			const viewsCount = (result.match(/views:/g) || []).length;
			expect(viewsCount).toBe(1);

			const nameTableCount = (result.match(/name: Table/g) || []).length;
			expect(nameTableCount).toBe(1);
		});

		it("should handle content with only trailing newlines", () => {
			const content = `views:
  - type: table
    name: Table


`;
			const result = appendNameFilter(content, "test");

			const viewsCount = (result.match(/views:/g) || []).length;
			expect(viewsCount).toBe(1);
		});
	});

	describe("extractFilterValue", () => {
		it("should extract filter value with double quotes", () => {
			const content = 'WHERE file.name.contains("test-value")';
			expect(extractFilterValue(content)).toBe("test-value");
		});

		it("should extract filter value with single quotes", () => {
			const content = "WHERE file.name.contains('test-value')";
			expect(extractFilterValue(content)).toBe("test-value");
		});

		it("should return empty string when no filter present", () => {
			const content = "filters:\n  and:\n    - file.inFolder('People')";
			expect(extractFilterValue(content)).toBe("");
		});

		it("should handle complex content with filter", () => {
			const content = `
filters:
  and:
    - file.inFolder("People")
    - file.name.contains("John")
`;
			expect(extractFilterValue(content)).toBe("John");
		});

		it("should extract from middle of content", () => {
			const content = `filters:
  and:
    - file.inFolder("People")
    - file.name.contains("SearchTerm")
    - file.name != "People"
views:
  - type: table
`;
			expect(extractFilterValue(content)).toBe("SearchTerm");
		});
	});

	describe("appendNameFilter", () => {
		describe("with existing filters", () => {
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

				expect(result).not.toContain("OldSearch");
				expect(result).toContain('file.name.contains("NewSearch")');
				expect(result).toContain('file.inFolder("People")');
				expect(result).toContain('file.name != "People"');
				expect(result).toContain("views:");
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

				expect(nameContainsIndex).toBeGreaterThan(0);
				expect(nameContainsIndex).toBeLessThan(viewsIndex);
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
		});

		describe("without existing filters", () => {
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

				const lines = result.split("\n");
				const filtersIndex = lines.findIndex((l) => l.trim() === "filters:");
				const viewsIndex = lines.findIndex((l) => l.trim() === "views:");
				expect(filtersIndex).toBeLessThan(viewsIndex);
			});

			it("should create filters section in empty content", () => {
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

				expect(result).toContain("filters:");
				expect(result).toContain("and:");
				expect(result).toContain('file.name.contains("SearchTerm")');
				expect(result).toContain("views:");
				expect(result).toContain("type: table");

				const lines = result.split("\n");
				const filtersIndex = lines.findIndex((l) => l.trim() === "filters:");
				const viewsIndex = lines.findIndex((l) => l.trim() === "views:");
				expect(filtersIndex).toBeLessThan(viewsIndex);
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

		describe("removing filters", () => {
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

			it("CRITICAL: should remove entire filters section when only file.name.contains exists and value is empty", () => {
				// User's bug: When clearing the filter input, it leaves empty filters: and: structure
				const content = `filters:
  and:
    - file.name.contains("B")
`;
				const result = appendNameFilter(content, "");

				// Should NOT contain any filter structure
				expect(result).not.toContain("filters:");
				expect(result).not.toContain("and:");
				expect(result).not.toContain("file.name.contains");

				// Should be completely empty or just whitespace
				expect(result.trim()).toBe("");
			});

			it("should remove entire filters section when only file.name.contains exists with views section", () => {
				const content = `filters:
  and:
    - file.name.contains("B")
views:
  - type: table
`;
				const result = appendNameFilter(content, "");

				// Should NOT contain filter structure
				expect(result).not.toContain("filters:");
				expect(result).not.toContain("and:");
				expect(result).not.toContain("file.name.contains");

				// Should still have views
				expect(result).toContain("views:");
				expect(result).toContain("type: table");
			});

			it("should remove empty filters section with leading empty lines", () => {
				const content = `

filters:
  and:
    - file.name.contains("B")
`;
				const result = appendNameFilter(content, "");

				expect(result).not.toContain("filters:");
				expect(result).not.toContain("and:");
				expect(result).not.toContain("file.name.contains");
			});

			it("should remove empty filters section but keep other content", () => {
				const content = `filters:
  and:
    - file.name.contains("Test")
views:
  - type: table
    name: Table
columns:
  - name: Title
`;
				const result = appendNameFilter(content, "");

				expect(result).not.toContain("filters:");
				expect(result).not.toContain("and:");
				expect(result).toContain("views:");
				expect(result).toContain("columns:");
			});
		});

		describe("indentation preservation", () => {
			it("should maintain proper indentation with spaces", () => {
				const content = `filters:
  and:
    - file.inFolder("People")
`;
				const result = appendNameFilter(content, "Test");
				const filterLine = result.split("\n").find((l) => l.includes("file.name.contains"));
				expect(filterLine).toMatch(/^ {4}- file\.name\.contains/);
			});

			it("should maintain proper indentation with tabs", () => {
				const content = `filters:
\tand:
\t\t- file.inFolder("People")
`;
				const result = appendNameFilter(content, "Test");
				const filterLine = result.split("\n").find((l) => l.includes("file.name.contains"));
				expect(filterLine).toMatch(/^\t\t- file\.name\.contains/);
			});
		});
	});
});
