[![release](https://git.justinelmore.dev/jelmore1674/build-changelog/badges/release.svg?color=dark-green&logo=npm&logoColor=CB3837)](/jelmore1674/build-changelog/releases)
[![issues](https://git.justinelmore.dev/jelmore1674/build-changelog/badges/issues/open.svg)](/jelmore1674/build-changelog/issues)
[![prs](https://git.justinelmore.dev/jelmore1674/build-changelog/badges/pulls/open.svg)](/jelmore1674/build-changelog/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](/jelmore1674/build-changelog/src/branch/main/LICENSE)

# build-changelog

> Simplify managing changelog files.

The aim of `build-changelog` is to simplify changelogs, by letting contributors
add a separate file to put their changes, then generating the changelog.

## Table of Contents

- [CLI Usage](#getting-started)
- [Actions Usage](#actions)

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
    description: 'The commit message. '
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
          # Customize your commit message
          commit_message: 'chore: update changelog'

          # To sign the commits just add the GPG KEY and Passphrase.
          gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
          passphrase: "${{ secrets.GPG_PASSPHRASE }}"

          # This will use the last author as the commit author.
          commit_author: ${{ steps.last-commit.outputs.author }}

          # This will use the last message as the commit message.
          commit_message: ${{ steps.last-commit.outputs.message }}

          # Amend and force push.
          commit_options: "--amend"
          push_options: "--force"
```
