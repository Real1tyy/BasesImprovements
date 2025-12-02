import type { App, Editor, MarkdownView } from "obsidian";
import { TFile } from "obsidian";
import type { Subscription } from "rxjs";
import { type BaseBlock, type BaseEmbedInfo, findBaseEmbeds, findInlineBaseBlocks } from "./base-detection";
import { appendNameFilter, extractFilterValue } from "./base-filter";
import { type ParsedBase, parseBaseContent, reconstructBaseWithView } from "./base-parser";
import { BaseFilterInput, BaseViewSelector, type ViewOption } from "./components";
import type { SettingsStore } from "./core";
import type { BasesImprovementsSettings } from "./types";
import { cls } from "./utils";

interface PendingFocus {
	key: string;
	value: string;
	cursorPosition: number;
}

interface BlockState {
	filterComponent: BaseFilterInput | null;
	viewSelector: BaseViewSelector | null;
	selectedViewIndex: number;
	parsedBase: ParsedBase | null;
	originalBaseContent: string;
	originalEditorContent: string;
	isEmbed: boolean;
	isModified: boolean;
	block: BaseBlock;
}

export class BaseBlockProcessor {
	private blockStates: Map<string, BlockState> = new Map();
	private isProcessing = false;
	private pendingFocus: PendingFocus | null = null;
	private subscription: Subscription | null = null;
	private settings: BasesImprovementsSettings;
	private currentEditor: Editor | null = null;

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
		this.restoreAllOriginalContent();
		for (const state of this.blockStates.values()) {
			state.filterComponent?.destroy();
			state.viewSelector?.destroy();
		}
		this.blockStates.clear();
	}

	destroy(): void {
		this.subscription?.unsubscribe();
		this.subscription = null;
		this.clearAllFilterComponents();
	}

	private restoreAllOriginalContent(): void {
		if (!this.currentEditor) {
			return;
		}

		for (const state of this.blockStates.values()) {
			if (state.isModified) {
				this.restoreOriginalContent(this.currentEditor, state);
			}
		}
	}

	private restoreOriginalContent(editor: Editor, state: BlockState): void {
		if (!state.isModified) {
			return;
		}

		const { block, originalEditorContent, isEmbed } = state;
		const { codeFenceLanguage } = this.settings;

		if (isEmbed) {
			this.replaceEditorRange(editor, block.startLine, block.endLine, originalEditorContent);
		} else {
			const wrappedContent = `\`\`\`${codeFenceLanguage}\n${state.originalBaseContent}\n\`\`\``;
			this.replaceEditorRange(editor, block.startLine, block.endLine + 1, wrappedContent);
		}

		state.isModified = false;
	}

	private hasActiveInput(): boolean {
		for (const state of this.blockStates.values()) {
			if (state.filterComponent?.hasFocus()) {
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

		const shouldProcess = this.settings.showFilterInput || this.settings.showViewSelector;
		if (!activeView || !shouldProcess) {
			this.clearAllFilterComponents();
			this.currentEditor = null;
			return;
		}

		this.isProcessing = true;
		this.currentEditor = activeView.editor;
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
		this.removeStaleComponents(expectedKeys, editor);
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

	private removeStaleComponents(expectedKeys: Set<string>, editor: Editor): void {
		for (const [key, state] of this.blockStates.entries()) {
			if (!expectedKeys.has(key)) {
				if (state.isModified) {
					this.restoreOriginalContent(editor, state);
				}
				state.filterComponent?.destroy();
				state.viewSelector?.destroy();
				this.blockStates.delete(key);
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

			if (this.shouldSkipExistingComponent(key, editor)) {
				continue;
			}

			const targetElement = renderedBlocks[i];
			if (!targetElement) {
				continue;
			}

			const originalEditorContent = this.getEditorRangeContent(editor, block.startLine, block.endLine + 1);
			this.injectComponentsAboveElement(targetElement, editor, block, key, false, originalEditorContent);
		}
	}

	private shouldSkipExistingComponent(key: string, editor: Editor): boolean {
		const existingState = this.blockStates.get(key);
		if (!existingState) {
			return false;
		}

		const filterInDom = existingState.filterComponent?.getElement()?.isConnected;
		const viewSelectorInDom = existingState.viewSelector?.getElement()?.isConnected;

		if (filterInDom || viewSelectorInDom) {
			return true;
		}

		if (existingState.isModified) {
			this.restoreOriginalContent(editor, existingState);
		}
		existingState.filterComponent?.destroy();
		existingState.viewSelector?.destroy();
		this.blockStates.delete(key);
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

			if (this.shouldSkipExistingComponent(key, editor)) {
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
		const originalEditorContent = editor.getLine(embed.line);

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
			this.injectComponentsAboveElement(targetElement, editor, block, key, true, originalEditorContent);
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
		if (element.classList.contains("internal-embed") && element.classList.contains("bases-embed")) {
			return element;
		}
		return null;
	}

	private hasComponentsWrapper(container: HTMLElement): boolean {
		return container.querySelector(`.${cls("components-wrapper")}`) !== null;
	}

	private injectComponentsAboveElement(
		targetElement: HTMLElement,
		editor: Editor,
		block: BaseBlock,
		key: string,
		isEmbed: boolean,
		originalEditorContent: string
	): void {
		const container = isEmbed
			? this.findContainerForEmbed(targetElement)
			: this.findContainerForInlineBlock(targetElement);

		if (!container) {
			return;
		}

		if (this.hasComponentsWrapper(container)) {
			return;
		}

		const parsedBase = parseBaseContent(block.content);

		const blockState: BlockState = {
			filterComponent: null,
			viewSelector: null,
			selectedViewIndex: 0,
			parsedBase,
			originalBaseContent: block.content,
			originalEditorContent,
			isEmbed,
			isModified: false,
			block,
		};

		const componentsWrapper = document.createElement("div");
		componentsWrapper.className = cls("components-wrapper");
		componentsWrapper.dataset.blockLine = String(block.startLine);
		componentsWrapper.dataset.filterKey = key;

		container.insertBefore(componentsWrapper, container.firstChild);

		this.injectViewSelector(componentsWrapper, editor, blockState);
		this.injectFilterInput(componentsWrapper, editor, block, key, blockState);

		this.blockStates.set(key, blockState);
	}

	private injectViewSelector(wrapper: HTMLElement, editor: Editor, blockState: BlockState): void {
		const { showViewSelector } = this.settings;
		const { parsedBase } = blockState;

		if (!showViewSelector || !parsedBase?.hasMultipleViews) {
			return;
		}

		const viewOptions: ViewOption[] = parsedBase.views.map((view, index) => ({
			name: view.name,
			index,
		}));

		const viewSelector = new BaseViewSelector(viewOptions, (viewIndex: number) => {
			blockState.selectedViewIndex = viewIndex;
			this.applySelectedView(editor, blockState);
		});

		const selectorWrapper = viewSelector.createWrapper();
		wrapper.appendChild(selectorWrapper);
		viewSelector.attachToWrapper(selectorWrapper);

		blockState.viewSelector = viewSelector;
	}

	private injectFilterInput(
		wrapper: HTMLElement,
		editor: Editor,
		block: BaseBlock,
		key: string,
		blockState: BlockState
	): void {
		const { showFilterInput, inputDebounceMs } = this.settings;

		if (!showFilterInput) {
			return;
		}

		const filterInput = new BaseFilterInput(
			(value: string, cursorPosition: number) => {
				this.pendingFocus = { key, value, cursorPosition };
				this.applyFilterValue(editor, blockState, value);
			},
			"Filter by name...",
			inputDebounceMs
		);

		const filterWrapper = filterInput.createWrapper();
		wrapper.appendChild(filterWrapper);
		filterInput.attachToWrapper(filterWrapper);
		filterInput.setValue(block.filterValue);

		blockState.filterComponent = filterInput;

		this.restoreFocusIfPending(key, filterInput);
	}

	private applySelectedView(editor: Editor, blockState: BlockState): void {
		if (!blockState.parsedBase) {
			return;
		}

		const newContent = reconstructBaseWithView(blockState.parsedBase, blockState.selectedViewIndex);
		const filterValue = blockState.filterComponent?.getValue() || "";
		const finalContent = filterValue ? appendNameFilter(newContent, filterValue) : newContent;

		this.applyTemporaryContent(editor, blockState, finalContent);
	}

	private applyFilterValue(editor: Editor, blockState: BlockState, filterValue: string): void {
		let baseContent: string;

		if (blockState.parsedBase?.hasMultipleViews) {
			baseContent = reconstructBaseWithView(blockState.parsedBase, blockState.selectedViewIndex);
		} else {
			baseContent = blockState.originalBaseContent;
		}

		const finalContent = filterValue ? appendNameFilter(baseContent, filterValue) : baseContent;
		this.applyTemporaryContent(editor, blockState, finalContent);

		blockState.block.filterValue = filterValue;
	}

	private applyTemporaryContent(editor: Editor, blockState: BlockState, newContent: string): void {
		const { block } = blockState;
		const { codeFenceLanguage } = this.settings;

		const wrappedContent = `\`\`\`${codeFenceLanguage}\n${newContent}\n\`\`\``;

		if (blockState.isEmbed) {
			this.replaceEditorRange(editor, block.startLine, block.startLine + 1, wrappedContent);
		} else {
			this.replaceEditorRange(editor, block.startLine, block.endLine + 1, wrappedContent);
		}

		const newLineCount = wrappedContent.split("\n").length;
		block.endLine = block.startLine + newLineCount - 1;
		block.content = newContent;
		blockState.isModified = true;
	}

	private replaceEditorRange(editor: Editor, startLine: number, endLine: number, newContent: string): void {
		const startPos = { line: startLine, ch: 0 };
		const endLineContent = editor.getLine(endLine - 1);
		const endPos = { line: endLine - 1, ch: endLineContent?.length || 0 };
		editor.replaceRange(newContent, startPos, endPos);
	}

	private getEditorRangeContent(editor: Editor, startLine: number, endLine: number): string {
		const lines: string[] = [];
		for (let i = startLine; i < endLine; i++) {
			lines.push(editor.getLine(i));
		}
		return lines.join("\n");
	}

	private restoreFocusIfPending(key: string, filterInput: BaseFilterInput): void {
		if (this.pendingFocus && this.pendingFocus.key === key) {
			filterInput.setValue(this.pendingFocus.value);
			filterInput.focus();
			filterInput.setCursorPosition(this.pendingFocus.cursorPosition);
			this.pendingFocus = null;
		}
	}
}
