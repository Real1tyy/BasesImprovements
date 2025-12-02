export type FilterChangeCallback = (value: string, cursorPosition: number) => void;

const DEFAULT_DEBOUNCE_MS = 150;

export class BaseFilterInput {
	private wrapper: HTMLElement | null = null;
	private input: HTMLInputElement | null = null;
	private debounceTimer: NodeJS.Timeout | null = null;
	private currentValue = "";

	constructor(
		private onFilterChange: FilterChangeCallback,
		private placeholder: string = "Filter files by name...",
		private debounceMs: number = DEFAULT_DEBOUNCE_MS
	) {}

	createWrapper(): HTMLElement {
		this.wrapper = document.createElement("div");
		this.wrapper.className = "base-filter-wrapper";
		return this.wrapper;
	}

	attachToWrapper(wrapper: HTMLElement): void {
		this.wrapper = wrapper;

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.placeholder = this.placeholder;
		this.input.className = "base-filter-input";

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

		this.wrapper.appendChild(this.input);
	}

	initialize(container: HTMLElement): void {
		const wrapper = this.createWrapper();
		container.insertBefore(wrapper, container.firstChild);
		this.attachToWrapper(wrapper);
	}

	setValue(value: string): void {
		if (this.input) {
			this.input.value = value;
		}
		this.currentValue = value;
	}

	getValue(): string {
		return this.currentValue;
	}

	focus(): void {
		this.input?.focus();
	}

	setCursorPosition(position: number): void {
		if (this.input) {
			this.input.setSelectionRange(position, position);
		}
	}

	getCursorPosition(): number {
		return this.input?.selectionStart ?? 0;
	}

	hasFocus(): boolean {
		return this.input !== null && document.activeElement === this.input;
	}

	getElement(): HTMLElement | null {
		return this.wrapper;
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

		const newValue = (this.input?.value || "").trim();
		if (newValue !== this.currentValue) {
			const cursorPosition = this.getCursorPosition();
			this.currentValue = newValue;
			this.onFilterChange(newValue, cursorPosition);
		}
	}

	destroy(): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}
		this.wrapper?.remove();
		this.wrapper = null;
		this.input = null;
	}
}
