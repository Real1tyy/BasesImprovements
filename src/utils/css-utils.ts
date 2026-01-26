import { createCssUtils } from "@real1ty-obsidian-plugins/core";

/**
 * CSS utilities for BasesImprovements plugin.
 * Uses the shared factory with "bases-improvements-" prefix.
 */
const { cls, addCls, removeCls, toggleCls, hasCls } = createCssUtils("bases-improvements-");

export { cls, addCls, removeCls, toggleCls, hasCls };
