# What's Changed

{{#changed.length}}## Changed

{{#changed}}
{{> change}}
{{/changed}}

{{/changed.length}}
{{#added.length}}## Added

{{#added}}
{{> change}}
{{/added}}

{{/added.length}}
{{#removed.length}}## Removed

{{#removed}}
{{> change}}
{{/removed}}

{{/removed.length}}
{{#fixed.length}}## Fixed

{{#fixed}}
{{> change}}
{{/fixed}}

{{/fixed.length}}
{{#deprecated.length}}## Deprecated

{{#deprecated}}
{{> change}}
{{/deprecated}}

{{/deprecated.length}}
{{#security.length}}## Security

{{#security}}
{{> change}}
{{/security}}

{{/security.length}}
