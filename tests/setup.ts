import { vi } from "vitest";

// Global test setup
vi.stubGlobal("console", {
	...console,
	log: vi.fn(),
	debug: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
});
