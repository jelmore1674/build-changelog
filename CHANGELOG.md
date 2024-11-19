# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

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