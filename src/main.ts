import { debounce, MarkdownView, Plugin } from "obsidian";
import { BaseBlockProcessor } from "./base-block-processor";

export default class BasesImprovementsPlugin extends Plugin {
	private processor!: BaseBlockProcessor;
	private updateDebounced = debounce(() => this.updateFilters(), 150, true);

	async onload() {
		this.processor = new BaseBlockProcessor(this.app);

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

		this.updateDebounced();
	}

	async onunload() {
		this.processor.clearAllFilterComponents();
	}

	private async updateFilters(): Promise<void> {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		await this.processor.updateBaseBlockFilters(activeView);
	}
}
