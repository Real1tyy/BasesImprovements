import { debounce, MarkdownView, Plugin } from "obsidian";
import type { Subscription } from "rxjs";
import { BaseBlockProcessor } from "./base-block-processor";
import { SettingsStore } from "./core";
import { BasesImprovementsSettingTab } from "./settings";

export default class BasesImprovementsPlugin extends Plugin {
	private processor!: BaseBlockProcessor;
	private updateDebounced!: ReturnType<typeof debounce>;
	private subscription: Subscription | null = null;
	public settingsStore!: SettingsStore;

	async onload() {
		this.settingsStore = new SettingsStore(this);
		await this.settingsStore.loadSettings();

		this.processor = new BaseBlockProcessor(this.app, this.settingsStore);

		this.addSettingTab(new BasesImprovementsSettingTab(this.app, this, this.settingsStore));

		this.setupDebounce();
		this.setupEventListeners();

		this.subscription = this.settingsStore.settings$.subscribe(() => {
			this.setupDebounce();
			this.processor.clearAllFilterComponents();
			this.updateDebounced();
		});

		this.updateDebounced();
	}

	async onunload() {
		this.subscription?.unsubscribe();
		this.subscription = null;
		this.processor.destroy();
	}

	private setupDebounce(): void {
		const debounceMs = this.settingsStore.currentSettings.updateDebounceMs;
		this.updateDebounced = debounce(() => this.updateFilters(), debounceMs, true);
	}

	private setupEventListeners(): void {
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.processor.clearAllFilterComponents();
				this.updateDebounced();
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", () => {
				this.updateDebounced();
			})
		);
	}

	private async updateFilters(): Promise<void> {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		await this.processor.updateBaseBlockFilters(activeView);
	}
}
