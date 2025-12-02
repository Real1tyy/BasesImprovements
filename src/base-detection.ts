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

const BASE_BLOCK_REGEX = /^[ \t]*```base[ \t]*\r?\n([\s\S]*?)^[ \t]*```[ \t]*$/gm;
const BASE_EMBED_REGEX = /^[ \t]*!\[\[([^\]|]+\.base)(?:\|[^\]]+)?\]\][ \t]*$/gm;

function getFullText(editor: MinimalEditor): string {
	const count = editor.lineCount();
	const lines = Array.from({ length: count }, (_, i) => editor.getLine(i));
	return lines.join("\n");
}

function getLineNumber(text: string, charIndex: number): number {
	let line = 0;
	for (let i = 0; i < charIndex && i < text.length; i++) {
		if (text[i] === "\n") {
			line++;
		}
	}
	return line;
}

function countNewlines(str: string): number {
	let count = 0;
	for (const char of str) {
		if (char === "\n") {
			count++;
		}
	}
	return count;
}

export function extractBaseEmbed(line: string): string | null {
	const match = line.trim().match(/^!\[\[([^\]|]+\.base)(?:\|[^\]]+)?\]\]$/);
	return match ? match[1] : null;
}

export function findInlineBaseBlocks(editor: MinimalEditor): BaseBlock[] {
	const text = getFullText(editor);
	return Array.from(text.matchAll(BASE_BLOCK_REGEX))
		.map((match) => {
			const startLine = getLineNumber(text, match.index);
			const content = match[1];
			const endLine = startLine + countNewlines(match[0]);

			return {
				type: "inline",
				startLine,
				endLine,
				content,
				filterValue: extractFilterValue(content),
			};
		});
}

export function findBaseEmbeds(editor: MinimalEditor): BaseEmbedInfo[] {
	const text = getFullText(editor);
	return Array.from(text.matchAll(BASE_EMBED_REGEX))
		.map((match) => ({
			line: getLineNumber(text, match.index),
			filePath: match[1],
		}));
}