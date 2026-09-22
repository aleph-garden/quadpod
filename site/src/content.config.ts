import { existsSync } from 'node:fs'
import { defineCollection } from 'astro:content'
import { docsSchema } from '@astrojs/starlight/schema'
import { glob } from 'astro/loaders'
import { MOUNT, PAGES } from './pages.mjs'

// The documents live in the repository's docs/, next to the code they
// describe, and the site addresses them rather than holding copies.
const DOCS = new URL('../../docs/', import.meta.url)

// The glob loader skips a pattern that matches nothing, so a listed source
// that was renamed or deleted would vanish from the site without a word.
for (const source of Object.keys(PAGES)) {
  if (!existsSync(new URL(source, DOCS))) {
    throw new Error(`docs/${source} is listed in site/src/pages.mjs and does not exist`)
  }
}

export const collections = {
  docs: defineCollection({
    loader: glob({
      base: DOCS,
      pattern: Object.keys(PAGES),
      generateId: ({ entry }) => [MOUNT, PAGES[entry as keyof typeof PAGES]].filter(Boolean).join('/')
    }),
    schema: docsSchema()
  })
}
