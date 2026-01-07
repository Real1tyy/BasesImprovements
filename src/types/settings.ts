import { z } from "zod";
import { SETTINGS_DEFAULTS } from "../constants";

export const BasesImprovementsSettingsSchema = z.object({
	// Target Settings
	codeFenceLanguage: z.string().default(SETTINGS_DEFAULTS.DEFAULT_CODE_FENCE_LANGUAGE),
	targetEmbeds: z.boolean().default(SETTINGS_DEFAULTS.DEFAULT_TARGET_EMBEDS),

	// Debounce Settings
	inputDebounceMs: z.number().int().min(0).max(2000).default(SETTINGS_DEFAULTS.DEFAULT_INPUT_DEBOUNCE_MS),
	updateDebounceMs: z.number().int().min(0).max(2000).default(SETTINGS_DEFAULTS.DEFAULT_UPDATE_DEBOUNCE_MS),
});

export type BasesImprovementsSettings = z.infer<typeof BasesImprovementsSettingsSchema>;
