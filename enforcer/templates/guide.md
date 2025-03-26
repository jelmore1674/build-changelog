# Build Changelog

`build-changelog` is a tool to simplify changelogs. To create a new entry in the
changelog create a new `yaml` file.

Examples:

```yaml
# test-change.yml
added:
  changes:
    - 'You can add a change by adding a string to the the valid properties.'
    - Quotes are optional

removed:
  breaking:
    - if you have a breaking change you can use the breaking property to have the prefix.
```

```toml
# test-change.toml
version = "0.0.1"
release_date = "TBD"

[added]
added = [
  "We can also use toml."
]

[fixed]
breaking = [
  "the same properties work for both."
]
```

## Valid Keywords

- `added`
- `changed`
- `deprecated`
- `removed`
- `fixed`
- `security`
