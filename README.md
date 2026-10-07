# grill-cards

A Claude Code plugin that turns the rounds of Matt Pocock's grilling skill into answer cards: a section per question, a picture per option, the recommendation pre-selected, and a text box for answering in your own words.

## Requirements

- **Matt Pocock's `grilling` skill must be installed** from [mattpocock/skills](https://github.com/mattpocock/skills). grill-cards does not install it for you, because people install it in different ways. Any install works, as long as the skill is named `grilling` (with or without a plugin prefix, for example `mattpocock-skills:grilling`). Follow that repository's install instructions, for example:

  ```
  /plugin install mattpocock-skills
  ```

  or

  ```
  npx skills@latest add mattpocock/skills
  ```

- The Claude desktop app (Code tab), where the `show_widget` tool renders the cards. Without it, the grill falls back to its plain text rounds.
- Optional: the [archify](https://github.com/tt-a1i/archify) skill, for the "Draw the big picture" button at the top of each form. A click builds one full-page diagram of how the round's questions connect, in the background; a ★ marks rounds where it is recommended. Without archify, the button is replaced by an install hint.

## Install

Add this repository as a plugin marketplace, then install the plugin:

```
/plugin install grill-cards@grill-cards
```

## How it works

A hook on `skill.prompt` watches for the `grilling` skill. When it loads, the hook appends the answer-card round format to the skill's prompt. Every other skill is left alone.
