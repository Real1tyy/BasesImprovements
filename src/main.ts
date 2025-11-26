import { type Editor, MarkdownView, Plugin } from "obsidian";
import { BaseFilterInput } from "./components";

interface BaseBlock {
	startLine: number;
	endLine: number;
	content: string;
	filterValue: string;
}

export default class BasesImprovementsPlugin extends Plugin {
	private filterComponents: Map<string, BaseFilterInput> = new Map();

	async onload() {
		console.log("Loading Bases Improvements Plugin");

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.updateBaseBlockFilters();
			})
		);

		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
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
		setTimeout(() => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				this.clearAllFilterComponents();
				return;
			}

			const editor = activeView.editor;
			const blocks = this.findBaseBlocks(editor);

			this.clearAllFilterComponents();

			for (const block of blocks) {
				this.injectFilterComponent(activeView, editor, block);
			}
		}, 100);
	}

	private findBaseBlocks(editor: Editor): BaseBlock[] {
		const blocks: BaseBlock[] = [];
		const lineCount = editor.lineCount();

		let inBaseBlock = false;
		let blockStartLine = -1;
		let blockContent = "";

		for (let lineNum = 0; lineNum < lineCount; lineNum++) {
			const lineText = editor.getLine(lineNum);

			if (lineText.trim() === "```base") {
				inBaseBlock = true;
				blockStartLine = lineNum;
				blockContent = "";
			} else if (inBaseBlock && lineText.trim() === "```") {
				const filterValue = this.extractFilterValue(blockContent);
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

		return blocks;
	}

	private extractFilterValue(content: string): string {
		const match = content.match(/file\.name\.contains\(["']([^"']*)["']\)/);
		return match ? match[1] : "";
	}

	private injectFilterComponent(view: MarkdownView, editor: Editor, block: BaseBlock): void {
		const editorElement = view.containerEl.querySelector(".cm-editor");
		if (!editorElement) return;

		const lineElement = editorElement.querySelector(`.cm-line:nth-child(${block.startLine + 1})`);
		if (!lineElement) return;

		const filterInput = new BaseFilterInput((value: string) => {
			this.updateBaseBlock(editor, block, value);
		}, "Filter files by name...");

		filterInput.setValue(block.filterValue);

		lineElement.parentElement?.insertBefore(filterInput.getElement(), lineElement);

		const key = `${view.file?.path}-${block.startLine}`;
		this.filterComponents.set(key, filterInput);
	}

	private updateBaseBlock(editor: Editor, block: BaseBlock, filterValue: string): void {
		let newContent = block.content;

		if (filterValue) {
			const filterCondition = `file.name.contains("${filterValue}")`;

			if (this.extractFilterValue(block.content)) {
				newContent = newContent.replace(/file\.name\.contains\(["'][^"']*["']\)/, filterCondition);
			} else {
				const lines = newContent.trim().split("\n");
				if (lines.length > 0) {
					if (lines[0].match(/WHERE/i)) {
						lines[0] += ` AND ${filterCondition}`;
					} else {
						lines.splice(1, 0, `WHERE ${filterCondition}`);
					}
				} else {
					lines.push(`WHERE ${filterCondition}`);
				}
				newContent = `${lines.join("\n")}\n`;
			}
		} else {
			newContent = newContent.replace(/\s*(?:AND\s+)?file\.name\.contains\(["'][^"']*["']\)/gi, "");
			newContent = newContent.replace(/WHERE\s+AND\s+/gi, "WHERE ");
			newContent = newContent.replace(/WHERE\s*$/gm, "");
		}

		const startPos = { line: block.startLine + 1, ch: 0 };
		const endPos = { line: block.endLine, ch: 0 };

		editor.replaceRange(newContent, startPos, endPos);

		block.content = newContent;
		block.filterValue = filterValue;
	}
}
