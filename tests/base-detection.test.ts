import { describe, expect, it } from "vitest";
import { extractBaseEmbed, findBaseEmbeds, findInlineBaseBlocks, type MinimalEditor } from "../src/base-detection";
import { createMockEditor } from "./mocks/obsidian";

function mockEditor(lines: string[]): MinimalEditor {
	return createMockEditor(lines) as MinimalEditor;
}

describe("base-detection", () => {
	describe("findInlineBaseBlocks", () => {
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
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].type).toBe("inline");
			expect(blocks[0].startLine).toBe(2);
			expect(blocks[0].endLine).toBe(7);
			expect(blocks[0].content).toContain('file.inFolder("People")');
		});

		it("should detect multiple base blocks", () => {
			const lines = ["```base", "content1", "```", "", "```base", "content2", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(2);
			expect(blocks[0].startLine).toBe(0);
			expect(blocks[0].endLine).toBe(2);
			expect(blocks[1].startLine).toBe(4);
			expect(blocks[1].endLine).toBe(6);
		});

		it("should handle base block with leading/trailing whitespace", () => {
			const lines = ["  ```base  ", "content", "  ```  "];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
		});

		it("should return empty array when no base blocks exist", () => {
			const lines = ["# Just a heading", "Some regular text", "```javascript", "const x = 1;", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(0);
		});

		it("should handle unclosed base block gracefully", () => {
			const lines = ["```base", "content without closing", "more content"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

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
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].startLine).toBe(29);
			expect(blocks[0].content).toContain('file.inFolder("People")');
		});

		it("should not confuse base with other code blocks", () => {
			const lines = ["```javascript", "const base = 'test';", "```", "", "```base", "actual base content", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].startLine).toBe(4);
			expect(blocks[0].content).toContain("actual base content");
		});

		it("should extract filter value from block content", () => {
			const lines = ["```base", "filters:", "  and:", '    - file.name.contains("SearchTerm")', "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].filterValue).toBe("SearchTerm");
		});

		it("should return empty filter value when no filter present", () => {
			const lines = ["```base", "filters:", "  and:", '    - file.inFolder("People")', "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].filterValue).toBe("");
		});
	});

	describe("extractBaseEmbed", () => {
		it("should extract base file path from embed with alias", () => {
			const line = "![[Templates/Bases/People.base|People]]";
			expect(extractBaseEmbed(line)).toBe("Templates/Bases/People.base");
		});

		it("should extract base file path from embed without alias", () => {
			const line = "![[Templates/Bases/People.base]]";
			expect(extractBaseEmbed(line)).toBe("Templates/Bases/People.base");
		});

		it("should return null for non-base embeds", () => {
			const line = "![[Some/Other/File.md]]";
			expect(extractBaseEmbed(line)).toBeNull();
		});

		it("should return null for regular links (not embeds)", () => {
			const line = "[[Templates/Bases/People.base]]";
			expect(extractBaseEmbed(line)).toBeNull();
		});

		it("should return null for plain text", () => {
			const line = "Just some regular text";
			expect(extractBaseEmbed(line)).toBeNull();
		});

		it("should handle base file in root folder", () => {
			const line = "![[People.base|My People]]";
			expect(extractBaseEmbed(line)).toBe("People.base");
		});

		it("should handle whitespace around the embed", () => {
			const line = "  ![[Templates/Bases/People.base|People]]  ";
			expect(extractBaseEmbed(line)).toBe("Templates/Bases/People.base");
		});

		it("should return null for image embeds", () => {
			const line = "![[image.png]]";
			expect(extractBaseEmbed(line)).toBeNull();
		});

		it("should return null for PDF embeds", () => {
			const line = "![[document.pdf]]";
			expect(extractBaseEmbed(line)).toBeNull();
		});

		it("should handle deeply nested paths", () => {
			const line = "![[Templates/Bases/CRM/Contacts/People.base|People]]";
			expect(extractBaseEmbed(line)).toBe("Templates/Bases/CRM/Contacts/People.base");
		});

		it("should return null for embeds that are part of larger text", () => {
			const line = "Some text ![[People.base]] more text";
			expect(extractBaseEmbed(line)).toBeNull();
		});
	});

	describe("findInlineBaseBlocks with custom language", () => {
		it("should detect blocks with custom language (dataview)", () => {
			const lines = ["```dataview", "TABLE file.name", "FROM #tag", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "dataview");

			expect(blocks).toHaveLength(1);
			expect(blocks[0].startLine).toBe(0);
			expect(blocks[0].content).toContain("TABLE file.name");
		});

		it("should detect blocks with custom language (bases)", () => {
			const lines = ["```bases", "filters:", "  - some filter", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "bases");

			expect(blocks).toHaveLength(1);
			expect(blocks[0].content).toContain("filters:");
		});

		it("should detect blocks with custom language (query)", () => {
			const lines = ["```query", "SELECT * FROM notes", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "query");

			expect(blocks).toHaveLength(1);
			expect(blocks[0].content).toContain("SELECT");
		});

		it("should not detect base blocks when targeting different language", () => {
			const lines = ["```base", "content", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "dataview");

			expect(blocks).toHaveLength(0);
		});

		it("should not detect dataview blocks when targeting base", () => {
			const lines = ["```dataview", "TABLE file.name", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "base");

			expect(blocks).toHaveLength(0);
		});

		it("should handle languages with special regex characters (c++)", () => {
			const lines = ["```c++", "int main() {}", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "c++");

			expect(blocks).toHaveLength(1);
			expect(blocks[0].content).toContain("int main");
		});

		it("should handle languages with special regex characters (c#)", () => {
			const lines = ["```c#", "public class Test {}", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "c#");

			expect(blocks).toHaveLength(1);
			expect(blocks[0].content).toContain("public class");
		});

		it("should find multiple blocks of custom language", () => {
			const lines = ["```dataview", "TABLE file.name", "```", "", "```dataview", "LIST FROM #tag", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor, "dataview");

			expect(blocks).toHaveLength(2);
			expect(blocks[0].content).toContain("TABLE");
			expect(blocks[1].content).toContain("LIST");
		});

		it("should only find targeted language in mixed document", () => {
			const lines = [
				"```javascript",
				"const x = 1;",
				"```",
				"",
				"```dataview",
				"TABLE file.name",
				"```",
				"",
				"```base",
				"filters:",
				"```",
			];

			const editor = mockEditor(lines);
			const dataviewBlocks = findInlineBaseBlocks(editor, "dataview");
			const baseBlocks = findInlineBaseBlocks(editor, "base");
			const jsBlocks = findInlineBaseBlocks(editor, "javascript");

			expect(dataviewBlocks).toHaveLength(1);
			expect(baseBlocks).toHaveLength(1);
			expect(jsBlocks).toHaveLength(1);
		});

		it("should use default language (base) when not specified", () => {
			const lines = ["```base", "content", "```", "", "```dataview", "other", "```"];

			const editor = mockEditor(lines);
			const blocks = findInlineBaseBlocks(editor);

			expect(blocks).toHaveLength(1);
			expect(blocks[0].content).toContain("content");
		});
	});

	describe("findBaseEmbeds (always .base)", () => {
		it("should find base embed in document", () => {
			const lines = ["# My Document", "", "![[Templates/Bases/People.base|People]]", "", "Some text after"];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			expect(embeds).toHaveLength(1);
			expect(embeds[0].line).toBe(2);
			expect(embeds[0].filePath).toBe("Templates/Bases/People.base");
		});

		it("should find multiple base embeds", () => {
			const lines = ["![[People.base]]", "Some text", "![[Projects.base|Projects]]"];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			expect(embeds).toHaveLength(2);
			expect(embeds[0].filePath).toBe("People.base");
			expect(embeds[0].line).toBe(0);
			expect(embeds[1].filePath).toBe("Projects.base");
			expect(embeds[1].line).toBe(2);
		});

		it("should ignore non-base embeds", () => {
			const lines = ["![[Some/Image.png]]", "![[People.base]]", "![[Note.md]]"];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			expect(embeds).toHaveLength(1);
			expect(embeds[0].filePath).toBe("People.base");
		});

		it("should return empty array when no base embeds exist", () => {
			const lines = ["# Just a heading", "Some regular text", "[[Regular link]]"];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			expect(embeds).toHaveLength(0);
		});

		it("should handle document with both inline blocks and embeds", () => {
			const lines = ["![[People.base]]", "", "```base", "filters:", "```", "", "![[Projects.base]]"];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			// findBaseEmbeds only finds embeds, not inline blocks
			expect(embeds).toHaveLength(2);
			expect(embeds[0].filePath).toBe("People.base");
			expect(embeds[1].filePath).toBe("Projects.base");
		});

		it("should find embeds at start, middle, and end of document", () => {
			const lines = [
				"![[Start.base]]",
				"Some content",
				"More content",
				"![[Middle.base]]",
				"Even more content",
				"![[End.base]]",
			];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			expect(embeds).toHaveLength(3);
			expect(embeds[0].line).toBe(0);
			expect(embeds[1].line).toBe(3);
			expect(embeds[2].line).toBe(5);
		});

		it("should ignore regular links to base files", () => {
			const lines = [
				"[[People.base]]", // regular link, not embed
				"![[People.base]]", // embed
			];

			const editor = mockEditor(lines);
			const embeds = findBaseEmbeds(editor);

			expect(embeds).toHaveLength(1);
			expect(embeds[0].line).toBe(1);
		});
	});
});
