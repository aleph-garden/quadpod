// @ts-check
import { fileURLToPath } from 'node:url'
import aleph from '@aleph-garden/starlight-theme'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import { relativeLinks } from './src/links.mjs'

export default defineConfig({
  site: 'https://aleph.garden',
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
      description: 'A Solid pod whose storage is one RDF quad store. Part of Aleph Garden.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/aleph-garden/quadpod' }],
      plugins: [aleph({ project: 'quadpod' })],
      sidebar: [
        {
          label: 'Start',
          items: [{ label: 'Overview', link: '/quadpod/docs/' }]
        },
        {
          label: 'Guide',
          items: [
            { label: 'Run a pod', link: '/quadpod/docs/run/' },
            { label: 'Write and read data', link: '/quadpod/docs/data/' },
            { label: 'Control access', link: '/quadpod/docs/access/' },
            { label: 'Query across the pod', link: '/quadpod/docs/query/' }
          ]
        },
        {
          label: 'Reference',
          items: [
            { label: 'URI space', link: '/quadpod/docs/reference/uri-space/' },
            { label: 'Vocabulary', link: '/quadpod/docs/reference/vocabulary/' },
            { label: 'Configuration', link: '/quadpod/docs/reference/configuration/' },
            // rustdoc's own output, copied in by the workflow after the site build.
            { label: 'API (rustdoc)', link: '/quadpod/docs/reference/api/quadpod/' }
          ]
        },
        {
          label: 'Internals',
          items: [
            { label: 'Architecture', link: '/quadpod/docs/internals/architecture/' },
            { label: 'Decisions', link: '/quadpod/docs/internals/decisions/' },
            { label: 'Constraints', link: '/quadpod/docs/internals/constraints/' },
            { label: 'Conformance findings', link: '/quadpod/docs/internals/conformance-findings/' },
            { label: 'Bearer tokens alongside DPoP', link: '/quadpod/docs/internals/bearer-auth-alternative/' }
          ]
        }
      ]
    })
  ]
})
