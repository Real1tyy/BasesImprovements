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

export class PluginSettingTab {
	app: App;
	plugin: Plugin;
	containerEl: HTMLElement;

	constructor(app: App, plugin: Plugin) {
		this.app = app;
		this.plugin = plugin;
		this.containerEl = document.createElement("div");
	}

	display(): void {}
	hide(): void {}
}

export class Setting {
	settingEl: HTMLElement;
	infoEl: HTMLElement;
	nameEl: HTMLElement;
	descEl: HTMLElement;
	controlEl: HTMLElement;

	constructor(containerEl: HTMLElement) {
		this.settingEl = document.createElement("div");
		this.infoEl = document.createElement("div");
		this.nameEl = document.createElement("div");
		this.descEl = document.createElement("div");
		this.controlEl = document.createElement("div");
		containerEl.appendChild(this.settingEl);
	}

	setName = vi.fn().mockReturnThis();
	setDesc = vi.fn().mockReturnThis();
	addText = vi.fn().mockReturnThis();
	addToggle = vi.fn().mockReturnThis();
	addDropdown = vi.fn().mockReturnThis();
	addButton = vi.fn().mockReturnThis();
	addTextArea = vi.fn().mockReturnThis();
	setClass = vi.fn().mockReturnThis();
	setHeading = vi.fn().mockReturnThis();
	setDisabled = vi.fn().mockReturnThis();
	then = vi.fn().mockReturnThis();
}

export class Notice {
	message: string;

	constructor(message: string | DocumentFragment, timeout?: number) {
		this.message = typeof message === "string" ? message : "";
	}

	hide = vi.fn();
	setMessage = vi.fn().mockReturnThis();
}

export class TFile {
	path: string;
	name: string;
	basename: string;
	extension: string;
	parent: TFolder | null;
	stat: { mtime: number; ctime: number; size: number };

	constructor(path: string = "test.md") {
		this.path = path;
		this.name = path.split("/").pop() || path;
		this.basename = this.name.replace(/\.[^.]*$/, "");
		this.extension = this.name.split(".").pop() || "";
		this.parent = null;
		this.stat = { mtime: Date.now(), ctime: Date.now(), size: 0 };
	}
}

export class TFolder {
	path: string;
	name: string;
	parent: TFolder | null;
	children: (TFile | TFolder)[];

	constructor(path: string = "") {
		this.path = path;
		this.name = path.split("/").pop() || path;
		this.parent = null;
		this.children = [];
	}
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

// TFile is a class now, see above

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
	view.file = new TFile("test-file.md");
	return view;
}
