# Skills

The agent skills I use day to day. Each one is a folder with a `SKILL.md` that works with Claude Code, Cursor, Codex or anything else that reads the [Agent Skills](https://agentskills.io/specification) format.

- **[ui-degreaser](./skills/ui-degreaser/SKILL.md)**: Strips the AI slop out of UI work, like eyebrow text, filler copy and generic layouts, plus code comments that add nothing.

## Install

```bash
npx skills add levijubb/skills
```

Or grab one skill for one agent:

```bash
npx skills add levijubb/skills --skill ui-degreaser -a claude-code
```

In Claude Code you can use the plugin marketplace instead:

```
/plugin marketplace add levijubb/skills
/plugin install ui-degreaser@levijubb-skills
```

If you want to add your own, start from [`template/`](./template/SKILL.md) and see [CONTRIBUTING.md](./CONTRIBUTING.md).

MIT licensed. See [LICENSE](./LICENSE).
