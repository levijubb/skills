# Skills

Agent skills by Levi Jubb. Each skill is a folder with a `SKILL.md` that teaches an agent how to do one job well.

Skills follow the [Agent Skills](https://agentskills.io/specification) format, so they work in Claude Code, Cursor, Codex and any other agent that supports it.

## Available skills

| Skill | Use it for |
| --- | --- |
| [`ui-degreaser`](skills/ui-degreaser/SKILL.md) | Any UI work: pages, components, marketing screens, dashboards and comps. Strips eyebrow text, taglines, helper text, generic AI design patterns and comments that add no value. |

## Install

### Any agent

With the [`skills`](https://github.com/vercel-labs/skills) CLI (Node.js 22.20+):

```bash
# Pick skills and agents interactively
npx skills add levijubb/skills

# Or install one skill for one agent
npx skills add levijubb/skills --skill ui-degreaser -a claude-code
```

Skills install into the current project. Add `-g` to make them available in every project.

### Claude Code plugin

```
/plugin marketplace add levijubb/skills
/plugin install ui-degreaser@levijubb-skills
```

### Manually

Copy a skill folder into your agent's skills directory, e.g. `~/.claude/skills/ui-degreaser/` for Claude Code.

## Usage

Installed skills load on their own when a task matches their description. You can also name one directly:

```
Use the ui-degreaser skill to redesign this pricing page
```

## Add a skill

```bash
cp -r template skills/my-skill
```

1. Set `name: my-skill` in the frontmatter, matching the folder name.
2. Write a `description` that says what the skill does and when to use it.
3. Remove the template's `metadata` block, then write the instructions.
4. Add the skill to `.claude-plugin/marketplace.json` and the table above.
5. Run `node scripts/validate-skills.mjs`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for naming rules and commit conventions.

## Layout

```
skills/<name>/SKILL.md      one folder per skill
template/SKILL.md           starting point for new skills
.claude-plugin/             Claude Code plugin marketplace
scripts/                    validation, also run in CI
```

## License

[MIT](LICENSE)
