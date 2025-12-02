import type { App, Editor, MarkdownView } from "obsidian";
import { TFile } from "obsidian";
import { type BaseBlock, type BaseEmbedInfo, findBaseEmbeds, findInlineBaseBlocks } from "./base-detection";
import { appendNameFilter, extractFilterValue } from "./base-filter";
import { BaseFilterInput } from "./components";

interface PendingFocus {
	key: string;
	value: string;
	cursorPosition: number;
}

export class BaseBlockProcessor {
	private filterComponents: Map<string, BaseFilterInput> = new Map();
	private isProcessing = false;
	private pendingFocus: PendingFocus | null = null;

	constructor(private app: App) {}

	clearAllFilterComponents(): void {
		for (const component of this.filterComponents.values()) {
			component.destroy();
		}
		this.filterComponents.clear();
	}

	private hasActiveInput(): boolean {
		for (const component of this.filterComponents.values()) {
			if (component.hasFocus()) {
				return true;
			}
		}
		return false;
	}

	async updateBaseBlockFilters(activeView: MarkdownView | null): Promise<void> {
		if (this.isProcessing) {
			return;
		}

		if (this.hasActiveInput()) {
			return;
		}

		if (!activeView) {
			this.clearAllFilterComponents();
			return;
		}

		this.isProcessing = true;
		try {
			await this.processView(activeView);
		} finally {
			this.isProcessing = false;
		}
	}

	private async processView(activeView: MarkdownView): Promise<void> {
		const editor = activeView.editor;
		const currentFile = activeView.file?.path || "";

		const inlineBlocks = findInlineBaseBlocks(editor);
		const embeds = findBaseEmbeds(editor);

		const expectedKeys = this.buildExpectedKeys(currentFile, inlineBlocks, embeds);
		this.removeStaleComponents(expectedKeys);
		this.injectInlineBlockComponents(activeView, editor, currentFile, inlineBlocks);
		await this.injectEmbedComponents(activeView, editor, currentFile, embeds);
	}

	private buildExpectedKeys(currentFile: string, inlineBlocks: BaseBlock[], embeds: BaseEmbedInfo[]): Set<string> {
		const keys = new Set<string>();
		for (let i = 0; i < inlineBlocks.length; i++) {
			keys.add(`${currentFile}-inline-${i}`);
		}
		for (let i = 0; i < embeds.length; i++) {
			keys.add(`${currentFile}-embed-${i}`);
		}
		return keys;
	}

	private removeStaleComponents(expectedKeys: Set<string>): void {
		for (const [key, component] of this.filterComponents.entries()) {
			if (!expectedKeys.has(key)) {
				component.destroy();
				this.filterComponents.delete(key);
			}
		}
	}

	private injectInlineBlockComponents(
		view: MarkdownView,
		editor: Editor,
		currentFile: string,
		blocks: BaseBlock[]
	): void {
		const renderedBlocks = this.findRenderedInlineBaseBlocks(view);

		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			const key = `${currentFile}-inline-${i}`;

			if (this.shouldSkipExistingComponent(key)) {
				continue;
			}

			const targetElement = renderedBlocks[i];
			if (!targetElement) {
				continue;
			}

			this.injectFilterAboveElement(targetElement, editor, block, key);
		}
	}

	private shouldSkipExistingComponent(key: string): boolean {
		const existingComponent = this.filterComponents.get(key);
		if (!existingComponent) {
			return false;
		}

		const wrapperInDom = existingComponent.getElement()?.isConnected;
		if (wrapperInDom) {
			return true;
		}

		existingComponent.destroy();
		this.filterComponents.delete(key);
		return false;
	}

	private async injectEmbedComponents(
		view: MarkdownView,
		editor: Editor,
		currentFile: string,
		embeds: BaseEmbedInfo[]
	): Promise<void> {
		for (let i = 0; i < embeds.length; i++) {
			const embed = embeds[i];
			const key = `${currentFile}-embed-${i}`;

			if (this.shouldSkipExistingComponent(key)) {
				continue;
			}

			await this.processBaseEmbed(view, editor, embed, key);
		}
	}

	private findRenderedInlineBaseBlocks(view: MarkdownView): HTMLElement[] {
		const container = view.containerEl;
		return Array.from(container.querySelectorAll(".cm-preview-code-block.cm-lang-base"));
	}

	private findRenderedBaseEmbeds(view: MarkdownView): HTMLElement[] {
		const container = view.containerEl;
		return Array.from(container.querySelectorAll(".internal-embed.bases-embed"));
	}

	private async processBaseEmbed(view: MarkdownView, editor: Editor, embed: BaseEmbedInfo, key: string): Promise<void> {
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

		const targetElement = this.findEmbedElementByPath(view, embed.filePath);
		if (targetElement) {
			this.injectFilterAboveElement(targetElement, editor, block, key);
		}
	}

	private findEmbedElementByPath(view: MarkdownView, filePath: string): HTMLElement | null {
		const embeds = this.findRenderedBaseEmbeds(view);
		return (
			embeds.find((el) => {
				const src = el.getAttribute("src");
				return src === filePath || src?.endsWith(filePath);
			}) || null
		);
	}

	private findEmbedBlockContainer(element: HTMLElement): HTMLElement | null {
		let current: HTMLElement | null = element;
		while (current) {
			if (current.classList.contains("cm-embed-block")) {
				return current;
			}
			current = current.parentElement;
		}
		return null;
	}

	private hasFilterWrapper(container: HTMLElement): boolean {
		return container.querySelector(".base-filter-wrapper") !== null;
	}

	private injectFilterAboveElement(targetElement: HTMLElement, editor: Editor, block: BaseBlock, key: string): void {
		const container = this.findEmbedBlockContainer(targetElement);
		if (!container) {
			return;
		}

		if (this.hasFilterWrapper(container)) {
			return;
		}

		const filterInput = new BaseFilterInput((value: string, cursorPosition: number) => {
			this.pendingFocus = { key, value, cursorPosition };
			this.updateBaseBlock(editor, block, value);
		}, "Filter by name...");

		const wrapper = filterInput.createWrapper();
		wrapper.dataset.blockLine = String(block.startLine);
		wrapper.dataset.filterKey = key;

		container.insertBefore(wrapper, container.firstChild);

		filterInput.attachToWrapper(wrapper);
		filterInput.setValue(block.filterValue);

		this.filterComponents.set(key, filterInput);

		this.restoreFocusIfPending(key, filterInput);
	}

	private restoreFocusIfPending(key: string, filterInput: BaseFilterInput): void {
		if (this.pendingFocus && this.pendingFocus.key === key) {
			filterInput.setValue(this.pendingFocus.value);
			filterInput.focus();
			filterInput.setCursorPosition(this.pendingFocus.cursorPosition);
			this.pendingFocus = null;
		}
	}

	private async updateBaseBlock(editor: Editor, block: BaseBlock, filterValue: string): Promise<void> {
		const currentContent = this.getCurrentBlockContent(editor, block);
		const newContent = appendNameFilter(currentContent, filterValue);

		if (block.type === "file" && block.filePath) {
			await this.updateFileBlock(block.filePath, newContent);
		} else {
			this.updateInlineBlock(editor, block, newContent);
		}

		block.content = newContent;
		block.filterValue = filterValue;
	}

	private getCurrentBlockContent(editor: Editor, block: BaseBlock): string {
		if (block.type === "inline") {
			const freshBlocks = findInlineBaseBlocks(editor);
			const freshBlock = freshBlocks.find(
				(b) => b.startLine === block.startLine || Math.abs(b.startLine - block.startLine) <= 3
			);
			if (freshBlock) {
				block.startLine = freshBlock.startLine;
				block.endLine = freshBlock.endLine;
				return freshBlock.content;
			}
		}
		return block.content;
	}

	private async updateFileBlock(filePath: string, newContent: string): Promise<void> {
		const baseFile = this.app.vault.getAbstractFileByPath(filePath);
		if (baseFile instanceof TFile) {
			await this.app.vault.modify(baseFile, newContent);
		}
	}

	private updateInlineBlock(editor: Editor, block: BaseBlock, newContent: string): void {
		const startPos = { line: block.startLine + 1, ch: 0 };
		const endPos = { line: block.endLine, ch: 0 };
		editor.replaceRange(newContent, startPos, endPos);

		const newLineCount = newContent.split("\n").length - 1;
		block.endLine = block.startLine + 1 + newLineCount;
	}
}
