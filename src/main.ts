import { type Editor, MarkdownView, Plugin } from "obsidian";
import { BaseFilterInput } from "./components";

export interface BaseBlock {
	startLine: number;
	endLine: number;
	content: string;
	filterValue: string;
}

export interface MinimalEditor {
	getLine(line: number): string;
	lineCount(): number;
}

export function extractFilterValue(content: string): string {
	const match = content.match(/file\.name\.contains\(["']([^"']*)["']\)/);
	return match ? match[1] : "";
}

export function appendNameFilter(content: string, filterValue: string): string {
	const lines = content.split("\n").filter((line) => !line.includes("file.name.contains"));

	// If no filter value, just return cleaned content
	if (!filterValue) {
		return lines.join("\n");
	}

	// Detect indentation from existing FILTER lines only (- file.), use default "    " (4 spaces)
	const existingFilterLine = lines.find((line) => line.trimStart().startsWith("- file."));
	const filterIndent = existingFilterLine ? existingFilterLine.match(/^(\s*)/)?.[1] || "    " : "    ";

	const filterLine = `${filterIndent}- file.name.contains("${filterValue}")`;

	const andIndex = lines.findIndex((line) => line.trim() === "and:");

	if (andIndex !== -1) {
		let lastFilterIndex = andIndex;
		for (let i = andIndex + 1; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			if (!trimmed) {
				continue;
			}

			if (line.match(/^\s+- /)) {
				lastFilterIndex = i;
				continue;
			}

			break;
		}

		// Insert after the last filter
		lines.splice(lastFilterIndex + 1, 0, filterLine);
		return lines.join("\n");
	}

	const filtersIndex = lines.findIndex((line) => line.trim() === "filters:");

	if (filtersIndex !== -1) {
		const filtersIndent = lines[filtersIndex].match(/^(\s*)/)?.[1] || "";
		const andIndent = `${filtersIndent}  `;
		lines.splice(filtersIndex + 1, 0, `${andIndent}and:`, filterLine);
		return lines.join("\n");
	}

	const viewsIndex = lines.findIndex((line) => line.trim() === "views:");

	const filtersSection = ["filters:", "  and:", filterLine];

	if (viewsIndex !== -1) {
		lines.splice(viewsIndex, 0, ...filtersSection);
	} else {
		let insertIndex = 0;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].trim()) {
				insertIndex = i;
				break;
			}
			insertIndex = i + 1;
		}
		lines.splice(insertIndex, 0, ...filtersSection);
	}

	return lines.join("\n");
}

export function findBaseBlocks(editor: MinimalEditor): BaseBlock[] {
	const blocks: BaseBlock[] = [];
	const lineCount = editor.lineCount();

	let inBaseBlock = false;
	let blockStartLine = -1;
	let blockContent = "";

	console.log("[BasesImprovements] Scanning", lineCount, "lines for base blocks");

	for (let lineNum = 0; lineNum < lineCount; lineNum++) {
		const lineText = editor.getLine(lineNum);

		if (lineText.trim() === "```base") {
			console.log(`[BasesImprovements] Found base block start at line ${lineNum}: "${lineText}"`);
			inBaseBlock = true;
			blockStartLine = lineNum;
			blockContent = "";
		} else if (inBaseBlock && lineText.trim() === "```") {
			console.log(`[BasesImprovements] Found base block end at line ${lineNum}`);
			const filterValue = extractFilterValue(blockContent);
			console.log(`[BasesImprovements] Block content:\n${blockContent}`);
			console.log(`[BasesImprovements] Extracted filter value: "${filterValue}"`);
			blocks.push({
				startLine: blockStartLine,
				endLine: lineNum,
				content: blockContent,
				filterValue,
			});
			inBaseBlock = false;
		} else if (inBaseBlock) {
			blockContent += `${lineText}\n`;
		}
	}

	console.log("[BasesImprovements] Total blocks found:", blocks.length);
	return blocks;
}

export default class BasesImprovementsPlugin extends Plugin {
	private filterComponents: Map<string, BaseFilterInput> = new Map();

	async onload() {
		console.log("[BasesImprovements] Loading Bases Improvements Plugin");

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				console.log("[BasesImprovements] Event: active-leaf-change");
				this.updateBaseBlockFilters();
			})
		);

		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				console.log("[BasesImprovements] Event: layout-change");
				this.updateBaseBlockFilters();
			})
		);

		this.addCommand({
			id: "focus-base-filter",
			name: "Focus base block filter",
			editorCallback: () => {
				const firstFilter = Array.from(this.filterComponents.values())[0];
				if (firstFilter) {
					firstFilter.focus();
				}
			},
		});

		this.updateBaseBlockFilters();
	}

	async onunload() {
		console.log("Unloading Bases Improvements Plugin");
		this.clearAllFilterComponents();
	}

	private clearAllFilterComponents(): void {
		for (const component of this.filterComponents.values()) {
			component.destroy();
		}
		this.filterComponents.clear();
	}

	private updateBaseBlockFilters(): void {
		console.log("[BasesImprovements] updateBaseBlockFilters called");
		setTimeout(() => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			console.log("[BasesImprovements] Active view:", activeView ? "found" : "not found", activeView?.file?.path);

			if (!activeView) {
				console.log("[BasesImprovements] No active view, clearing filter components");
				this.clearAllFilterComponents();
				return;
			}

			const editor = activeView.editor;
			console.log("[BasesImprovements] Editor line count:", editor.lineCount());

			const blocks = findBaseBlocks(editor);
			console.log("[BasesImprovements] Found base blocks:", blocks.length, blocks);

			this.clearAllFilterComponents();

			for (const block of blocks) {
				console.log("[BasesImprovements] Injecting filter component for block at line", block.startLine);
				this.injectFilterComponent(activeView, editor, block);
			}
		}, 100);
	}

	private injectFilterComponent(view: MarkdownView, editor: Editor, block: BaseBlock): void {
		console.log("[BasesImprovements] injectFilterComponent called for block at line", block.startLine);

		const cmEditor = view.containerEl.querySelector(".cm-editor");
		console.log("[BasesImprovements] Editor element found:", !!cmEditor);
		if (!cmEditor?.parentElement) {
			console.log("[BasesImprovements] ERROR: No .cm-editor element found in view container");
			return;
		}

		console.log("[BasesImprovements] Creating filter input component");
		const filterInput = new BaseFilterInput((value: string) => {
			console.log("[BasesImprovements] Filter value changed:", value);
			this.updateBaseBlock(editor, block, value);
		}, "Filter by name...");

		filterInput.initialize(cmEditor.parentElement);
		filterInput.setValue(block.filterValue);

		const wrapper = filterInput.getElement();
		if (wrapper) {
			wrapper.dataset.blockLine = String(block.startLine);
		}

		const key = `${view.file?.path}-${block.startLine}`;
		console.log("[BasesImprovements] Registered filter component with key:", key);
		this.filterComponents.set(key, filterInput);
	}

	private updateBaseBlock(editor: Editor, block: BaseBlock, filterValue: string): void {
		console.log("[BasesImprovements] updateBaseBlock called with filterValue:", filterValue);
		console.log("[BasesImprovements] Original block content:", block.content);

		const newContent = appendNameFilter(block.content, filterValue);
		console.log("[BasesImprovements] New block content:", newContent);

		const startPos = { line: block.startLine + 1, ch: 0 };
		const endPos = { line: block.endLine, ch: 0 };

		editor.replaceRange(newContent, startPos, endPos);

		block.content = newContent;
		block.filterValue = filterValue;
	}
}
