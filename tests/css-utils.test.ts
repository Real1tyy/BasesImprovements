import { beforeEach, describe, expect, it } from "vitest";
import { addCls, cls, hasCls, removeCls, toggleCls } from "../src/utils/css-utils";

describe("cls", () => {
	it("prefixes a single class name", () => {
		expect(cls("button")).toBe("bases-improvements-button");
	});

	it("prefixes multiple class names", () => {
		expect(cls("button", "active")).toBe("bases-improvements-button bases-improvements-active");
	});

	it("handles space-separated class names in a single argument", () => {
		expect(cls("modal calendar")).toBe("bases-improvements-modal bases-improvements-calendar");
	});

	it("handles mixed arguments with spaces", () => {
		expect(cls("button active", "selected")).toBe(
			"bases-improvements-button bases-improvements-active bases-improvements-selected"
		);
	});

	it("filters out empty strings", () => {
		expect(cls("button", "", "active")).toBe("bases-improvements-button bases-improvements-active");
	});

	it("handles whitespace-only strings", () => {
		expect(cls("button", "   ", "active")).toBe("bases-improvements-button bases-improvements-active");
	});

	it("returns empty string for no arguments", () => {
		expect(cls()).toBe("");
	});
});

describe("addCls", () => {
	let element: HTMLElement;

	beforeEach(() => {
		element = document.createElement("div");
	});

	it("adds a prefixed class to an element", () => {
		addCls(element, "active");
		expect(element.classList.contains("bases-improvements-active")).toBe(true);
	});

	it("adds multiple prefixed classes", () => {
		addCls(element, "active", "selected");
		expect(element.classList.contains("bases-improvements-active")).toBe(true);
		expect(element.classList.contains("bases-improvements-selected")).toBe(true);
	});
});

describe("removeCls", () => {
	let element: HTMLElement;

	beforeEach(() => {
		element = document.createElement("div");
		element.classList.add("bases-improvements-active", "bases-improvements-selected");
	});

	it("removes a prefixed class from an element", () => {
		removeCls(element, "active");
		expect(element.classList.contains("bases-improvements-active")).toBe(false);
		expect(element.classList.contains("bases-improvements-selected")).toBe(true);
	});

	it("removes multiple prefixed classes", () => {
		removeCls(element, "active", "selected");
		expect(element.classList.contains("bases-improvements-active")).toBe(false);
		expect(element.classList.contains("bases-improvements-selected")).toBe(false);
	});
});

describe("toggleCls", () => {
	let element: HTMLElement;

	beforeEach(() => {
		element = document.createElement("div");
	});

	it("adds class when not present", () => {
		const result = toggleCls(element, "active");
		expect(result).toBe(true);
		expect(element.classList.contains("bases-improvements-active")).toBe(true);
	});

	it("removes class when present", () => {
		element.classList.add("bases-improvements-active");
		const result = toggleCls(element, "active");
		expect(result).toBe(false);
		expect(element.classList.contains("bases-improvements-active")).toBe(false);
	});

	it("forces add with force=true", () => {
		const result = toggleCls(element, "active", true);
		expect(result).toBe(true);
		expect(element.classList.contains("bases-improvements-active")).toBe(true);
	});

	it("forces remove with force=false", () => {
		element.classList.add("bases-improvements-active");
		const result = toggleCls(element, "active", false);
		expect(result).toBe(false);
		expect(element.classList.contains("bases-improvements-active")).toBe(false);
	});
});

describe("hasCls", () => {
	let element: HTMLElement;

	beforeEach(() => {
		element = document.createElement("div");
	});

	it("returns true when element has the prefixed class", () => {
		element.classList.add("bases-improvements-active");
		expect(hasCls(element, "active")).toBe(true);
	});

	it("returns false when element does not have the prefixed class", () => {
		expect(hasCls(element, "active")).toBe(false);
	});

	it("returns false for unprefixed class name", () => {
		element.classList.add("active");
		expect(hasCls(element, "active")).toBe(false);
	});
});
