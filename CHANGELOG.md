# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Changed

- Update Dockerfile, to remove uneeded node and npm. ([#71](https://git.justinelmore.dev/jelmore1674/build-changelog/undefined/71)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

### Security

- update dependency @types/node to v22.10.5. ([#69](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/69)) ([renovate-bot](https://git.justinelmore.dev/jelmore1674))

## [1.4.1] - 2025-01-02

### Fixed

- Resolve sorting versions when minor or patch version is greater than single digits. ([#63](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/63), [#64](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/64)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

## [1.4.0] - 2025-01-02

### Added

- Author linking inside of action! 🚀 ([#62](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/62)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

### Fixed

- Resolve bug where versions with more than 1 digit was not being parsed correctly. ([#61](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/61), [#62](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/62)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

## [1.3.1] - 2025-01-01

### Fixed

- Prevent changes with a prefix from being omitted when parsing from existing changelog. ([#60](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/60), [#59](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/59)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

### Security

- update dependency @types/node to v22.10.3 ([#55](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/55)) (renovate-bot)

## [1.3.0] - 2024-12-31

### Added

- An action to enforce changelog entries. ([#53](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/53)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

### Fixed

- Reference links being duplicated. ([#51](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/51), [#52](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/52)) (Justin Elmore)
- Issue, where the regex was causing the changelog parsing to break when having words with multiple undercores ie. `_example_`. ([#53](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/53)) ([Justin Elmore](https://git.justinelmore.dev/jelmore1674))

## [1.2.0] - 2024-12-31

### Added

- 🚀 `jelmore1674/build-changelog/notes` action. ([#39](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/39), [#50](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/50)) (Justin Elmore)

### Fixed

- `notes` command not generating release notes when not having an archive file. ([#49](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/49), [#50](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/50)) (Justin Elmore)

## [1.1.0] - 2024-12-31

### Added

- Allow notice in changelog entries.
- Author name to change. 🚀 ([#42](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/42), [#47](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/47)) (Justin Elmore)
- References to changes, ie. Commit Hashes, Pull Requests and Issues. 🚀 ([#41](https://git.justinelmore.dev/jelmore1674/build-changelog/issues/41), [#47](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/47)) (Justin Elmore)
- Allow usage of github release url when releases url is not set in the config file. ([#47](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/47)) (Justin Elmore)

### Security

- update dependency yaml to v2.7.0 ([#46](https://git.justinelmore.dev/jelmore1674/build-changelog/pulls/46)) (renovate-bot)

## [1.0.1] - 2024-12-29

### Fixed

- Force composite to use full path instead of relative path.

### Security

- update `actions/release` to `2.6.1`

## [1.0.0] - 2024-12-28

_Initial Release_

### Added

- Now able to be used as an action. See [docs](https://git.justinelmore.dev/jelmore1674/build-changelog#actions)

### Security

- pin dependencies
- update vitest monorepo to v2.1.8
- update dependency vite-tsconfig-paths to v5.1.4
- update pnpm to v9.15.1
- update dependency dprint to v0.48.0
- update dependency typescript to v5.7.2
- update node.js to v22

## [0.5.5] - 2024-12-26

### Changed

- Removed `forgejo-release` and forked so I can disable `release_dir`.

## [0.5.4] - 2024-12-26

### Fixed

- Test release

## [0.5.3] - 2024-12-26

### Fixed

- add `release_dir` to fix release from failing.

## [0.5.2] - 2024-12-26

### Fixed

- release pipeline not working.

## [0.5.1] - 2024-12-26

### Fixed

- `notes` command default value. updated pull `Unreleased` or latest version.
- Links not appearing in the bottom of the Changelog.

## [0.5.0] - 2024-12-26

### Added

- Forgejo Actions 🚀

### Changed

- Pipeline amends previous commit.

### Removed

- Gitlab CI Pipelines

## [0.4.0] - 2024-12-08

### Added

- Parsing existing changelog file.

### Changed

- [Breaking 🧨] - Renamed the bin `build-cl` to `bcl`.
- Updated `guide.md` template.
- Added release linking to Changelog generation.
- Added `release_url`, `changelog_archive`, and `git_tag_prefix`.

### Removed

- [Breaking 🧨] - Removed the alias `changelog` for the `generate` command.

## [0.3.2] - 2024-11-25

### Fixed

- init command always creates a `yml` config file.
- crash when archive file is missing.
- deploy to docker on release.

## [0.3.1] - 2024-11-24

### Fixed

- Fixed the `init` command generating `test.toml`.
- Fixed the fallback value not working as expected in prompt.
- Fixed crash when there is no archive file by generating archive on `init` command.

## [0.3.0] - 2024-11-24

### Added

- Adds a new `notes` command to help populate release notes in ci pipeline.

## [0.2.4] - 2024-11-23

### Added

- Bump version to 0.2.4

## [0.2.3] - 2024-11-23

### Added

- `getParser` utility function.
- `prompt` function to `readline` lib.

## [0.2.2] - 2024-11-21

### Fixed

- Fix TOML not parsing correctly

## [0.2.1] - 2024-11-21

### Fixed

- Fix parsing of archive for toml configuration.

## [0.2.0] - 2024-11-21

### Added

- Support for TOML. Add versions with toml and set up config with TOML.

### Changed

- [Breaking 🧨] - The properties of the yaml file. you must have a nested property to add a change.

## [0.1.2] - 2024-11-19

### Fixed

- Prevent removing `README.md` from changelog dir.

## [0.1.1] - 2024-11-19

### Added

- `log` util function to hide logs during testing.

### Removed

- [Breaking 🧨] - dir name fallbacks for undefined version and release date

## [0.1.0] - 2024-11-18

### Added

- Cleanup of old files after the changelog has been made
- Some unit testing.
- `capitalizeFirstLetter` utility function.
- README for `init` command.
- paths in config
- caching to pipeline.
- `init` command to stub out project.
- `generate` command to create changelog.

### Deprecated

- [Breaking 🧨] - `version_date_separator` support will be removed.
- `changelog` command, this will be removed once we finish the commands.

### Removed

- support for flags

## [0.0.7] - 2024-11-17

### Added

- support yaml config.

### Removed

- [Breaking 🧨] - command arguments. (Note: This may be reintroduced later)

### Fixed

- `breaking` flag not rendering in changelog correctly. Adds a hyphen. to make it look better.

## [0.0.6] - 2024-11-17

### Fixed

- template escape characters

## [0.0.5] - 2024-11-17

### Added

- initial release of app.
- `breaking` keyword to show breaking changes.

[Unreleased]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/vUnreleased
[1.4.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.4.1
[1.4.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.4.0
[1.3.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.3.1
[1.3.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.3.0
[1.2.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.2.0
[1.1.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.1.0
[1.0.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.0.1
[1.0.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v1.0.0
[0.5.5]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.5
[0.5.4]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.4
[0.5.3]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.3
[0.5.2]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.2
[0.5.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.1
[0.5.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.0
[0.4.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.4.0
[0.3.2]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.3.2
[0.3.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.3.1
[0.3.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.3.0
[0.2.4]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.4
[0.2.3]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.3
[0.2.2]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.2
[0.2.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.1
[0.2.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.0
[0.1.2]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.1.2
[0.1.1]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.1.1
[0.1.0]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.1.0
[0.0.7]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.0.7
[0.0.6]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.0.6
[0.0.5]: https://git.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.0.5

