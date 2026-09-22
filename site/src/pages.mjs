// The published documents: each source under docs/ and the path it is served
// at below MOUNT. An allowlist rather than the directory, so a file added to
// docs/ reaches the site only by being listed here.
//
// Read by the content collection, which loads these files, and by the link
// rewriter, which turns a relative link between two of them into a site path.

export const MOUNT = 'quadpod/docs'

export const PAGES = {
  'index.mdx': '',
  'run.mdx': 'run',
  'data.mdx': 'data',
  'access.mdx': 'access',
  'query.mdx': 'query',
  'uri-space.md': 'reference/uri-space',
  'reference/vocabulary.mdx': 'reference/vocabulary',
  'reference/configuration.md': 'reference/configuration',
  'architecture.md': 'internals/architecture',
  'decisions.md': 'internals/decisions',
  'constraints.md': 'internals/constraints',
  'conformance-findings.md': 'internals/conformance-findings',
  'bearer-auth-alternative.md': 'internals/bearer-auth-alternative'
}

/** The site path a listed source is served at, with a trailing slash. */
export const sitePath = (source) => `/${[MOUNT, PAGES[source]].filter(Boolean).join('/')}/`
