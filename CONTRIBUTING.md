# Contributing

## Pull Requests

- Branch from `main`
- Branch name: `feat/description`, `fix/description`, `docs/description`, etc.
- Keep PRs focused — one feature or fix per PR
- Ensure `pnpm build` passes before submitting
- Direct pushes to `main` are blocked; all changes go through PRs

## Commit Messages

```
prefix(package): content
```

### Prefix

- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code restructuring without behavior change
- `docs` — Documentation
- `chore` — Build, config, and other maintenance

### Package

Target package name: `core`, `dom`, `react`, `playground`

Can be omitted when changes span multiple packages.

### Examples

```
feat(core): add border and shadow support to box node
fix(renderer): correct canvas scaling on HiDPI displays
refactor(core): split node rendering into separate modules for extensibility
docs: add CONTRIBUTING.md
```
