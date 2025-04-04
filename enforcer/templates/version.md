## [{{version}}] - {{release_date}}

{{#notice}}{{> notice}}

{{/notice}}
{{#changed.length}}### Changed

{{#changed}}
{{> change}}
{{/changed}}

{{/changed.length}}
{{#added.length}}### Added

{{#added}}
{{> change}}
{{/added}}

{{/added.length}}
{{#removed.length}}### Removed

{{#removed}}
{{> change}}
{{/removed}}

{{/removed.length}}
{{#deprecated.length}}### Deprecated

{{#deprecated}}
{{> change}}
{{/deprecated}}

{{/deprecated.length}}
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
