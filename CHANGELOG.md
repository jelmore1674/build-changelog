# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Common Changelog](https://common-changelog.org),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2025-04-25

### Added

- Support to auto link issues from pull request body. [`e774e6f`](https://github.com/jelmore1674/build-changelog/commit/e774e6fc36a152a582195e25e0de9a45d64e56d8) | [#94](https://github.com/jelmore1674/build-changelog/issues/94), [#99](https://github.com/jelmore1674/build-changelog/pull/99) | [Justin Elmore](https://github.com/jelmore1674)

### Fixed

- Action failing when not triggered through pull request. [`7850d7b`](https://github.com/jelmore1674/build-changelog/commit/7850d7bb80275bfcfa952e7ea2c89293852d29d6) | [#106](https://github.com/jelmore1674/build-changelog/pull/106) | [Justin Elmore](https://github.com/jelmore1674)

## [1.8.2] - 2025-04-24

### Changed

- Instead of grouping inline references in a parenthesis, they are now separated by `|` character. [`801493f`](https://github.com/jelmore1674/build-changelog/commit/801493f4d1554fd767a39d31fcb17acd5c392fa1) | [#100](https://github.com/jelmore1674/build-changelog/pull/100) | [Justin Elmore](https://github.com/jelmore1674)

## [1.8.1] - 2025-04-24

### Fixed

- Issue where commit hash was ignored if there was no other references in the changelog entry. ([`8f1f505`](https://github.com/jelmore1674/build-changelog/commit/8f1f50596f11f71cf4a0562a22526c6f2df5cb7e)) ([#98](https://github.com/jelmore1674/build-changelog/pull/98)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.8.0] - 2025-04-24

### Added

- Support to add pr comments to preview changes. To enable set `comment_on_pr: true`. ([`1766830`](https://github.com/jelmore1674/build-changelog/commit/17668301dd2c15dfb33d37a67df1c5bd9d18dfe0)) ([#95](https://github.com/jelmore1674/build-changelog/pull/95), [#96](https://github.com/jelmore1674/build-changelog/issues/96)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Add missing `custom_bot_name` input to the `enforcer` action. ([`32f21c1`](https://github.com/jelmore1674/build-changelog/commit/32f21c142c9e2a044ff4168c414736b4a902cf0b)) ([#97](https://github.com/jelmore1674/build-changelog/pull/97)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.7.1] - 2025-04-23

### Changed

- Updates `@vitest/coverage-v8` from 3.1.1 to 3.1.2 ([`791b55f`](https://github.com/jelmore1674/build-changelog/commit/791b55ffcfff000efbd9e3d493937fee1eaa2483)) ([#92](https://github.com/jelmore1674/build-changelog/pull/92)) ([dependabot](https://github.com/apps/dependabot))
- Updates `vitest` from 3.1.1 to 3.1.2 ([`791b55f`](https://github.com/jelmore1674/build-changelog/commit/791b55ffcfff000efbd9e3d493937fee1eaa2483)) ([#92](https://github.com/jelmore1674/build-changelog/pull/92)) ([dependabot](https://github.com/apps/dependabot))

### Added

- Support to show full tag for the release the the `git_tag_prefix`. ([`f02846a`](https://github.com/jelmore1674/build-changelog/commit/f02846a0cb0d865aa27fc5248f62ef4a15a14bf3)) ([#93](https://github.com/jelmore1674/build-changelog/pull/93)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.7.0] - 2025-04-20

### Changed

- Updates `@jelmore1674/changelog` from 1.0.0 to 1.1.1 ([`0dc658b`](https://github.com/jelmore1674/build-changelog/commit/0dc658b7d4949c0801868f656b842538445ed2d2)) ([#89](https://github.com/jelmore1674/build-changelog/pull/89)) ([dependabot](https://github.com/apps/dependabot))

### Added

- Support for `changelog_heading` input to set custom changelog headings. ([`6d3515a`](https://github.com/jelmore1674/build-changelog/commit/6d3515a1331d4b9a9775639525101bc16ce70a7d)) ([#91](https://github.com/jelmore1674/build-changelog/pull/91)) ([Justin Elmore](https://github.com/jelmore1674))
- Support for `changelog_styles` input to set the changelog format you are following. ([`6d3515a`](https://github.com/jelmore1674/build-changelog/commit/6d3515a1331d4b9a9775639525101bc16ce70a7d)) ([#85](https://github.com/jelmore1674/build-changelog/issues/85), [#91](https://github.com/jelmore1674/build-changelog/pull/91)) ([Justin Elmore](https://github.com/jelmore1674))
- Support to customize dependabot changes section. ([`6d3515a`](https://github.com/jelmore1674/build-changelog/commit/6d3515a1331d4b9a9775639525101bc16ce70a7d)) ([#91](https://github.com/jelmore1674/build-changelog/pull/91)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Issue where dependabot was creating duplicate changelog entries. ([`d041208`](https://github.com/jelmore1674/build-changelog/commit/d0412082fb87292fc8ca05ea1de470c1c6f4b4cb)) ([#90](https://github.com/jelmore1674/build-changelog/pull/90)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.6.1] - 2025-04-17

### Changed

- Revert to using inline links instead of markdown reference links. ([`5304352`](https://github.com/jelmore1674/build-changelog/commit/5304352e4f8f3a65b52b019744c0f343ce0ec298)) ([#83](https://github.com/jelmore1674/build-changelog/pull/83)) ([Justin Elmore](https://github.com/jelmore1674))
- Sort order of `issues/pr` references in order of the number. ([`5304352`](https://github.com/jelmore1674/build-changelog/commit/5304352e4f8f3a65b52b019744c0f343ce0ec298)) ([#83](https://github.com/jelmore1674/build-changelog/pull/83)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- Support for dependabot making changelog entries. ([`e6c8f63`](https://github.com/jelmore1674/build-changelog/commit/e6c8f63ba7cdb41939859920569d32880c0b4ea3)) ([#65](https://github.com/jelmore1674/build-changelog/issues/65), [#84](https://github.com/jelmore1674/build-changelog/pull/84)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- Markdown reference links when creating links in the changelog entry. ([`5304352`](https://github.com/jelmore1674/build-changelog/commit/5304352e4f8f3a65b52b019744c0f343ce0ec298)) ([#83](https://github.com/jelmore1674/build-changelog/pull/83)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.6.0] - 2025-04-16

### Added

- Commit hash reference links. ([`ee1e40c`](https://github.com/jelmore1674/build-changelog/commit/ee1e40ce40a53b0a792208afc5bc8b1582e06709)) ([#82](https://github.com/jelmore1674/build-changelog/pull/82), [#77](https://github.com/jelmore1674/build-changelog/issues/77)) ([Justin Elmore](https://github.com/jelmore1674))

### Fixed

- Reference link not being created when creating a release. ([#81](https://github.com/jelmore1674/build-changelog/pull/81), [#80](https://github.com/jelmore1674/build-changelog/issues/80)) ([Justin Elmore](https://github.com/jelmore1674))

## [1.5.0] - 2025-04-15

### Changed

- Use `@jelmore1674/changelog` to write the changelog file. ([#79](https://github.com/jelmore1674/build-changelog/pull/79)) ([Justin Elmore](https://github.com/jelmore1674))

### Added

- Use markdown reference links instead of inline links to link author and pull requests. ([#79](https://github.com/jelmore1674/build-changelog/pull/79), [#66](https://github.com/jelmore1674/build-changelog/issues/66)) ([Justin Elmore](https://github.com/jelmore1674))

### Removed

- The `mustache` package, since `@jelmore1674/changelog` is now writing the changelog. ([#79](https://github.com/jelmore1674/build-changelog/pull/79)) ([Justin Elmore](https://github.com/jelmore1674))

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

[1.9.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.9.0
[1.8.2]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.8.2
[1.8.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.8.1
[1.8.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.8.0
[1.7.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.7.1
[1.7.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.7.0
[1.6.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.6.1
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
