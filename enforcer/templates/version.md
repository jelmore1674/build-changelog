## [{{version}}] - {{release_date}}

{{#notice}}{{> notice}}

{{/notice}}
{{#added.length}}### Added

{{#added}}
{{> change}}
{{/added}}

{{/added.length}}
{{#changed.length}}### Changed

{{#changed}}
{{> change}}
{{/changed}}

{{/changed.length}}
{{#deprecated.length}}### Deprecated

{{#deprecated}}
{{> change}}
{{/deprecated}}

{{/deprecated.length}}
{{#removed.length}}### Removed

{{#removed}}
{{> change}}
{{/removed}}

{{/removed.length}}
{{#fixed.length}}### Fixed

{{#fixed}}
{{> change}}
{{/fixed}}

{{/fixed.length}}
{{#security.length}}### Security

{{#security}}
{{> change}}
{{/security}}

{{/security.length}}
