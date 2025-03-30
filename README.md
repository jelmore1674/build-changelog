![release](https://img.shields.io/github/v/release/jelmore1674/build-changelog?display_name=release&logo=npm&logoColor=CB3837)
![issues](https://img.shields.io/github/issues/jelmore1674/build-changelog)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](/tree/main?tab=MIT-1-ov-file)

# build-changelog

> Simplify managing changelog files.

The aim of `build-changelog` is to simplify changelogs, by letting contributors
add a separate file to put their changes, then generating the changelog.

## Table of Contents

- [CLI Usage](#getting-started)
- [Actions Usage](#actions)
  - [Release Notes](#release-notes)
  - [Enforce Changelog](#enforce-changelog)

## Getting Started

To quickly get started install `build-changelog` with `npm` you can install
this globally or with the project.

```bash
npm i -g @jelmore1674/build-changelog
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
```

Here is a list of all of the inputs for the action.

```yaml
inputs:
  commit_with_api:
    description: Use the GitHub api to generate a signed commit. However, you cannot force push and this will be a new commit.
    default: 'true'
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
    default: ''

  push_options:
    description: Push options (ex. --force)
    required: false
    default: ''

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
          # This will use the last author as the commit author.
          commit_author: ${{ steps.last-commit.outputs.author }}

          # This will use the last message as the commit message.
          commit_message: ${{ steps.last-commit.outputs.message }}

          # Amend and force push.
          commit_options: '--amend'
          push_options: '--force'
```

> [!WARNING]
> If you want to sign an amended commit you must yous something like [crazy-max/ghaction-import-gpg](https://github.com/crazy-max/ghaction-import-gpg).
> To be able to use a gpg key.

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

      - name: 'Import GPG key'
        id: import-gpg
        uses: crazy-max/ghaction-import-gpg@v6
        with:
          gpg_private_key: ${{ secrets.GPG_KEY }}
          passphrase: '${{ secrets.GPG_PASSPHRASE }}'
          git_user_signingkey: true
          git_commit_gpgsign: true

      - name: Get last commit message
        id: last-commit
        run: |
          echo "message=$(git log -1 --pretty=%s)" >> $GITHUB_OUTPUT
          echo "author=$(git log -1 --pretty=\"%an <%ae>\")" >> $GITHUB_OUTPUT

      - uses: jelmore1674/build-changelog@v1
        with:
          commit_author: '${{ steps.import-gpg.outputs.name }} <${{ steps.import-gpg.outputs.email }}>'
          commit_user_name: ${{ steps.import-gpg.outputs.name }}
          commit_user_email: ${{ steps.import-gpg.outputs.email }}
          # This will use the last message as the commit message.
          commit_message: ${{ steps.last-commit.outputs.message }}
          # Amend and force push.
          commit_options: '--amend'
          push_options: '--force'
```

### Release Notes

You can also get release notes from the changelog by using the `notes` action.

```yaml
uses: jelmore1674/build-changelog/notes@v1
```

The `notes` action has an output that can be read to send to your release action.

#### Simple Example:

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

This actions will check if there are changes to the changelog. If there are no changes, it will fail.

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
```

The input for `Enforce Changelog`

```yaml
skip_labels:
  default: 'ops'
  description: 'Comma separated list of labels to skip enforcing changelog changes.'
```
