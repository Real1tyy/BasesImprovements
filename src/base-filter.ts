export function extractFilterValue(content: string): string {
	const match = content.match(/file\.name\.contains\(["']([^"']*)["']\)/);
	return match ? match[1] : "";
}

export function appendNameFilter(content: string, filterValue: string): string {
	const lines = content.split("\n").filter((line) => !line.includes("file.name.contains"));

	if (!filterValue) {
		return lines.join("\n");
	}

	// Detect indentation from existing FILTER lines only (- file.), use default "    " (4 spaces)
	const existingFilterLine = lines.find((line) => line.trimStart().startsWith("- file."));
	const filterIndent = existingFilterLine ? existingFilterLine.match(/^(\s*)/)?.[1] || "    " : "    ";

	const filterLine = `${filterIndent}- file.name.contains("${filterValue}")`;

	const andIndex = lines.findIndex((line) => line.trim() === "and:");

	if (andIndex !== -1) {
		let lastFilterIndex = andIndex;
		for (let i = andIndex + 1; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			if (!trimmed) {
				continue;
			}

			if (line.match(/^\s+- /)) {
				lastFilterIndex = i;
				continue;
			}

			break;
		}

		lines.splice(lastFilterIndex + 1, 0, filterLine);
		return lines.join("\n");
	}

	const filtersIndex = lines.findIndex((line) => line.trim() === "filters:");

	if (filtersIndex !== -1) {
		const filtersIndent = lines[filtersIndex].match(/^(\s*)/)?.[1] || "";
		const andIndent = `${filtersIndent}  `;
		lines.splice(filtersIndex + 1, 0, `${andIndent}and:`, filterLine);
		return lines.join("\n");
	}

	const viewsIndex = lines.findIndex((line) => line.trim() === "views:");

	const filtersSection = ["filters:", "  and:", filterLine];

	if (viewsIndex !== -1) {
		lines.splice(viewsIndex, 0, ...filtersSection);
	} else {
		let insertIndex = 0;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].trim()) {
				insertIndex = i;
				break;
			}
			insertIndex = i + 1;
		}
		lines.splice(insertIndex, 0, ...filtersSection);
	}

	return lines.join("\n");
}
