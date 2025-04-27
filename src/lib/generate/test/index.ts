const today = new Date().toISOString().split("T")[0];

export const fileSystem = {
  "./changelog/change.yml": "fixed:\n  - This test issue",
};

export const fileSystemChange = {
  "./changelog/change.yml": "added:\n  - This test issue",

  "./CHANGELOG.md": `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`,
};

export const fileSystemBumpVersion = {
  "./changelog/change.yml": "added:\n  - This test issue",

  "./CHANGELOG.md": `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`,
};

export const fileSystemChangelogWithTagPrefix = {
  "./changelog/change.yml": "added:\n  - This test issue",

  "./CHANGELOG.md": `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`,
};
