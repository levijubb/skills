# Contributing

## Skill structure

```
skills/my-skill/
├── SKILL.md       required: frontmatter + instructions
├── scripts/       optional: code the agent can run
├── references/    optional: docs the agent reads on demand
└── assets/        optional: templates, images, data
```

Start from the template:

```bash
cp -r template skills/my-skill
```

Then remove the template's `metadata` block, which only exists to hide the template from `npx skills add`.

## Frontmatter

```yaml
---
name: my-skill
description: What the skill does and when to use it. Name the tasks and keywords that should trigger it.
---
```

Rules, from the [Agent Skills spec](https://agentskills.io/specification):

- `name` must match the folder name.
- `name` is 1 to 64 characters: lowercase letters, numbers and hyphens. No leading, trailing or double hyphens.
- `description` is required, up to 1024 characters. Agents decide whether to load a skill from this line alone, so say when to use it, not only what it is.
- Keep `SKILL.md` under 500 lines. Move long reference material into `references/`.

## Register the skill

Add a plugin entry to `.claude-plugin/marketplace.json` so it installs through Claude Code:

```json
{
  "name": "my-skill",
  "description": "One line shown in the /plugin browser",
  "source": "./",
  "strict": false,
  "skills": ["./skills/my-skill"]
}
```

Then add a line for it to the skills list in the README.

## Validate

```bash
node scripts/validate-skills.mjs
```

This checks every `skills/*/SKILL.md` for valid frontmatter and confirms each skill is listed in the marketplace.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/), with the skill name as the scope when a change touches one skill:

```
feat(ui-degreaser): add dark mode rules
fix(ui-degreaser): stop flagging form error text as helper text
docs: add install steps for Codex
ci: validate skill descriptions
chore: update .gitignore
```

- `feat` adds a skill or a new behaviour to one.
- `fix` corrects a skill that misfires or gives bad output.
- `docs`, `ci`, `chore`, `refactor` for everything else.
- Keep the subject lowercase and imperative, with no trailing full stop.

Pull request titles follow the same format, so squash merges keep a clean history.
