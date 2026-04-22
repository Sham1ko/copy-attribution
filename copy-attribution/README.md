# copy-attribution

`copy-attribution` is a small set of React hooks that append extra text to copied text either inside a target element or across the whole page.

It is a browser-side solution built on the native `copy` event. The hooks listen for copy events, read the current selection with `window.getSelection()?.toString()`, prevent the default behavior, and write modified plain text back into the clipboard.

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

## Global usage

```tsx
import { useGlobalCopyAttribution } from "copy-attribution";

export function App() {
  useGlobalCopyAttribution({
    append: "\n\nCopied from my app",
    minLength: 10,
  });

  return <main>Copy anywhere on this page.</main>;
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

### `useGlobalCopyAttribution(options)`

Attaches a `copy` listener to `document` and applies the same rules across the whole page.

## Notes and limitations

- This only works for copy actions that happen inside the element attached to the provided `ref`.
- `useGlobalCopyAttribution` works page-wide, but still only inside the current browser document.
- This is not a global clipboard interceptor and does not modify OS-level clipboard behavior.
- The hook only writes `text/plain`.
- The user still needs to trigger a normal browser copy action, such as `Ctrl+C`, `Cmd+C`, or the context menu.
