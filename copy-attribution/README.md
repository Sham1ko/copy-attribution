# copy-attribution

`copy-attribution` is a small React hook that appends extra text to copied text inside a target element.

It is a browser-side solution built on the native `copy` event. The hook listens for copy events on a specific element, reads the current selection with `window.getSelection()?.toString()`, prevents the default behavior, and writes modified plain text back into the clipboard.

## Installation

```bash
npm install copy-attribution react
```

## Basic usage

```tsx
import { useRef } from "react";
import { useCopyAttribution } from "copy-attribution";

export function Article() {
  const ref = useRef<HTMLDivElement>(null);

  useCopyAttribution(ref, {
    append: () => `\n\nSource: ${window.location.href}`,
    minLength: 20,
  });

  return <div ref={ref}>Select and copy this article text.</div>;
}
```

## API

### `useCopyAttribution(ref, options)`

Attaches a `copy` listener to `ref.current`.

#### Parameters

```ts
useCopyAttribution(
  ref,
  options,
)
```

- `ref`: `React.RefObject<HTMLElement | null>`
- `options.append?`: `string | ((selectedText: string) => string)`
- `options.enabled?`: `boolean`
- `options.minLength?`: `number`

#### Behavior

- If there is no selected text, the hook does nothing.
- If `enabled` is `false`, the hook does nothing.
- If `minLength` is set and the selected text is shorter, the hook does nothing.
- Otherwise the hook appends extra text and writes the result into the clipboard as plain text.

## Notes and limitations

- This only works for copy actions that happen inside the element attached to the provided `ref`.
- This is not a global clipboard interceptor and does not modify OS-level clipboard behavior.
- The hook only writes `text/plain`.
- The user still needs to trigger a normal browser copy action, such as `Ctrl+C`, `Cmd+C`, or the context menu.
