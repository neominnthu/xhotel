# Keyboard Shortcut Conflicts and Localization Rules

## Conflict Rules

- Avoid overriding OS/browser defaults (Ctrl+L, Ctrl+T, Ctrl+W).
- Avoid text input conflicts (Enter, Space) unless in command mode.
- If conflict detected, show a toast and do not execute action.

## Reserved Keys

- Ctrl+F: browser find, do not override
- Ctrl+R: reload, do not override
- Alt+F4: system close, do not override

## Shortcut Localization

- Shortcuts remain the same across languages.
- Shortcut help UI shows translated labels.
- Use localized descriptions for tooltips.

## IME and Myanmar Input

- When IME is active, ignore global shortcuts triggered by normal typing.
- Use only modifier-based shortcuts for global commands.

## Conflict Resolution Strategy

- Priority: modal > drawer > page > global.
- If a modal is open, global shortcuts are disabled.
- Provide a visible help panel listing active shortcuts.

## Accessibility

- All shortcuts must be listed in the help panel.
- Provide alternative UI controls for every shortcut action.
