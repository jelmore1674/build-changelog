![release](https://img.shields.io/github/v/release/jelmore1674/build-changelog?display_name=release&logo=npm&logoColor=CB3837)
![issues](https://img.shields.io/github/issues/jelmore1674/build-changelog)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](/tree/main?tab=MIT-1-ov-file)

# build-changelog

> Simplify managing changelog files.

The aim of `build-changelog` is to simplify changelogs, by letting contributors add a separate file
to put their changes, then generating the changelog.

Inspiration from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Common Changelog](https://common-changelog.org/)

<!--toc:start-->

## Table of Contents

- [Changelog](#changelog)
  - [Simple Example](#simple-example)
  - [Complex Example](#complex-example)
- [Actions](#actions)
  - [Release Notes](#release-notes)
    - [Notes Simple Example](#notes-simple-example)
  - [Enforce Changelog](#enforce-changelog)

<!--toc:end-->

## Changelog

To begin using `build-changelog` first create a `changelog` directory.

> [!WARNING]
> If you have an existing `CHANGELOG.md`. Make sure it adheres to the format.
>
> - All versions should use semantic versions with an h2 heading.
> - All changes should be under an h3 with one of the following keywords.
>   - `added`
>   - `changed`
>   - `deprecated`
>   - `fixed`
>   - `removed`
>   - `security`

### Simple Example

```yaml
# changelog/<issue-or-unique-file-name>.yml
changed:
  - This is an example commit message.
```

> [!NOTE]
> You can also use toml if you prefer for the changelog file.

```toml
# changelog/<issue-or-unique-file-name>.toml
changed = [
  "This is an example change."
]
```

The output of that file would be something like this.

```md
## [Unreleased] - TBD

### Changed

- This is an example commit message. ([<author-name>](#))
```

Build Changelog will automatically add references from pull requests.

### Complex Example

```yaml
# changelog/<issue-or-unique-file-name>.yml
version: 1.0.0
release_date: 2025-01-01

changed:
  breaking:
    - This is a breaking change.

removed:
  - message: Removed this breaking item.
    flag: breaking
    references:
      - type: issue
        number: 1
```

> [!NOTE]
> You can also use toml if you prefer for the changelog file.

```toml
# changelog/<issue-or-unique-file-name>.toml
version = "1.0.0"
release_date = "2025-01-01"

[changed]
breaking = [
  "This is a breaking change."
]

[[removed]]
message = "Removed this breaking item."
flag = "breaking"

  [[removed.references]]
  type = "issue"
  number = 1
```

The output of that file would be something like this.

```md
## [1.0.0] - 2025-01-01

### Changed

- [Breaking 🧨] This is breaking change.([1](/#)) ([<author-name>](#))
```

## Actions

If `build-changelog` is integrated to your project it can be used as an action.

To get started using the action just add step in your action.

```yaml
- uses: jelmore1674/build-changelog@v1
```

> [!NOTE]
> You need to set `contents` permission your `GITHUB_TOKEN` to true.

Your workflow will be something like this.

```yaml
name: Build Changelog

# You can set this only to run when you push/merge into the main branch.
on:
  push:
    - main

permissions:
  # Give the default GITHUB_TOKEN write permission to commit and push the
  # added or changed files to the repository.
  contents: write
  pull-requests: read

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: jelmore1674/build-changelog@v1
        # NOTE:
        # Set the dir to `build-changelog` so your editor can use the json schema from the schema
        # store. In the future the `build-changelog` will be the default.
        dir: build-changelog
```

Here is a list of all of the inputs for the action.

```yaml
inputs:
  commit_with_api:
    description: Use the GitHub api to generate a signed commit. However, you cannot force push and this will be a new commit.
    default: "true"
    required: false

  auto_versioning:
    description: Automatically handle the semantic versioning based on the changelog file.
    required: false
    default: "false"

  dir:
    description: The directory to keep your changelog files. Defaults to the `changelog` directory.
    default: "changelog"
    required: true

  flags:
    description: Any custom flags with prefixes. Ex. `[Breaking 🧨]` for breaking changes. Must use a key=value pair comma separated list no spaces.
    default: "breaking=[Breaking 🧨]"
    required: false

  show_author:
    description: Reference the author in the changelog entry.
    default: "true"
    required: false

  show_author_full_name:
    description: Show the authors name instead of the authors username.
    default: "false"
    required: false

  name_override:
    description: If you have a naming that you want to use that is not the github username, then you can override the github username. Must use a `key=value` pair comma separated.
    required: false

  git_tag_prefix:
    description: The prefix for your git tags.
    default: "v"
    required: true

  show_git_tag_prefix:
    description: Show your git tag prefix in your versions in your changelog.
    default: "false"
    required: false

  reference_pull_requests:
    description: Automatically reference pull requests when you merge changes in.
    default: "true"
    required: false

  reference_sha:
    description: Automatically reference commit hashes when you merge changes in.
    default: "true"
    required: false

  changelog_style:
    description: |
      Set whether you are following the standard set by keep-a-changelog, common-changelog, or a
      custom changelog format. Can only be one of `keep-a-changelog`, `common-changelog`, or `custom`.
    required: false
    default: keep-a-changelog

  changelog_heading:
    description: |
      Set a custom heading for your changelog. This can only be set if `changelog_style` is set to `custom`
    required: false

  version:
    description: Set the version of the unreleased changes.
    default: "Unreleased"
    required: false

  commit_user_name:
    description: The committer user name. Defaults to `github-actions[bot]`.
    default: github-actions[bot]
    required: false

  commit_user_email:
    description: The committer email. Defaults to `41898282+github-actions[bot]@users.noreply.github.com`.
    default: 41898282+github-actions[bot]@users.noreply.github.com
    required: false

  commit_author:
    description: The commit author. Defaults to the use who triggered the action.
    required: false
    default: ${{ github.actor }} <${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com>

  commit_message:
    description: The commit message.
    default: Update CHANGELOG.
    required: false

  commit_options:
    description: Commit options (ex. --amend)
    required: false
    default: ""

  push_options:
    description: Push options (ex. --force)
    required: false
    default: ""

  skip_commit:
    description: Opt out of committing change. (Ex. You can defer the commit until a later step.)
    required: false
    default: "false"

  token:
    description: The secret value from your GITHUB_TOKEN or another token to access the GitHub API. Defaults to the token at `github.token`
    required: true
    default: ${{ github.token }}
```

This a complex example that amends the previous commit to keep the git history clean.

```yaml
name: Build Changelog

# You can set this only to run when you push/merge into the main branch.
on:
  push:
    - main

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Get last commit message
        id: last-commit
        run: |
          echo "message=$(git log -1 --pretty=%s)" >> $GITHUB_OUTPUT
          echo "author=$(git log -1 --pretty=\"%an <%ae>\")" >> $GITHUB_OUTPUT

      - uses: jelmore1674/build-changelog@v1
        with:
          # Disable using the api to make a commit.
          commit_with_api: "false"

          # This will use the last author as the commit author.
          commit_author: ${{ steps.last-commit.outputs.author }}

          # This will use the last message as the commit message.
          commit_message: ${{ steps.last-commit.outputs.message }}

          # Amend and force push.
          commit_options: "--amend"
          push_options: "--force"
```

> [!WARNING]
> If you want to sign an amended commit you must use something like
> [crazy-max/ghaction-import-gpg](https://github.com/crazy-max/ghaction-import-gpg). To be able to
> use a gpg key.

```yaml
name: Build Changelog

# You can set this only to run when you push/merge into the main branch.
on:
  push:
    - main

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: "Import GPG key"
        id: import-gpg
        uses: crazy-max/ghaction-import-gpg@v6
        with:
          gpg_private_key: ${{ secrets.GPG_KEY }}
          passphrase: "${{ secrets.GPG_PASSPHRASE }}"
          git_user_signingkey: true
          git_commit_gpgsign: true

      - name: Get last commit message
        id: last-commit
        run: |
          echo "message=$(git log -1 --pretty=%s)" >> $GITHUB_OUTPUT
          echo "author=$(git log -1 --pretty=\"%an <%ae>\")" >> $GITHUB_OUTPUT

      - uses: jelmore1674/build-changelog@v1
        with:
          commit_with_api: "false"
          commit_author: "${{ steps.import-gpg.outputs.name }} <${{ steps.import-gpg.outputs.email }}>"
          commit_user_name: ${{ steps.import-gpg.outputs.name }}
          commit_user_email: ${{ steps.import-gpg.outputs.email }}
          # This will use the last message as the commit message.
          commit_message: ${{ steps.last-commit.outputs.message }}
          # Amend and force push.
          commit_options: "--amend"
          push_options: "--force"
```

### Release Notes

You can also get release notes from the changelog by using the `notes` action.

```yaml
uses: jelmore1674/build-changelog/notes@v1
```

The `notes` action has an output that can be read to send to your release action.

#### Notes Simple Example

```yaml
name: release

on:
  workflow_dispatch:
    inputs:
      tag:
        type: string
        description: the tag for your release

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Release Notes
        # You must set an id to be able to use the output.
        id: release-notes
        uses: jelmore1674/build-changelog/notes@v1

        # You can use the output by getting it from the step.
      - run: echo "${{ steps.release-notes.outputs.notes }}"
```

### Enforce Changelog

This actions will check if there are changes to the changelog. If there are no changes, it will
fail.

```yaml
name: Enforce Changelog

on:
  pull_request:
    branches: [main]
    # For this action to work on pull-requests you need to enable all pull_request events.
    types: [opened, synchronize, reopened, ready_for_review, labeled, unlabeled]

jobs:
  enforce-changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # This will check to see if you changelog has any changes.
      - uses: jelmore1674/build-changelog/enforcer@v1
        with:
          # If you want to skip enforcing the changelog you can use a comma
          # separated list of labels. Make sure there are no spaces.
          skipLabels: ops,maintenance,docs
          ## Optionally you can allow dependabot to add a changelog file.
          enable_dependabot: true
          ## Then you can set the labels for dependabot
          dependabot_labels: "dependencies"
          ## Optionally you can set the section to either `security` or `changed`.
          dependabot_section: "changed"
```

The input for `Enforce Changelog`

```yaml
skip_labels:
  default: "ops"
  description: "Comma separated list of labels to skip enforcing changelog changes."

dir:
  description: The directory to keep your changelog files. Defaults to the `changelog` directory.
  default: "changelog"
  required: true

enable_dependabot:
  description: Allow creation of changelog file when dependabot creates a pull request.
  default: "false"
  required: false

dependabot_labels:
  description: The labels you to activate dependabot changelog updates.
  default: ""
  required: false

dependabot_section:
  description: The section to put the dependabot changes in. Can be either `security` or `changed`.
  default: "security"
  required: false

comment_on_pr:
  description: |
    The bot will leave a comment with a preview of the changes, if the enforce action fails it
    will tag the user and let them know the action failed
  default: "false"
  required: false

custom_bot_name:
  description: |
    If you have to use a different token other than the default, pass in the name of bot to be
    able to find existing comments. Example. `github-actions[bot]`. Currently this only looks for
    a bot user type.
  required: false

show_author_full_name:
  description: Show the authors name instead of the authors username.
  default: "false"
  required: false

name_override:
  description: |
    If you have a naming that you want to use that is not the github username, then you can
    override the github username. Must use a `key=value` pair comma separated.
  required: false
```
