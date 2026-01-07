import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
	title: "Bases Improvements",
	tagline: "Enhance your Obsidian Bases workflow with dynamic search filtering",
	favicon: "img/favicon.ico",

	url: "https://Real1tyy.github.io",
	baseUrl: "/BasesImprovements/",

	organizationName: "Real1tyy",
	projectName: "BasesImprovements",

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",

	trailingSlash: false,

	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			{
				docs: {
					path: "docs",
					routeBasePath: "/",
					sidebarPath: "./sidebars.ts",
					editUrl: "https://github.com/Real1tyy/BasesImprovements/edit/main/docs-site/",
					showLastUpdateAuthor: true,
					showLastUpdateTime: true,
				},
				blog: false,
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themes: [
		[
			"@easyops-cn/docusaurus-search-local",
			{
				hashed: true,
				docsRouteBasePath: "/",
				indexDocs: true,
				indexBlog: false,
				indexPages: true,
				highlightSearchTermsOnTargetPage: true,
				searchBarShortcutHint: false,
			},
		],
	],

	themeConfig: {
		image: "img/bases-improvements-social.png",
		colorMode: {
			defaultMode: "dark",
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: "Bases Improvements",
			logo: {
				alt: "Bases Improvements Logo",
				src: "img/logo.jpeg",
				href: "/",
			},
			items: [
				{
					to: "/features/overview",
					label: "Features",
					position: "left",
				},
				{
					to: "/configuration",
					label: "Configuration",
					position: "left",
				},
				{
					href: "https://github.com/Real1tyy/BasesImprovements",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					title: "Docs",
					items: [
						{
							label: "Introduction",
							to: "/",
						},
						{
							label: "Installation",
							to: "/installation",
						},
						{
							label: "Quick Start",
							to: "/quickstart",
						},
						{
							label: "Configuration",
							to: "/configuration",
						},
					],
				},
				{
					title: "Community",
					items: [
						{
							label: "Contributing",
							to: "/contributing",
						},
						{
							label: "GitHub Issues",
							href: "https://github.com/Real1tyy/BasesImprovements/issues",
						},
					],
				},
				{
					title: "More",
					items: [
						{
							label: "Repository",
							href: "https://github.com/Real1tyy/BasesImprovements",
						},
						{
							label: "Releases",
							href: "https://github.com/Real1tyy/BasesImprovements/releases",
						},
					],
				},
				{
					title: "Support",
					items: [
						{
							label: "Support My Work",
							href: "https://github.com/Real1tyy#-support-my-work",
						},
					],
				},
			],
			copyright: `© ${new Date().getFullYear()} Bases Improvements`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
			additionalLanguages: ["bash", "json", "typescript", "yaml", "markdown"],
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
