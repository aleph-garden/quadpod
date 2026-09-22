//! `docs/reference/configuration.md` is the argument definition in `src/config.rs`,
//! rendered for the documentation site. This test renders it again and fails when
//! the committed file differs, so the page cannot drift from the binary it
//! describes. The site reads the committed file, which keeps Rust out of its build.
//!
//! `UPDATE_REFERENCE=1 cargo test --test configuration_reference` rewrites the file.

use clap::builder::ArgAction;
use clap::CommandFactory;
use quadpod::config::Config;

const PATH: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/docs/reference/configuration.md");

/// One table cell: a line of Markdown with no pipe that would end the cell.
fn cell(text: &str) -> String {
    text.split_whitespace().collect::<Vec<_>>().join(" ").replace('|', "\\|")
}

fn render() -> String {
    let command = Config::command();
    let mut out = String::from(
        "---\ntitle: Configuration\n---\n\n\
         Every flag `quadpod` accepts. A flag given on the command line wins over its \
         environment variable, which wins over a value from the `--config` file, which \
         wins over the default.\n\n\
         This page is generated from the binary's argument definition by \
         `tests/configuration_reference.rs`, and `cargo test` fails when the two disagree.\n\n\
         | Flag | Environment variable | Default | Meaning |\n\
         |---|---|---|---|\n",
    );
    for arg in command.get_arguments() {
        let Some(long) = arg.get_long() else { continue };
        if matches!(long, "help" | "version") {
            continue;
        }
        let repeatable = matches!(arg.get_action(), ArgAction::Append);
        let env = arg
            .get_env()
            .map(|e| format!("`{}`", e.to_string_lossy()))
            .unwrap_or_default();
        let default = arg
            .get_default_values()
            .iter()
            .map(|v| format!("`{}`", v.to_string_lossy()))
            .collect::<Vec<_>>()
            .join(", ");
        // clap drops the full stop that ends a one-sentence help text.
        let mut help = arg.get_help().map(|h| h.to_string()).unwrap_or_default();
        if !help.ends_with('.') {
            help.push('.');
        }
        let meaning = if repeatable { format!("{help} Repeatable.") } else { help };
        out.push_str(&format!(
            "| `--{long}` | {env} | {default} | {} |\n",
            cell(&meaning)
        ));
    }
    out
}

#[test]
fn the_configuration_reference_matches_the_argument_definition() {
    let rendered = render();
    if std::env::var_os("UPDATE_REFERENCE").is_some() {
        std::fs::write(PATH, &rendered).expect("write docs/reference/configuration.md");
        return;
    }
    let committed = std::fs::read_to_string(PATH).unwrap_or_default();
    assert!(
        committed == rendered,
        "docs/reference/configuration.md is out of date with src/config.rs. \
         Run `UPDATE_REFERENCE=1 cargo test --test configuration_reference` and commit the result."
    );
}
