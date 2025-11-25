import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Docusaurus config for Bases Improvements docs

const config: Config = {
  title: 'Bases Improvements',
  tagline: 'A powerful plugin for enhancing your Obsidian bases workflow.',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://Real1tyy.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/BasesImprovements/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Real1tyy', // Usually your GitHub org/user name.
  projectName: 'BasesImprovements', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/Real1tyy/BasesImprovements/edit/main/docs-site/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        // Your docs are at '/' route
        docsRouteBasePath: '/',
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        highlightSearchTermsOnTargetPage: true,
        // Optional: Customize search placeholder
        searchBarShortcutHint: false,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Bases Improvements',
      logo: {
        alt: 'Bases Improvements Logo',
        src: 'img/logo.svg',
        href: '/', // Fix: Make logo/title link to root
      },
      items: [
        {
          to: '/features/overview',
          label: 'Features',
          position: 'left',
        },
        {
          href: 'https://github.com/Real1tyy/BasesImprovements',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Bases Improvements',
              to: '/',
            },
            {
              label: 'Installation',
              to: '/installation',
            },
            {
              label: 'Quick Start',
              to: '/quickstart',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Contributing & Support',
              to: '/contributing',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/Real1tyy/BasesImprovements/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Repository',
              href: 'https://github.com/Real1tyy/BasesImprovements',
            },
            {
              label: 'Releases',
              href: 'https://github.com/Real1tyy/BasesImprovements/releases',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Support Me',
              to: '/support',
            },
            {
              label: 'Sponsor on GitHub',
              href: 'https://github.com/sponsors/Real1tyy',
            },
            {
              label: 'Buy Me a Coffee',
              href: 'https://www.buymeacoffee.com/real1ty',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Bases Improvements`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    metadata: [
      { name: 'algolia-site-verification', content: '6D4AC65541FD3B7E' },
    ],
    // Disable search until properly configured
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_PUBLIC_API_KEY',
    //   indexName: 'prisma_calendar',
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
