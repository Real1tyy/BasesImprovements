import { describe, expect, it } from "vitest";
import { parseBaseContent, reconstructBaseWithView } from "../src/base-parser";

describe("parseBaseContent", () => {
	describe("when content has no views section", () => {
		it("returns content as top-level with no views", () => {
			const content = `formulas:
  formula1: "test"
filters:
  and:
    - file.tags.contains("test")`;

			const result = parseBaseContent(content);

			expect(result.topLevelContent).toBe(content);
			expect(result.views).toEqual([]);
			expect(result.hasMultipleViews).toBe(false);
		});
	});

	describe("when content has a single view", () => {
		it("extracts the single view", () => {
			const content = `views:
  - type: table
    name: My View
    order:
      - prop1
      - prop2`;

			const result = parseBaseContent(content);

			expect(result.topLevelContent).toBe("views:");
			expect(result.views).toHaveLength(1);
			expect(result.views[0].name).toBe("My View");
			expect(result.hasMultipleViews).toBe(false);
		});
	});

	describe("when content has multiple views", () => {
		it("extracts all views with correct names", () => {
			const content = `formulas:
  formula1: "test"
views:
  - type: table
    name: Table View
    order:
      - prop1
  - type: board
    name: Board View
    groupBy: status
  - type: gallery
    name: Gallery View
    coverProp: image`;

			const result = parseBaseContent(content);

			expect(result.topLevelContent).toBe(`formulas:
  formula1: "test"
views:`);
			expect(result.views).toHaveLength(3);
			expect(result.views[0].name).toBe("Table View");
			expect(result.views[1].name).toBe("Board View");
			expect(result.views[2].name).toBe("Gallery View");
			expect(result.hasMultipleViews).toBe(true);
		});

		it("uses default name when view has no name property", () => {
			const content = `views:
  - type: table
    order:
      - prop1`;

			const result = parseBaseContent(content);

			expect(result.views[0].name).toBe("View");
		});
	});

	describe("when content has top-level filters", () => {
		it("preserves top-level filters in topLevelContent", () => {
			const content = `filters:
  and:
    - file.tags.contains("test")
views:
  - type: table
    name: View 1
  - type: board
    name: View 2`;

			const result = parseBaseContent(content);

			expect(result.topLevelContent).toBe(`filters:
  and:
    - file.tags.contains("test")
views:`);
			expect(result.views).toHaveLength(2);
			expect(result.hasMultipleViews).toBe(true);
		});
	});

	describe("real-world base syntax", () => {
		it("parses views-only base with four related views", () => {
			const content = `views:
  - type: table
    name: AllRelated
    filters:
      and:
        - this._AllRelated.contains(file)
        - _Archived != true
    order:
      - file.name
      - Backlink Tags
      - Author
      - Language
      - Viewed Amount
      - Quality
      - URL
      - Related
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Related
    filters:
      and:
        - this.Related.contains(file)
        - _Archived != true
    order:
      - file.name
      - Backlink Tags
      - Author
      - Language
      - Viewed Amount
      - Quality
      - URL
      - Related
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: AllRelated Archived
    filters:
      and:
        - this._AllRelated.contains(file)
        - _Archived == true
    order:
      - file.name
      - Backlink Tags
      - Author
      - Language
      - Viewed Amount
      - Quality
      - URL
      - Related
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Related Archived
    filters:
      and:
        - this.Related.contains(file)
        - _Archived == true
    order:
      - file.name
      - Backlink Tags
      - Author
      - Language
      - Viewed Amount
      - Quality
      - URL
      - Related
    sort:
      - property: file.mtime
        direction: DESC`;

			const result = parseBaseContent(content);

			expect(result.topLevelContent).toBe("views:");
			expect(result.views).toHaveLength(4);
			expect(result.views[0].name).toBe("AllRelated");
			expect(result.views[1].name).toBe("Related");
			expect(result.views[2].name).toBe("AllRelated Archived");
			expect(result.views[3].name).toBe("Related Archived");
			expect(result.hasMultipleViews).toBe(true);
		});

		it("parses base with top-level filters and folder-based views", () => {
			const content = `filters:
  and:
    - Author.contains(this.file.asLink())
views:
  - type: table
    name: Books
    filters:
      and:
        - file.inFolder("Books")
        - _Archived != true
    order:
      - file.name
      - Backlink Tags
      - Quality
      - Related
      - Viewed Amount
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Blogs
    filters:
      and:
        - file.inFolder("Blogs")
        - _Archived != true
    order:
      - file.name
      - Backlink Tags
      - Quality
      - Related
      - Viewed Amount
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Videos
    filters:
      and:
        - file.inFolder("Videos")
        - _Archived != true
    order:
      - file.name
      - Backlink Tags
      - Quality
      - Related
      - Viewed Amount
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Archived
    filters:
      and:
        - _Archived == true
    order:
      - file.name
      - Backlink Tags
      - Quality
      - Related
      - Viewed Amount
    sort:
      - property: file.mtime
        direction: DESC`;

			const result = parseBaseContent(content);

			expect(result.topLevelContent).toBe(`filters:
  and:
    - Author.contains(this.file.asLink())
views:`);
			expect(result.views).toHaveLength(4);
			expect(result.views[0].name).toBe("Books");
			expect(result.views[1].name).toBe("Blogs");
			expect(result.views[2].name).toBe("Videos");
			expect(result.views[3].name).toBe("Archived");
			expect(result.hasMultipleViews).toBe(true);
		});

		it("preserves view-level filters in each view content", () => {
			const content = `views:
  - type: table
    name: Books
    filters:
      and:
        - file.inFolder("Books")
        - _Archived != true
    order:
      - file.name
  - type: table
    name: Archived
    filters:
      and:
        - _Archived == true
    order:
      - file.name`;

			const result = parseBaseContent(content);

			expect(result.views[0].content).toContain('file.inFolder("Books")');
			expect(result.views[0].content).toContain("_Archived != true");
			expect(result.views[1].content).toContain("_Archived == true");
		});

		it("preserves sort configuration in each view", () => {
			const content = `views:
  - type: table
    name: Recent
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Alphabetical
    sort:
      - property: file.name
        direction: ASC`;

			const result = parseBaseContent(content);

			expect(result.views[0].content).toContain("file.mtime");
			expect(result.views[0].content).toContain("DESC");
			expect(result.views[1].content).toContain("file.name");
			expect(result.views[1].content).toContain("ASC");
		});

		it("preserves order (column) configuration in each view", () => {
			const content = `views:
  - type: table
    name: Full View
    order:
      - file.name
      - Backlink Tags
      - Author
      - Language
      - Viewed Amount
      - Quality
      - URL
      - Related
  - type: table
    name: Minimal View
    order:
      - file.name
      - Quality`;

			const result = parseBaseContent(content);

			expect(result.views[0].content).toContain("Author");
			expect(result.views[0].content).toContain("Language");
			expect(result.views[1].content).not.toContain("Author");
			expect(result.views[1].content).toContain("Quality");
		});
	});
});

describe("reconstructBaseWithView", () => {
	it("combines top-level content with selected view", () => {
		const content = `formulas:
  formula1: "test"
views:
  - type: table
    name: Table View
    order:
      - prop1
  - type: board
    name: Board View
    groupBy: status`;

		const parsed = parseBaseContent(content);
		const result = reconstructBaseWithView(parsed, 0);

		expect(result).toContain("formulas:");
		expect(result).toContain("Table View");
		expect(result).not.toContain("Board View");
	});

	it("selects the second view when index is 1", () => {
		const content = `views:
  - type: table
    name: Table View
  - type: board
    name: Board View`;

		const parsed = parseBaseContent(content);
		const result = reconstructBaseWithView(parsed, 1);

		expect(result).toContain("Board View");
		expect(result).not.toContain("Table View");
	});

	it("returns only top-level content when index is out of bounds", () => {
		const content = `views:
  - type: table
    name: Only View`;

		const parsed = parseBaseContent(content);
		const result = reconstructBaseWithView(parsed, 5);

		expect(result).toBe("views:");
	});

	it("returns only top-level content when index is negative", () => {
		const content = `views:
  - type: table
    name: Only View`;

		const parsed = parseBaseContent(content);
		const result = reconstructBaseWithView(parsed, -1);

		expect(result).toBe("views:");
	});

	describe("real-world base reconstruction", () => {
		const baseWithTopLevelFilters = `filters:
  and:
    - Author.contains(this.file.asLink())
views:
  - type: table
    name: Books
    filters:
      and:
        - file.inFolder("Books")
        - _Archived != true
    order:
      - file.name
      - Quality
    sort:
      - property: file.mtime
        direction: DESC
  - type: table
    name: Videos
    filters:
      and:
        - file.inFolder("Videos")
        - _Archived != true
    order:
      - file.name
      - Quality
    sort:
      - property: file.mtime
        direction: DESC`;

		it("includes top-level filters when reconstructing with first view", () => {
			const parsed = parseBaseContent(baseWithTopLevelFilters);
			const result = reconstructBaseWithView(parsed, 0);

			expect(result).toContain("Author.contains(this.file.asLink())");
			expect(result).toContain("Books");
			expect(result).toContain('file.inFolder("Books")');
			expect(result).not.toContain("Videos");
		});

		it("includes top-level filters when reconstructing with second view", () => {
			const parsed = parseBaseContent(baseWithTopLevelFilters);
			const result = reconstructBaseWithView(parsed, 1);

			expect(result).toContain("Author.contains(this.file.asLink())");
			expect(result).toContain("Videos");
			expect(result).toContain('file.inFolder("Videos")');
			expect(result).not.toContain("Books");
		});

		it("preserves sort configuration when reconstructing view", () => {
			const parsed = parseBaseContent(baseWithTopLevelFilters);
			const result = reconstructBaseWithView(parsed, 0);

			expect(result).toContain("file.mtime");
			expect(result).toContain("DESC");
		});

		it("preserves order (columns) when reconstructing view", () => {
			const parsed = parseBaseContent(baseWithTopLevelFilters);
			const result = reconstructBaseWithView(parsed, 0);

			expect(result).toContain("file.name");
			expect(result).toContain("Quality");
		});
	});
});
