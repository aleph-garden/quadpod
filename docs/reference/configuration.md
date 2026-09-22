---
title: Configuration
---

Every flag `quadpod` accepts. A flag given on the command line wins over its environment variable, which wins over a value from the `--config` file, which wins over the default.

This page is generated from the binary's argument definition by `tests/configuration_reference.rs`, and `cargo test` fails when the two disagree.

| Flag | Environment variable | Default | Meaning |
|---|---|---|---|
| `--base-uri` | `POD_BASE_URI` | `http://localhost:3000/` | Public base URI of this pod. Absolute, with a trailing slash. All minted URLs and the DPoP `htu` derive from this, never from the socket. |
| `--owner-webid` | `POD_OWNER_WEBID` |  | WebID of the pod owner. Required: the root ACL is provisioned for it, and a pod with no known owner could only be all-open or all-closed. |
| `--trusted-issuer` | `POD_TRUSTED_ISSUERS` |  | Trusted access-token issuer. Repeatable; may also be given as a comma-separated list via the environment variable. Empty = open federation (any issuer may proceed to the WebID-issuer binding check). Repeatable. |
| `--expected-audience` | `POD_EXPECTED_AUDIENCE` |  | Expected access-token `aud` value. Unset = no audience check. |
| `--allow-insecure-host` | `POD_ALLOW_INSECURE_HOSTS` |  | A host the operator vouches for: the private-IP filter and the https-only rule do not apply to it. Repeatable. `host` opens every port on that host; `host:port` opens only that port. Everything else, redirect refusal, IP pinning, body cap, timeout, still applies. Pair it with `--trusted-issuer` so an untrusted issuer is rejected before any fetch is attempted. Repeatable. |
| `--listen` | `POD_LISTEN` | `127.0.0.1:3000` | Address to bind. Plain HTTP, keep it behind the reverse proxy. |
| `--reset-root-acl` | `POD_RESET_ROOT_ACL` |  | Overwrite the root ACL with the owner's default grant on startup, even if one already exists. The only way back from a root ACL that grants nobody (not even the owner) Control, see `wac::provision::provision_root_acl`. Off by default: every other start must leave an operator's or owner's own root ACL exactly as they left it. Accepts boolish values: 1, 0, true, false, yes, no, on, off (case-insensitive). Both `--reset-root-acl` (bare flag) and `POD_RESET_ROOT_ACL=1` work as documented. |
| `--config` | `POD_CONFIG` |  | A TOML file supplying any of the values below. Nothing is loaded unless this names a path: there is no search path, so a pod cannot start against a file that is invisible to whoever reads the command line. A path that is named but unreadable, or is not valid TOML, refuses the start rather than falling back to flags alone. |
| `--rdf-store` | `POD_RDF_STORE` | `memory` | Where the RDF lives. `memory` keeps it in this process, so every restart is a fresh pod. `rocksdb:<dir>` holds it in `<dir>`, which exactly one process may open at a time (`docs/decisions.md`, ADR-7). |
| `--blob-store` | `POD_BLOB_STORE` | `memory` | Where non-RDF resource bytes live. `memory` keeps them in process, matching the triple store, so the pod is uniformly ephemeral rather than making blobs outlive the triples describing them. `local:<dir>` mirrors the URL tree under `<dir>`, so it can be read and backed up with ordinary tools. |
| `--op-signing-keys` | `POD_OP_SIGNING_KEYS` |  | Private JWKS file holding the OP's signing keys. Setting this turns the OP on: the pod serves `/.well-known/openid-configuration` and `/.well-known/jwks.json` and can mint tokens. Unset = the OP is off and the pod stays the verify-only server it is without it. A missing file is generated; an existing one is never rewritten. |
| `--max-body-bytes` | `POD_MAX_BODY_BYTES` | `67108864` | Largest request body accepted, in bytes, for every write path. axum applies a 2 MiB default of its own when nothing is set; naming it here makes a `413` a statement about this pod rather than a framework artefact. The body is buffered whole in memory, which is the real ceiling behind this number. |
