export interface ParsedView {
	name: string;
	content: string;
}

export interface ParsedBase {
	topLevelContent: string;
	views: ParsedView[];
	hasMultipleViews: boolean;
}

/**
 * Parses a base code block content to extract top-level content and individual views.
 * Top-level content includes everything before `views:` (formulas, filters, etc.)
 * Each view is extracted with its name and content.
 */
export function parseBaseContent(content: string): ParsedBase {
	const lines = content.split("\n");

	const viewsLineIndex = findViewsLineIndex(lines);

	if (viewsLineIndex === -1) {
		return {
			topLevelContent: content,
			views: [],
			hasMultipleViews: false,
		};
	}

	const topLevelContent = lines.slice(0, viewsLineIndex + 1).join("\n");
	const viewsContent = lines.slice(viewsLineIndex + 1);
	const views = extractViews(viewsContent);

	return {
		topLevelContent,
		views,
		hasMultipleViews: views.length > 1,
	};
}

function findViewsLineIndex(lines: string[]): number {
	return lines.findIndex((line) => line.trim() === "views:");
}

function extractViews(viewsContent: string[]): ParsedView[] {
	const views: ParsedView[] = [];
	let currentView: { name: string; lines: string[] } | null = null;

	for (const line of viewsContent) {
		const viewStart = parseViewStart(line);

		if (viewStart) {
			if (currentView) {
				views.push(createParsedView(currentView));
			}
			currentView = { name: viewStart.name, lines: [line] };
		} else if (currentView) {
			currentView.lines.push(line);
		}
	}

	if (currentView) {
		views.push(createParsedView(currentView));
	}

	return views;
}

function parseViewStart(line: string): { name: string } | null {
	// Match lines like "  - type: table" which indicate a new view
	const typeMatch = line.match(/^(\s*)-\s*type:\s*\w+/);
	if (!typeMatch) {
		return null;
	}

	// Default name, will be overwritten if name property is found
	return { name: "View" };
}

function createParsedView(view: { name: string; lines: string[] }): ParsedView {
	const content = view.lines.join("\n");
	const name = extractViewName(content) || view.name;

	return { name, content };
}

function extractViewName(content: string): string | null {
	const nameMatch = content.match(/^\s*name:\s*(.+)$/m);
	return nameMatch ? nameMatch[1].trim() : null;
}

/**
 * Reconstructs a base code block with only the selected view.
 * Combines top-level content with the specific view.
 */
export function reconstructBaseWithView(parsed: ParsedBase, viewIndex: number): string {
	if (viewIndex < 0 || viewIndex >= parsed.views.length) {
		return parsed.topLevelContent;
	}

	const selectedView = parsed.views[viewIndex];
	return `${parsed.topLevelContent}\n${selectedView.content}`;
}
