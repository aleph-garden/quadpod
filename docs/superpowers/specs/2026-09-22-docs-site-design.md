# Documentation site

A reader-facing documentation site for quadpod at `https://aleph.garden/quadpod/docs/`,
built from this repository and deployed as its own Worker. It follows the pattern the
Vitrine documentation uses at `/vitrine/docs/`.

## Audience

Two readers, in this order: someone who wants to run a pod, and someone writing an
application against one. The maintainer documents already in `docs/` stay what they are and
appear under a separate Internals section, for readers who want the reasoning.

## Status labels

Every section that describes a capability opens with a status line in the maturity
vocabulary of `aleph-garden/planning/research/narrative-and-voice.md` section 5:

| Label | Means | The line carries |
|---|---|---|
| Running | used on a named machine within the last 30 days | the machine or URL, the date of last use |
| Buildable | a stranger reaches what the page promises from a clean checkout | the date the page's own commands last ran from a clean checkout |
| Prototype | runs for the author, would not survive a stranger | the thing that breaks first |
| Specified | a document defines the contract, no code implements it | a link to that document |
| Note | a written idea with no contract and no code | a link to the idea, and "the shape may change entirely" |
| Parked | ran once, stopped | the last commit date and the reason |

Rules carried over from that section:

- A label attaches to the smallest unit that can be true. The pod as a whole and one of its
  features carry separate labels on the same page.
- Every status line carries the date it was checked and one sentence of consequence for the
  reader.
- A capability with a name and nothing behind it gets no page and no label.
- A label is assigned from evidence the page names. Where the repository holds no evidence
  for Running or Buildable (a host that runs the pod, a clean-checkout run), the label is
  Prototype until Christopher supplies it.

The line is a component, `<Status label="…" checked="YYYY-MM-DD">consequence</Status>`,
rendered as a callout at the head of the section. `label` accepts only the six values
above; anything else fails the build.

## Pages

Site paths are under `/quadpod/docs/`. Sources are in `docs/`.

| Path | Source | Content |
|---|---|---|
| `/` | `docs/index.mdx` | What quadpod is, the status of the whole, who it is for |
| `/run/` | `docs/run.mdx` | Build, identity provider, starting the pod, deployment. Draws on `README.md` and `deployment.md` |
| `/data/` | `docs/data.mdx` | `PUT` and `GET`, content negotiation, containers, blobs |
| `/access/` | `docs/access.mdx` | Web Access Control, and what "the nearest ACL wins" means for a writer of ACLs |
| `/query/` | `docs/query.mdx` | Questions across the whole pod, which is why every resource is a named graph in one store |
| `/reference/uri-space/` | `docs/uri-space.md` | The existing contract, unchanged in content |
| `/reference/vocabulary/` | `docs/reference/vocabulary.mdx` | Every term in `docs/ns/quadpod.ttl`, generated at build |
| `/reference/api/` | `cargo doc --no-deps` output | The library's API documentation from rustdoc, with rustdoc's own layout and search. The Reference section of the sidebar links to it |
| `/reference/configuration/` | `docs/reference/configuration.md` | Every command-line flag and its environment variable, generated from the binary's argument definition |
| `/internals/<name>/` | `docs/{architecture,decisions,constraints,conformance-findings,bearer-auth-alternative}.md` | The existing maintainer documents |

The site loads an allowlist of these sources, never the whole directory, so `docs/superpowers/`
and anything added later stays off the site until it is listed.

## Generated references

**Vocabulary.** A component parses `docs/ns/quadpod.ttl` at build time and renders one entry
per term: the CURIE, the full IRI, `rdfs:label`, `rdfs:comment`. Editing the Turtle file
changes the page with no second edit.

**Configuration.** A cargo test renders the argument definition in `src/config.rs` (flag,
environment variable, default, help text) to Markdown and fails when the result differs from
the committed `docs/reference/configuration.md`. The test's failure message names the command
that rewrites the file. The committed file is what the site reads, so the site build needs no
Rust toolchain.

**API.** The workflow runs `cargo doc --no-deps` in the Nix dev shell and copies
`target/doc/` into the site's output under `reference/api/` before deploying. A local
`bun run build` without that step produces every other page and leaves the sidebar link
without a target.

## The existing documents

Starlight requires a `title` in front matter. Each existing document gains front matter with
its title, and loses its own `# ` heading, which Starlight renders from the title. The content
is otherwise unchanged.

Relative links between documents (`[decisions.md](decisions.md#adr-13)`) keep working on
GitHub, where the files are also read. A remark plugin in the site rewrites a relative link to
a listed source into its site path at build time. A link to a document that is not listed
fails the build.

## Layout in the repository

```
site/                  Astro + Starlight, built with bun
  package.json
  astro.config.mjs     sidebar, remark plugin
  src/content.config.ts   the allowlist and the /quadpod/docs mount
  src/components/Status.astro
  src/components/Vocabulary.astro
  wrangler.toml        Worker "quadpod-docs", routes aleph.garden/quadpod/docs and /quadpod/docs/*
.github/workflows/docs.yml   on push to main touching docs/** or site/**: build, deploy
```

Deploying needs the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
Setting them is Christopher's step.

## Decisions recorded with the scaffold

Two decisions go into `docs/decisions.md` in the commit that adds `site/`:

- **ADR-15: The documentation site lives in this repository, with bun in the dev shell.** A
  document changes in the same commit as the code it describes, which a site in another
  repository would split. The cost is a second toolchain beside Cargo. Rejected: keeping only
  the Markdown here and the site scaffold in `www`.
- **ADR-16: The configuration reference is generated by a cargo test and committed.** Flags,
  environment variables and defaults stay exact, and the site build needs no Rust; only the
  workflow's rustdoc step does. Rejected:
  a hand-written page guarded by a constraint that only checks each flag's name appears.

## Out of scope

- The navigation bar on the aleph.garden landing page, and whether its "Docs" entry points at
  one project or at an index.
- A search index beyond Starlight's built-in one.
- Translating any page.

## Acceptance

1. `bun run build` in `site/` succeeds from a clean checkout and writes every path in the
   table above.
2. The build fails when a `Status` carries an unknown label, when a listed document links to
   an unlisted one, and when a source in the allowlist is missing.
3. `cargo test` fails when `docs/reference/configuration.md` is out of date with
   `src/config.rs`, and passes after the command its message names is run.
4. Every page from `/` through `/query/` opens with a `Status` for the page's subject, and each
   capability section inside it carries its own.
5. After the workflow runs on `main`, `https://aleph.garden/quadpod/docs/` answers 200,
   `https://aleph.garden/quadpod/docs/reference/vocabulary/` lists `quadpod:containsGraph`,
   and `https://aleph.garden/quadpod/docs/reference/api/quadpod/` answers 200.
