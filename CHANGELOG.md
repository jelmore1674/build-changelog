# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.5] - 2024-12-26

### Changed

- Removed `forgejo-release` and forked so I can disable `release_dir`.

## [0.5.4] - 2024-12-26

### Fixed

- Test release

## [0.5.3] - 2024-12-26

### Fixed

- add release_dir to fix release from failing.

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

- Pipeline ammends previous commit.

### Removed

- Gitlab CI Pipelines

## [0.4.0] - 2024-12-08

### Added

- Parsing existing changelog file.

### Changed

- [Breaking 🧨] - Renamed the bin `build-cl` to `bcl`.
- [Breaking 🧨] - Renames `releaseDate` to `release_date`.
- [Breaking 🧨] - Default option to parse changelog over keeping an archive.
- Updated `guide.md` template.
- Added release linking to Changelog generation.
- Added `release_url`, `changelog_archive`, and `git_tag_prefix` to the configuration.

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
- Fixed crash when there is no archive file by genrating archive on `init` command.

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
- [Breaking 🧨] - Flag customization in the config.
- [Breaking 🧨] - breaking change in toml

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

- `breaking` flag not rendering in changelog correctly. Adds a hypen. to make it look better.

## [0.0.6] - 2024-11-17

### Fixed

- template escape characters

## [0.0.5] - 2024-11-17

### Added

- inital release of app.
- `breaking` keyword to show breaking changes.


[0.5.5]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.5
[0.5.4]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.4
[0.5.3]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.3
[0.5.2]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.2
[0.5.1]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.1
[0.5.0]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.5.0
[0.4.0]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.4.0
[0.3.2]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.3.2
[0.3.1]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.3.1
[0.3.0]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.3.0
[0.2.4]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.4
[0.2.3]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.3
[0.2.2]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.2
[0.2.1]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.1
[0.2.0]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.2.0
[0.1.2]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.1.2
[0.1.1]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.1.1
[0.1.0]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.1.0
[0.0.7]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.0.7
[0.0.6]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.0.6
[0.0.5]: https://forgejo.justinelmore.dev/jelmore1674/build-changelog/releases/tag/v0.0.5