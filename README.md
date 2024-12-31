![release](https://img.shields.io/gitea/v/release/jelmore1674/build-changelog?gitea_url=https%3A%2F%2Fgit.justinelmore.dev&display_name=release&logo=npm&logoColor=CB3837)
![issues](https://img.shields.io/gitea/issues/open/jelmore1674/build-changelog?gitea_url=https%3A%2F%2Fgit.justinelmore.dev)
![prs](https://img.shields.io/gitea/pull-requests/open/jelmore1674/build-changelog?gitea_url=https%3A%2F%2Fgit.justinelmore.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](/jelmore1674/build-changelog/src/branch/main/LICENSE)

# build-changelog

> Simplify managing changelog files.

The aim of `build-changelog` is to simplify changelogs, by letting contributors
add a separate file to put their changes, then generating the changelog.

## Table of Contents

- [CLI Usage](#getting-started)
- [Actions Usage](#actions)
  - [Release Notes](#release-notes)

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
name: changelog-action

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

      - uses: jelmore1674/build-changelog@v1
        with:
          # Customize your commit message
          commit_message: 'chore: update changelog'
```

Here is a list of all of the inputs for the action.

```yaml
inputs:
  gpg_private_key:
    description: 'Optionally add a gpg key to sign the commits.'
    default: ''
    required: false

  passphrase:
    description: 'Passphrase for the GPG private key provided'
    default: ''
    required: false

  commit_user_name:
    description: 'The name of the commit user.'
    default: 'forgejo[bot]'
    required: false

  commit_user_email:
    description: 'The email of the commit user.'
    default: 'forgejo[bot]@noreply.fogejo.justinelmore.dev'
    required: false

  commit_message:
    description: 'The commit message.'
    default: 'update changelog.'
    required: false

  commit_options:
    description: Commit options (eg. --no-verify)
    required: false
    default: ''

    push_options:
    description: Push options (eg. --force)
    required: false
    default: ''
```

This a complex example that amends the previous commit to keep the git history clean.

```yaml
name: changelog-action

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
          # To sign the commits just add the GPG KEY and Passphrase.
          gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
          passphrase: '${{ secrets.GPG_PASSPHRASE }}'

          # This will use the last author as the commit author.
          commit_author: ${{ steps.last-commit.outputs.author }}

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
  relase:
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

```yaml
name: release

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Release Tag'
        type: 'string'
        default: 'v'
        required: true
      override:
        description: 'Override Existing Release'
        type: boolean
        required: true

jobs:
  release:
    runs-on: ubuntu-latest
    outputs:
      RELEASE_NOTES: '${{ steps.release-notes.outputs.RELEASE_NOTES }}'
    steps:
      - uses: actions/checkout@v4

      - name: Release Notes
        # Set the id of the release-notes action.
        id: release-notes
        uses: jelmore1674/build-changelog/notes@v1

      - uses: https://git.justinelmore.dev/actions/release@v2.6.1
        with:
          direction: upload
          url: ${{ env.GITHUB_SERVER_URL }}
          # The release notes are being set here.
          release-notes: ${{ steps.release-notes.outputs.notes }}
          tag: ${{ inputs.tag }}
          token: ${{ secrets.ACTION_TOKEN }}
          verbose: true
          override: ${{ inputs.override }}
```
