import { dirname, join, normalize, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGES, sitePath } from './pages.mjs'

const DOCS = fileURLToPath(new URL('../../docs/', import.meta.url))
const REPOSITORY = 'https://github.com/aleph-garden/quadpod/blob/main/'

/** A remark plugin for the documents under docs/. Their relative links are
 *  written for GitHub, where the same files are read, so `decisions.md#adr-13`
 *  has to become the site path of that document. A link to another listed
 *  document gets its site path; a link to a document that is not listed fails
 *  the build, because the site would serve a dead link; a link to any other
 *  file in the repository goes to that file on GitHub. */
export function relativeLinks() {
  return (tree, file) => {
    const from = relative(DOCS, dirname(file.path))
    const visit = (node) => {
      if (node.type === 'link' && isRelative(node.url)) {
        const [path, hash] = node.url.split('#')
        const target = normalize(join(from, path))
        if (target in PAGES) {
          node.url = sitePath(target) + (hash ? `#${hash}` : '')
        } else if (/\.mdx?$/.test(target) && !target.startsWith('..')) {
          throw new Error(`${relative(DOCS, file.path)} links to docs/${target}, which the site does not publish`)
        } else {
          node.url = REPOSITORY + normalize(join('docs', target)) + (hash ? `#${hash}` : '')
        }
      }
      for (const child of node.children ?? []) visit(child)
    }
    visit(tree)
  }
}

function isRelative(url) {
  return !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('/') && !url.startsWith('#')
}
