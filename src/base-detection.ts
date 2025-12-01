import { extractFilterValue } from "./base-filter";

export type BaseBlockType = "inline" | "file";

export interface BaseBlock {
	type: BaseBlockType;
	startLine: number;
	endLine: number;
	content: string;
	filterValue: string;
	filePath?: string;
}

export interface MinimalEditor {
	getLine(line: number): string;
	lineCount(): number;
}

export interface BaseEmbedInfo {
	line: number;
	filePath: string;
}

const BASE_EMBED_REGEX = /^!\[\[([^\]|]+\.base)(?:\|[^\]]+)?\]\]$/;

export function extractBaseEmbed(line: string): string | null {
	const match = line.trim().match(BASE_EMBED_REGEX);
	return match ? match[1] : null;
}

export function findInlineBaseBlocks(editor: MinimalEditor): BaseBlock[] {
	const blocks: BaseBlock[] = [];
	const lineCount = editor.lineCount();

	let inBaseBlock = false;
	let blockStartLine = -1;
	let blockContent = "";

	for (let lineNum = 0; lineNum < lineCount; lineNum++) {
		const lineText = editor.getLine(lineNum);

		if (lineText.trim() === "```base") {
			inBaseBlock = true;
			blockStartLine = lineNum;
			blockContent = "";
		} else if (inBaseBlock && lineText.trim() === "```") {
			blocks.push({
				type: "inline",
				startLine: blockStartLine,
				endLine: lineNum,
				content: blockContent,
				filterValue: extractFilterValue(blockContent),
			});
			inBaseBlock = false;
		} else if (inBaseBlock) {
			blockContent += `${lineText}\n`;
		}
	}

	return blocks;
}

export function findBaseEmbeds(editor: MinimalEditor): BaseEmbedInfo[] {
	const embeds: BaseEmbedInfo[] = [];
	const lineCount = editor.lineCount();

	for (let lineNum = 0; lineNum < lineCount; lineNum++) {
		const lineText = editor.getLine(lineNum);
		const filePath = extractBaseEmbed(lineText);

		if (filePath) {
			embeds.push({ line: lineNum, filePath });
		}
	}

	return embeds;
}
