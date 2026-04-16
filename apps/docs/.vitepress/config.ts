import { defineConfig } from 'vitepress';
import typedocSidebar from '../api/typedoc-sidebar.json' with { type: 'json' };

// Escape bracketed placeholders like <2tabs>, <cursor> that appear in LSP
// protocol-type comments — Vue's SFC parser otherwise rejects them.
const escapeAngleBrackets = {
  name: 'escape-angle-brackets-in-md',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (!id.endsWith('.md')) return null;
    // Replace `<word>` that is not a valid html/vue tag boundary with escaped form
    const replaced = code.replace(/<(\d[a-zA-Z][^>\s]*|cursor)>/g, '&lt;$1&gt;');
    return replaced === code ? null : replaced;
  }
};

export default defineConfig({
  vite: {
    plugins: [escapeAngleBrackets]
  },
  title: 'lspeasy',
  description: 'TypeScript SDK for building Language Server Protocol clients and servers',
  base: '/lspeasy/',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [
    ['meta', { property: 'og:title', content: 'lspeasy' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'TypeScript SDK for building Language Server Protocol clients and servers'
      }
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://pradeepmouli.github.io/lspeasy/' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'lspeasy' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'TypeScript SDK for building Language Server Protocol clients and servers'
      }
    ]
  ],
  sitemap: {
    hostname: 'https://pradeepmouli.github.io/lspeasy'
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/pradeepmouli/lspeasy' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Usage', link: '/guide/usage' }
          ]
        }
      ],
      '/api/': [{ text: 'Packages', items: typedocSidebar }]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/pradeepmouli/lspeasy' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Pradeep Mouli'
    },
    search: { provider: 'local' }
  }
});
