const CSS_PREFIX = "bases-improvements-";

/**
 * Prefixes class names with the standard plugin prefix.
 * Handles multiple class names and automatically adds the prefix.
 *
 * @example
 * cls("filter-wrapper") => "bases-improvements-filter-wrapper"
 * cls("button", "active") => "bases-improvements-button bases-improvements-active"
 * cls("modal calendar") => "bases-improvements-modal bases-improvements-calendar"
 */
export function cls(...classNames: string[]): string {
	return classNames
		.flatMap((name) => name.split(/\s+/))
		.filter((name) => name.length > 0)
		.map((name) => `${CSS_PREFIX}${name}`)
		.join(" ");
}

/**
 * Adds prefixed class names to an element.
 *
 * @example
 * addCls(element, "active", "selected")
 */
export function addCls(element: HTMLElement, ...classNames: string[]): void {
	const classes = cls(...classNames);
	if (classes) {
		element.classList.add(...classes.split(/\s+/));
	}
}

/**
 * Removes prefixed class names from an element.
 *
 * @example
 * removeCls(element, "active", "selected")
 */
export function removeCls(element: HTMLElement, ...classNames: string[]): void {
	const classes = cls(...classNames);
	if (classes) {
		element.classList.remove(...classes.split(/\s+/));
	}
}

/**
 * Toggles prefixed class names on an element.
 *
 * @example
 * toggleCls(element, "active")
 * toggleCls(element, "active", true) // force add
 * toggleCls(element, "active", false) // force remove
 */
export function toggleCls(element: HTMLElement, className: string, force?: boolean): boolean {
	return element.classList.toggle(cls(className), force);
}

/**
 * Checks if element has a prefixed class.
 *
 * @example
 * hasCls(element, "active") // checks for "bases-improvements-active"
 */
export function hasCls(element: HTMLElement, className: string): boolean {
	return element.classList.contains(cls(className));
}
