import { SettingsStore as GenericSettingsStore } from "@real1ty-obsidian-plugins/utils";
import type { Plugin } from "obsidian";
import { BasesImprovementsSettingsSchema } from "../types";

export class SettingsStore extends GenericSettingsStore<typeof BasesImprovementsSettingsSchema> {
	constructor(plugin: Plugin) {
		super(plugin, BasesImprovementsSettingsSchema);
	}
}
