import type { App, Editor, MarkdownView } from "obsidian";
import { TFile } from "obsidian";
import type { Subscription } from "rxjs";
import { type BaseBlock, type BaseEmbedInfo, findBaseEmbeds, findInlineBaseBlocks } from "./base-detection";
import { appendNameFilter, extractFilterValue } from "./base-filter";
import { BaseFilterInput } from "./components";
import type { SettingsStore } from "./core";
import type { BasesImprovementsSettings } from "./types";

interface PendingFocus {
	key: string;
	value: string;
	cursorPosition: number;
}

export class BaseBlockProcessor {
	private filterComponents: Map<string, BaseFilterInput> = new Map();
	private isProcessing = false;
	private pendingFocus: PendingFocus | null = null;
	private subscription: Subscription | null = null;
	private settings: BasesImprovementsSettings;
	private currentFocusIndex = 0;

	constructor(
		private app: App,
		settingsStore: SettingsStore
	) {
		this.settings = settingsStore.currentSettings;
		this.subscription = settingsStore.settings$.subscribe((newSettings) => {
			this.settings = newSettings;
		});
	}

	clearAllFilterComponents(): void {
		for (const component of this.filterComponents.values()) {
			component.destroy();
		}
		this.filterComponents.clear();
		this.currentFocusIndex = 0;
	}

	destroy(): void {
		this.subscription?.unsubscribe();
		this.subscription = null;
		this.clearAllFilterComponents();
	}

	focusNextFilterInput(): void {
		const components = Array.from(this.filterComponents.values());

		if (components.length === 0) {
			return;
		}

		this.currentFocusIndex = this.currentFocusIndex % components.length;
		components[this.currentFocusIndex].focus();
		this.currentFocusIndex = (this.currentFocusIndex + 1) % components.length;
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
		const { codeFenceLanguage, targetEmbeds } = this.settings;

		const inlineBlocks = findInlineBaseBlocks(editor, codeFenceLanguage);
		const embeds = targetEmbeds ? findBaseEmbeds(editor) : [];

		const expectedKeys = this.buildExpectedKeys(currentFile, inlineBlocks, embeds);
		this.removeStaleComponents(expectedKeys);
		this.injectInlineBlockComponents(activeView, editor, currentFile, inlineBlocks);

		if (targetEmbeds) {
			await this.injectEmbedComponents(activeView, editor, currentFile, embeds);
		}
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

	private findContainerForInlineBlock(element: HTMLElement): HTMLElement | null {
		let current: HTMLElement | null = element;
		while (current) {
			if (current.classList.contains("cm-embed-block")) {
				return current;
			}
			current = current.parentElement;
		}
		return null;
	}

	private findContainerForEmbed(element: HTMLElement): HTMLElement | null {
		// For file embeds, the .internal-embed.bases-embed element IS the container
		if (element.classList.contains("internal-embed") && element.classList.contains("bases-embed")) {
			return element;
		}
		return null;
	}

	private hasFilterWrapper(container: HTMLElement): boolean {
		return container.querySelector(".base-filter-wrapper") !== null;
	}

	private injectFilterAboveElement(targetElement: HTMLElement, editor: Editor, block: BaseBlock, key: string): void {
		const container =
			block.type === "file"
				? this.findContainerForEmbed(targetElement)
				: this.findContainerForInlineBlock(targetElement);

		if (!container) {
			return;
		}

		if (this.hasFilterWrapper(container)) {
			return;
		}

		const { inputDebounceMs } = this.settings;

		const filterInput = new BaseFilterInput(
			(value: string, cursorPosition: number) => {
				this.pendingFocus = { key, value, cursorPosition };
				this.updateBaseBlock(editor, block, value);
			},
			"Filter by name...",
			inputDebounceMs
		);

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
			const { codeFenceLanguage } = this.settings;
			const freshBlocks = findInlineBaseBlocks(editor, codeFenceLanguage);
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

		// Ensure content ends with newline to keep closing backticks on separate line
		const contentToInsert = newContent.endsWith("\n") ? newContent : `${newContent}\n`;

		editor.replaceRange(contentToInsert, startPos, endPos);

		const newLineCount = contentToInsert.split("\n").length - 1;
		block.endLine = block.startLine + 1 + newLineCount;
	}
}
