import { cls, toggleCls } from "../utils";

export type ViewSelectCallback = (viewIndex: number) => void;

export interface ViewOption {
	name: string;
	index: number;
}

export class BaseViewSelector {
	private wrapper: HTMLElement | null = null;
	private buttons: HTMLButtonElement[] = [];
	private selectedIndex = 0;

	constructor(
		private views: ViewOption[],
		private onViewSelect: ViewSelectCallback
	) {}

	createWrapper(): HTMLElement {
		this.wrapper = document.createElement("div");
		this.wrapper.className = cls("view-selector");
		return this.wrapper;
	}

	attachToWrapper(wrapper: HTMLElement): void {
		this.wrapper = wrapper;
		this.renderButtons();
	}

	private renderButtons(): void {
		if (!this.wrapper) {
			return;
		}

		this.buttons = [];
		this.wrapper.empty();

		for (const view of this.views) {
			const button = this.createViewButton(view);
			this.wrapper.appendChild(button);
			this.buttons.push(button);
		}

		this.updateActiveState();
	}

	private createViewButton(view: ViewOption): HTMLButtonElement {
		const button = document.createElement("button");
		button.className = cls("view-button");
		button.textContent = view.name;
		button.dataset.viewIndex = String(view.index);

		button.addEventListener("mousedown", (e) => {
			e.preventDefault();
			this.selectView(view.index);
		});

		return button;
	}

	private selectView(index: number): void {
		if (index === this.selectedIndex) {
			return;
		}

		this.selectedIndex = index;
		this.updateActiveState();
		this.onViewSelect(index);
	}

	private updateActiveState(): void {
		for (const button of this.buttons) {
			const buttonIndex = Number(button.dataset.viewIndex);
			toggleCls(button, "is-active", buttonIndex === this.selectedIndex);
		}
	}

	setSelectedIndex(index: number): void {
		this.selectedIndex = index;
		this.updateActiveState();
	}

	getSelectedIndex(): number {
		return this.selectedIndex;
	}

	getElement(): HTMLElement | null {
		return this.wrapper;
	}

	destroy(): void {
		this.wrapper?.remove();
		this.wrapper = null;
		this.buttons = [];
	}
}
