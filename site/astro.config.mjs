// @ts-check
import { fileURLToPath } from 'node:url'
import aleph from '@aleph-garden/starlight-theme'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import { relativeLinks } from './src/links.mjs'

export default defineConfig({
  site: 'https://aleph.garden',
  // The Worker answers /quadpod/docs/* and nothing outside it, so every file
  // the site emits, scripts, styles and the search index included, has to
  // live under that prefix. The output directory repeats it because the
  // Worker maps a URL path to the same path under dist/.
  base: '/quadpod/docs',
  outDir: './dist/quadpod/docs',
  // The documents live in the repository's docs/ and name the components
  // through this alias instead of a path that counts levels out of it.
  vite: {
    // The sources sit one level up, in the repository's docs/.
    server: { fs: { allow: ['..'] } },
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url))
      }
    }
  },
  markdown: { remarkPlugins: [relativeLinks] },
  integrations: [
    starlight({
      title: 'quadpod',
      // The domain's own icon. Starlight puts `base` in front of a path, and the
      // icon is served by the root site rather than from under this prefix.
      favicon: 'https://aleph.garden/favicon.svg',
      description: 'A Solid pod whose storage is one RDF quad store. Part of Aleph Garden.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/aleph-garden/quadpod' }],
      plugins: [aleph({ project: 'quadpod' })],
      sidebar: [
        {
          label: 'Start',
          items: [{ label: 'Overview', link: '/' }]
        },
        {
          label: 'Guide',
          items: [
            { label: 'Run a pod', link: '/run/' },
            { label: 'Write and read data', link: '/data/' },
            { label: 'Control access', link: '/access/' },
            { label: 'Query across the pod', link: '/query/' }
          ]
        },
        {
          label: 'Reference',
          items: [
            { label: 'URI space', link: '/reference/uri-space/' },
            { label: 'Vocabulary', link: '/reference/vocabulary/' },
            { label: 'Configuration', link: '/reference/configuration/' },
            // rustdoc's own output, copied in by the workflow after the site build.
            { label: 'API (rustdoc)', link: '/reference/api/quadpod/' }
          ]
        },
        {
          label: 'Internals',
          items: [
            { label: 'Architecture', link: '/internals/architecture/' },
            { label: 'Decisions', link: '/internals/decisions/' },
            { label: 'Constraints', link: '/internals/constraints/' },
            { label: 'Conformance findings', link: '/internals/conformance-findings/' },
            { label: 'Bearer tokens alongside DPoP', link: '/internals/bearer-auth-alternative/' }
          ]
        }
      ]
    })
  ]
})
