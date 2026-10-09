# Active TODO

This is the short, practical list of planned product improvements. `ROADMAP.md`
remains the longer delivery sequence for the whole platform.

## Interface polish

- [x] Add purposeful, reduced-motion-friendly animations for onboarding
  spotlights, transitions, and guide messages.
- [x] Add a user-selectable dark mode while keeping the neutral review desk
  easy to read in both themes.
- [x] Improve pull-request code readability with IDE-inspired presentation:
  syntax highlighting, a carefully sized monospace font, clearer line-number
  alignment, and readable added/removed-line styling. Keep it a review diff,
  not a pretend full code editor.
- [x] Move Kilo from the permanent onboarding side panel to a compact popup in the
  lower-right corner. It should never cover the current code or review controls.
- [x] When Kilo has a new message, show a subtle visual notification and play an
  optional notification sound. Respect reduced-motion preferences and provide a
  way to mute sound.
- [x] Create bespoke, project-owned comic-book artwork for Kilo and Supply HQ.
- [x] Redesign the review-debrief code comparison as one resizable unified diff.
  Show submitted lines in red and corrected lines in green, following familiar
  GitHub or IntelliJ review conventions without copying their branding or exact
  layout.
- [x] Add the simulated Sidekick Supply work PC with Today, GitGrub, local
  display and alert preferences, fullscreen, and a mobile fallback.
- [ ] Measure whether the work-PC shell improves task starts, completions,
  intentional context use, and return for another task before expanding the
  simulated tools.

## Learning loop

- [x] Add structured pull-request descriptions, optional progressive hints, and
  a read-only codebase explorer for PR-review investigation.
- [x] Add an original static storefront preview to onboarding that explains the
  product and the systems the learner will investigate.
- [ ] Author the first Core-level PR task with three deterministic findings, a
  benign distractor, and meaningful use of the codebase explorer.
- [ ] Decide whether a runnable in-app storefront improves Core-task learning
  before building it. Measure completion, intentional context use, and return
  for another task rather than treating browsing time as success.
