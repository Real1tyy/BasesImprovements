import { SettingsUIBuilder } from "@real1ty-obsidian-plugins/utils";
import { type App, PluginSettingTab, Setting } from "obsidian";
import type { SettingsStore } from "../core";
import type { BasesImprovementsSettingsSchema } from "../types";

export class BasesImprovementsSettingTab extends PluginSettingTab {
	private ui: SettingsUIBuilder<typeof BasesImprovementsSettingsSchema>;

	constructor(
		app: App,
		plugin: { settingsStore: SettingsStore },
		private settingsStore: SettingsStore
	) {
		super(app, plugin as never);
		this.ui = new SettingsUIBuilder(this.settingsStore);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		this.addTargetSettings(containerEl);
		this.addDebounceSettings(containerEl);
	}

	private addTargetSettings(containerEl: HTMLElement): void {
		new Setting(containerEl).setName("Target settings").setHeading();

		this.ui.addText(containerEl, {
			key: "codeFenceLanguage",
			name: "Code fence language",
			desc: "The code fence language to target for inline base blocks (e.g., 'base', 'bases', 'dataview')",
			placeholder: "base",
		});

		this.ui.addToggle(containerEl, {
			key: "targetEmbeds",
			name: "Target embeds",
			desc: "Whether to also inject filter inputs above embedded .base files (![[file.base]])",
		});

		this.ui.addToggle(containerEl, {
			key: "showFilterInput",
			name: "Show filter input",
			desc: "Whether to render the search/filter input above targeted blocks",
		});
	}

	private addDebounceSettings(containerEl: HTMLElement): void {
		new Setting(containerEl).setName("Performance settings").setHeading();

		this.ui.addSlider(containerEl, {
			key: "inputDebounceMs",
			name: "Input debounce (ms)",
			desc: "How long to wait after typing before applying the filter (0-2000ms)",
			min: 0,
			max: 2000,
			step: 50,
		});

		this.ui.addSlider(containerEl, {
			key: "updateDebounceMs",
			name: "Update debounce (ms)",
			desc: "How long to wait after editor changes before updating filter components (0-2000ms)",
			min: 0,
			max: 2000,
			step: 50,
		});
	}
}
