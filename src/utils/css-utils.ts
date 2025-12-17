const CSS_PREFIX = "bases-improvements-";

export function cls(...classNames: string[]): string {
	return classNames
		.flatMap((name) => name.split(/\s+/))
		.filter((name) => name.length > 0)
		.map((name) => `${CSS_PREFIX}${name}`)
		.join(" ");
}

export function addCls(element: HTMLElement, ...classNames: string[]): void {
	const classes = cls(...classNames);
	if (classes) {
		element.classList.add(...classes.split(/\s+/));
	}
}
export function removeCls(element: HTMLElement, ...classNames: string[]): void {
	const classes = cls(...classNames);
	if (classes) {
		element.classList.remove(...classes.split(/\s+/));
	}
}

export function toggleCls(element: HTMLElement, className: string, force?: boolean): boolean {
	return element.classList.toggle(cls(className), force);
}

export function hasCls(element: HTMLElement, className: string): boolean {
	return element.classList.contains(cls(className));
}
