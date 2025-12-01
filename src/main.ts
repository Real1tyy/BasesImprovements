import { type Editor, MarkdownView, Plugin, TFile } from "obsidian";
import { type BaseBlock, type BaseEmbedInfo, findBaseEmbeds, findInlineBaseBlocks } from "./base-detection";
import { appendNameFilter, extractFilterValue } from "./base-filter";
import { BaseFilterInput } from "./components";

export default class BasesImprovementsPlugin extends Plugin {
	private filterComponents: Map<string, BaseFilterInput> = new Map();

	async onload() {
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
		this.clearAllFilterComponents();
	}

	private clearAllFilterComponents(): void {
		for (const component of this.filterComponents.values()) {
			component.destroy();
		}
		this.filterComponents.clear();
	}

	private updateBaseBlockFilters(): void {
		setTimeout(async () => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				this.clearAllFilterComponents();
				return;
			}

			const editor = activeView.editor;
			this.clearAllFilterComponents();

			const inlineBlocks = findInlineBaseBlocks(editor);
			for (const block of inlineBlocks) {
				this.injectFilterComponent(activeView, editor, block);
			}

			const embeds = findBaseEmbeds(editor);
			for (const embed of embeds) {
				await this.processBaseEmbed(activeView, editor, embed);
			}
		}, 100);
	}

	private async processBaseEmbed(view: MarkdownView, editor: Editor, embed: BaseEmbedInfo): Promise<void> {
		const baseFile = this.app.metadataCache.getFirstLinkpathDest(embed.filePath, view.file?.path || "");

		if (!baseFile || !(baseFile instanceof TFile)) {
			return;
		}

		const content = await this.app.vault.read(baseFile);
		const filterValue = extractFilterValue(content);

		const block: BaseBlock = {
			type: "file",
			startLine: embed.line,
			endLine: embed.line,
			content,
			filterValue,
			filePath: baseFile.path,
		};

		this.injectFilterComponent(view, editor, block);
	}

	private injectFilterComponent(view: MarkdownView, editor: Editor, block: BaseBlock): void {
		const cmEditor = view.containerEl.querySelector(".cm-editor");
		if (!cmEditor?.parentElement) {
			return;
		}

		const filterInput = new BaseFilterInput((value: string) => {
			this.updateBaseBlock(editor, block, value);
		}, "Filter by name...");

		filterInput.initialize(cmEditor.parentElement);
		filterInput.setValue(block.filterValue);

		const wrapper = filterInput.getElement();
		if (wrapper) {
			wrapper.dataset.blockLine = String(block.startLine);
		}

		const key = `${view.file?.path}-${block.startLine}`;
		this.filterComponents.set(key, filterInput);
	}

	private async updateBaseBlock(editor: Editor, block: BaseBlock, filterValue: string): Promise<void> {
		let currentContent = "";

		if (block.type === "inline") {
			const freshBlocks = findInlineBaseBlocks(editor);
			const freshBlock = freshBlocks.find(
				(b) => b.startLine === block.startLine || Math.abs(b.startLine - block.startLine) <= 3
			);
			if (freshBlock) {
				currentContent = freshBlock.content;
				block.startLine = freshBlock.startLine;
				block.endLine = freshBlock.endLine;
			} else {
				currentContent = block.content;
			}
		} else {
			currentContent = block.content;
		}

		const newContent = appendNameFilter(currentContent, filterValue);

		if (block.type === "file" && block.filePath) {
			const baseFile = this.app.vault.getAbstractFileByPath(block.filePath);
			if (baseFile instanceof TFile) {
				await this.app.vault.modify(baseFile, newContent);
			}
		} else {
			const startPos = { line: block.startLine + 1, ch: 0 };
			const endPos = { line: block.endLine, ch: 0 };
			editor.replaceRange(newContent, startPos, endPos);

			const newLineCount = newContent.split("\n").length - 1;
			block.endLine = block.startLine + 1 + newLineCount;
		}

		block.content = newContent;
		block.filterValue = filterValue;
	}
}
