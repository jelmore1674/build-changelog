# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Added

- Added `show_author` and `show_author_full_name` to the changelog configuration. ([Justin Elmore](https://github.com/jelmore1674))
- Automatically reference `pull_request` number to the changelog entry. ([Justin Elmore](https://github.com/jelmore1674))
- Commit and push using the Github Api. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- Commit and push using the git binary in the action. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- `commit_with_api` input to choose between using binary or api to commit. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))

### Changed

- Changed enforcer to call `generate` directly instead of relying on another action. ([Justin Elmore](https://github.com/jelmore1674))
- Change to use `context.sha` to detect if pr has been merged. ([Justin Elmore](https://github.com/jelmore1674))
- Update `enforcer` action to use `@actions/exec` instead of node's `execSync`. ([#24](https://github.com/jelmore1674/build-changelog/pull/24)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- Remove unused inputs from the project. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Fixed `pull_request` auto referencing. ([#19](https://github.com/jelmore1674/build-changelog/pull/19)) ([Justin Elmore](https://github.com/jelmore1674))
- Prevent `Enforcer` action from failing when running the generate command. ([#33](https://github.com/jelmore1674/build-changelog/pull/33)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.0.0] - 2025-03-20

_Initial Release_


[Unreleased]: https://github.com/jelmore1674/build-changelog/releases/tag/vUnreleased
[1.0.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.0.0