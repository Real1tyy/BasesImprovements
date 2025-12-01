import { vi } from "vitest";

export class Plugin {
	app: App;
	manifest: PluginManifest;

	constructor(app: App, manifest: PluginManifest) {
		this.app = app;
		this.manifest = manifest;
	}

	onload(): Promise<void> | void {}
	onunload(): void {}

	addCommand = vi.fn();
	registerEvent = vi.fn();
}

export class MarkdownView {
	file: TFile | null = null;
	editor: Editor;
	containerEl: HTMLElement;

	constructor() {
		this.editor = createMockEditor([]);
		this.containerEl = document.createElement("div");
	}
}

export interface Editor {
	getLine(line: number): string;
	lineCount(): number;
	replaceRange(replacement: string, from: EditorPosition, to: EditorPosition): void;
}

export interface EditorPosition {
	line: number;
	ch: number;
}

export interface App {
	workspace: Workspace;
	vault: Vault;
}

export interface Workspace {
	on(name: string, callback: () => void): EventRef;
	getActiveViewOfType<T>(type: new () => T): T | null;
}

export interface Vault {
	read(file: TFile): Promise<string>;
	modify(file: TFile, data: string): Promise<void>;
}

export interface TFile {
	path: string;
	name: string;
	basename: string;
	extension: string;
}

export interface PluginManifest {
	id: string;
	name: string;
	version: string;
}

export interface EventRef {
	unsubscribe(): void;
}

// Helper to create mock editor
export function createMockEditor(lines: string[]): Editor {
	return {
		getLine: vi.fn((line: number) => lines[line] || ""),
		lineCount: vi.fn(() => lines.length),
		replaceRange: vi.fn(),
	};
}

// Helper to create mock app
export function createMockApp(): App {
	return {
		workspace: {
			on: vi.fn(() => ({ unsubscribe: vi.fn() })),
			getActiveViewOfType: vi.fn(() => null),
		},
		vault: {
			read: vi.fn(),
			modify: vi.fn(),
		},
	};
}

// Helper to create mock MarkdownView with editor lines
export function createMockMarkdownView(lines: string[]): MarkdownView {
	const view = new MarkdownView();
	view.editor = createMockEditor(lines);
	view.file = {
		path: "test-file.md",
		name: "test-file.md",
		basename: "test-file",
		extension: "md",
	};
	return view;
}
