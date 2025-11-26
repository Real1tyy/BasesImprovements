const DEFAULT_DEBOUNCE_MS = 150;

export type FilterChangeCallback = (value: string) => void;

export class BaseFilterInput {
	private wrapper: HTMLElement;
	private input: HTMLInputElement;
	private debounceTimer: NodeJS.Timeout | null = null;
	private currentValue: string;

	constructor(
		private onFilterChange: FilterChangeCallback,
		private placeholder: string = "Filter files by name...",
		private debounceMs: number = DEFAULT_DEBOUNCE_MS
	) {
		this.currentValue = "";
		this.wrapper = this.createWrapper();
		this.input = this.createInput();
		this.wrapper.appendChild(this.input);
		this.attachEventListeners();
	}

	private createWrapper(): HTMLElement {
		const wrapper = document.createElement("div");
		wrapper.className = "base-filter-wrapper";
		wrapper.style.cssText = `
			padding: 8px;
			margin: 4px 0;
			background: var(--background-secondary);
			border-radius: 4px;
			border: 1px solid var(--background-modifier-border);
		`;
		return wrapper;
	}

	private createInput(): HTMLInputElement {
		const input = document.createElement("input");
		input.type = "text";
		input.placeholder = this.placeholder;
		input.className = "base-filter-input";
		input.style.cssText = `
			width: 100%;
			padding: 6px 10px;
			border: 1px solid var(--background-modifier-border);
			border-radius: 4px;
			background: var(--background-primary);
			color: var(--text-normal);
			font-size: 14px;
		`;
		return input;
	}

	private attachEventListeners(): void {
		this.input.addEventListener("input", () => {
			this.handleInputChange();
		});

		this.input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				this.handleImmediateFilter();
			}
		});

		this.input.addEventListener("blur", () => {
			this.handleImmediateFilter();
		});
	}

	private handleInputChange(): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = setTimeout(() => {
			this.handleImmediateFilter();
		}, this.debounceMs);
	}

	private handleImmediateFilter(): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
			this.debounceTimer = null;
		}

		const newValue = this.input.value.trim();
		if (newValue !== this.currentValue) {
			this.currentValue = newValue;
			this.onFilterChange(newValue);
		}
	}

	setValue(value: string): void {
		this.input.value = value;
		this.currentValue = value;
	}

	getValue(): string {
		return this.currentValue;
	}

	focus(): void {
		this.input.focus();
	}

	getElement(): HTMLElement {
		return this.wrapper;
	}

	destroy(): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}
		this.input.removeEventListener("input", () => this.handleInputChange());
		this.input.removeEventListener("keydown", () => {});
		this.input.removeEventListener("blur", () => this.handleImmediateFilter());
		this.wrapper.remove();
	}
}

