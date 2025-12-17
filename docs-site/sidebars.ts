import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	docsSidebar: [
		{
			type: "doc",
			id: "index",
			label: "Introduction",
		},
		{
			type: "doc",
			id: "installation",
			label: "Installation",
		},
		{
			type: "doc",
			id: "quickstart",
			label: "Quick Start",
		},
		{
			type: "category",
			label: "Features",
			items: [
				"features/overview",
				"features/dynamic-filtering",
				"features/embed-support",
			],
		},
		{
			type: "doc",
			id: "configuration",
			label: "Configuration",
		},
		{
			type: "doc",
			id: "troubleshooting",
			label: "Troubleshooting",
		},
		{
			type: "doc",
			id: "faq",
			label: "FAQ",
		},
		{
			type: "doc",
			id: "contributing",
			label: "Contributing",
		},
		{
			type: "doc",
			id: "support",
			label: "Support Me",
		},
	],
};

export default sidebars;
