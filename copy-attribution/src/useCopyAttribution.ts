import { useEffect, type RefObject } from "react";

export interface UseCopyAttributionOptions {
  append?: string | ((selectedText: string) => string);
  enabled?: boolean;
  minLength?: number;
}

export function useCopyAttribution<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseCopyAttributionOptions = {},
): void {
  const { append = "", enabled = true, minLength } = options;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const handleCopy = (event: ClipboardEvent) => {
      const selectedText = window.getSelection()?.toString() ?? "";

      if (!selectedText) {
        return;
      }

      if (typeof minLength === "number" && selectedText.length < minLength) {
        return;
      }

      if (!event.clipboardData) {
        return;
      }

      const appendText =
        typeof append === "function" ? append(selectedText) : append;
      const finalText = `${selectedText}${appendText}`;

      event.preventDefault();
      event.clipboardData.setData("text/plain", finalText);
    };

    element.addEventListener("copy", handleCopy);

    return () => {
      element.removeEventListener("copy", handleCopy);
    };
  }, [append, enabled, minLength, ref]);
}
