# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Changed

- Allow `log` function to take more than one parameter. ([#51](https://github.com/jelmore1674/build-changelog/pull/51)) ([Justin Elmore](https://github.com/jelmore1674))
- Ordering of the change groups to match the order from [Common Changelog](https://common-changelog.org/#24-change-group) ([#51](https://github.com/jelmore1674/build-changelog/pull/51)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- Output `notes` that has the latest release notes in it. ([#50](https://github.com/jelmore1674/build-changelog/pull/50)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Prevent `Unreleased` heading from creating a broken link. ([#51](https://github.com/jelmore1674/build-changelog/pull/51)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.1.1] - 2025-04-02

### Security

- Update `dprint` to version `0.49.1`. ([#39](https://github.com/jelmore1674/build-changelog/pull/39)) ([Justin Elmore](https://github.com/jelmore1674))
- Update `yaml` to `2.7.1`. ([#40](https://github.com/jelmore1674/build-changelog/pull/40)) ([Justin Elmore](https://github.com/jelmore1674))
- Update `vitest` and `vitest/coverage-v8`to `3.1.1`. ([#43](https://github.com/jelmore1674/build-changelog/pull/43)) ([Justin Elmore](https://github.com/jelmore1674))
- Update `pnpm` to version `10.7.1`. ([#45](https://github.com/jelmore1674/build-changelog/pull/45)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.1.0] - 2025-04-02

### Changed

- Changed enforcer to call `generate` directly instead of relying on another action. ([Justin Elmore](https://github.com/jelmore1674))
- Change to use `context.sha` to detect if pr has been merged. ([Justin Elmore](https://github.com/jelmore1674))
- Update `enforcer` action to use `@actions/exec` instead of node's `execSync`. ([#24](https://github.com/jelmore1674/build-changelog/pull/24)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- Added `show_author` and `show_author_full_name` to the changelog configuration. ([Justin Elmore](https://github.com/jelmore1674))
- Automatically reference `pull_request` number to the changelog entry. ([Justin Elmore](https://github.com/jelmore1674))
- Commit and push using the Github Api. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- Commit and push using the git binary in the action. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- `commit_with_api` input to choose between using binary or api to commit. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- Add input for `version` for setting the release version for unreleased changes. ([#34](https://github.com/jelmore1674/build-changelog/pull/34)) ([Justin Elmore](https://github.com/jelmore1674))
- Use inputs to configure the action instead of a configuration file. ([#38](https://github.com/jelmore1674/build-changelog/pull/38)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- Remove unused inputs from the project. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Fixed `pull_request` auto referencing. ([#19](https://github.com/jelmore1674/build-changelog/pull/19)) ([Justin Elmore](https://github.com/jelmore1674))
- Prevent `Enforcer` action from failing when running the generate command. ([#33](https://github.com/jelmore1674/build-changelog/pull/33)) ([Justin Elmore](https://github.com/jelmore1674))
- Remove the leading `v` from the version prefix when using the tag as input. ([#35](https://github.com/jelmore1674/build-changelog/pull/35)) ([Justin Elmore](https://github.com/jelmore1674))
- Fixes being able to set version and date of unreleased changes. ([#36](https://github.com/jelmore1674/build-changelog/pull/36)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.0.0] - 2025-03-20

_Initial Release_


[1.1.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.1.1
[1.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.1.0
[1.0.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.0.0