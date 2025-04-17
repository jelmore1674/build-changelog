# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2025-04-16

### Added

- Commit hash reference links. ([`ee1e40c`](https://github.com/jelmore1674/build-changelog/commit/ee1e40ce40a53b0a792208afc5bc8b1582e06709)) ([#82](https://github.com/jelmore1674/build-changelog/pull/82), [#77](https://github.com/jelmore1674/build-changelog/issues/77)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Reference link not being created when creating a release. ([#81](https://github.com/jelmore1674/build-changelog/pull/81), [#80](https://github.com/jelmore1674/build-changelog/issues/80)) ([Justin Elmore])

## [1.5.0] - 2025-04-15

### Changed

- Use `@jelmore1674/changelog` to write the changelog file. ([#79](https://github.com/jelmore1674/build-changelog/pull/79)) ([Justin Elmore])

### Added

- Use markdown reference links instead of inline links to link author and pull requests. ([#79], [#66](https://github.com/jelmore1674/build-changelog/issues/66)) ([Justin Elmore])

### Removed

- The `mustache` package, since `@jelmore1674/changelog` is now writing the changelog. ([#79]) ([Justin Elmore])

## [1.4.0] - 2025-04-12

_Read the [README.md](./README.md#complex-example) how to add changes._

### Added

- Add `name_override` input to give more control on naming convention of contributors. ([#71](https://github.com/jelmore1674/build-changelog/pull/71), [#70](https://github.com/jelmore1674/build-changelog/issues/70)) ([Justin Elmore](https://github.com/jelmore1674))
- Sort breaking changes to the top of the change section. ([#71](https://github.com/jelmore1674/build-changelog/pull/71), [#31](https://github.com/jelmore1674/build-changelog/issues/31)) ([Justin Elmore](https://github.com/jelmore1674))
- Support for 3 different type of entries into the changelog. ([#71](https://github.com/jelmore1674/build-changelog/pull/71), [#69](https://github.com/jelmore1674/build-changelog/issues/69)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Auto referencing prs in changelog entry. ([#75](https://github.com/jelmore1674/build-changelog/pull/75)) ([Justin Elmore](https://github.com/jelmore1674))

### Security

- Update dependency `@jelmore1674/changelog` to `0.3.0`. ([Justin Elmore](https://github.com/jelmore1674))

## [1.3.3] - 2025-04-11

### Fixed

- References in changelog file entry are not being added. ([#68](https://github.com/jelmore1674/build-changelog/pull/68), [#67](https://github.com/jelmore1674/build-changelog/issues/67)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.3.2] - 2025-04-11

### Fixed

- Fix typo in `getInput` for `skip_commit`. ([#64](https://github.com/jelmore1674/build-changelog/pull/64)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.3.1] - 2025-04-11

### Added

- Optional `skip_commit` input to opt out of committing changelog changes. ([#63](https://github.com/jelmore1674/build-changelog/pull/63)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.3.0] - 2025-04-09

### Fixed

- Update `@jelmore1674/changelog` to fix bug where on release version doesn't update. ([Justin Elmore](https://github.com/jelmore1674))

## [1.2.2] - 2025-04-09

### Added

- Implemented the `@jelmore1674/changelog` package, to replace `parseChangelog` functionality. ([#62](https://github.com/jelmore1674/build-changelog/pull/62)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- Removed the `parseChangelog` function. ([#62](https://github.com/jelmore1674/build-changelog/pull/62)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.2.1] - 2025-04-06

### Fixed

- Added util `stringToBoolean` to replace `Boolean` to determine if a string is a boolean or not. ([#58](https://github.com/jelmore1674/build-changelog/pull/58)) ([Justin Elmore](https://github.com/jelmore1674))
- Fixed issue where `Added` was at top of the release notes always. ([#57](https://github.com/jelmore1674/build-changelog/pull/57)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.2.0] - 2025-04-06

### Changed

- Allow `log` function to take more than one parameter. ([#51](https://github.com/jelmore1674/build-changelog/pull/51)) ([Justin Elmore](https://github.com/jelmore1674))
- Ordering of the change groups to match the order from [Common Changelog](https://common-changelog.org/#24-change-group) ([#51](https://github.com/jelmore1674/build-changelog/pull/51)) ([Justin Elmore](https://github.com/jelmore1674))
- Replaced release action with `release-semver-action`. ([#55](https://github.com/jelmore1674/build-changelog/pull/55)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- Feature to allow for semantic versioning to manage the version. ([#55](https://github.com/jelmore1674/build-changelog/pull/55)) ([Justin Elmore](https://github.com/jelmore1674))
- Output `notes` that has the latest release notes in it. ([#50](https://github.com/jelmore1674/build-changelog/pull/50)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Prevent `Unreleased` heading from creating a broken link. ([#51](https://github.com/jelmore1674/build-changelog/pull/51)) ([Justin Elmore](https://github.com/jelmore1674))

### Security

- Pin dependency `@types/semver` to `7.7.0`. ([#54](https://github.com/jelmore1674/build-changelog/pull/54)) ([Justin Elmore](https://github.com/jelmore1674))
- Update dependency `typescript` to `v5.8.3`. ([#52](https://github.com/jelmore1674/build-changelog/pull/52)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.1.1] - 2025-04-02

### Security

- Update `dprint` to version `0.49.1`. ([#39](https://github.com/jelmore1674/build-changelog/pull/39)) ([Justin Elmore](https://github.com/jelmore1674))
- Update `pnpm` to version `10.7.1`. ([#45](https://github.com/jelmore1674/build-changelog/pull/45)) ([Justin Elmore](https://github.com/jelmore1674))
- Update `vitest` and `vitest/coverage-v8`to `3.1.1`. ([#43](https://github.com/jelmore1674/build-changelog/pull/43)) ([Justin Elmore](https://github.com/jelmore1674))
- Update `yaml` to `2.7.1`. ([#40](https://github.com/jelmore1674/build-changelog/pull/40)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.1.0] - 2025-04-02

### Changed

- Change to use `context.sha` to detect if pr has been merged. ([Justin Elmore](https://github.com/jelmore1674))
- Changed enforcer to call `generate` directly instead of relying on another action. ([Justin Elmore](https://github.com/jelmore1674))
- Update `enforcer` action to use `@actions/exec` instead of node's `execSync`. ([#24](https://github.com/jelmore1674/build-changelog/pull/24)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- `commit_with_api` input to choose between using binary or api to commit. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- Add input for `version` for setting the release version for unreleased changes. ([#34](https://github.com/jelmore1674/build-changelog/pull/34)) ([Justin Elmore](https://github.com/jelmore1674))
- Added `show_author` and `show_author_full_name` to the changelog configuration. ([Justin Elmore](https://github.com/jelmore1674))
- Automatically reference `pull_request` number to the changelog entry. ([Justin Elmore](https://github.com/jelmore1674))
- Commit and push using the git binary in the action. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- Commit and push using the Github Api. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))
- Use inputs to configure the action instead of a configuration file. ([#38](https://github.com/jelmore1674/build-changelog/pull/38)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- Remove unused inputs from the project. ([#25](https://github.com/jelmore1674/build-changelog/pull/25)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Fixed `pull_request` auto referencing. ([#19](https://github.com/jelmore1674/build-changelog/pull/19)) ([Justin Elmore](https://github.com/jelmore1674))
- Fixes being able to set version and date of unreleased changes. ([#36](https://github.com/jelmore1674/build-changelog/pull/36)) ([Justin Elmore](https://github.com/jelmore1674))
- Prevent `Enforcer` action from failing when running the generate command. ([#33](https://github.com/jelmore1674/build-changelog/pull/33)) ([Justin Elmore](https://github.com/jelmore1674))
- Remove the leading `v` from the version prefix when using the tag as input. ([#35](https://github.com/jelmore1674/build-changelog/pull/35)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.0.0] - 2025-03-20

_Initial Release_

[1.6.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.6.0
[1.5.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.5.0
[1.4.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.4.0
[1.3.3]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.3.3
[1.3.2]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.3.2
[1.3.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.3.1
[1.3.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.3.0
[1.2.2]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.2.2
[1.2.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.2.1
[1.2.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.2.0
[1.1.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.1.1
[1.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.1.0
[1.0.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.0.0
