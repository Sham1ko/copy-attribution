import { useEffect, type RefObject } from "react";

export interface UseCopyAttributionOptions {
  append?: string | ((selectedText: string) => string);
  enabled?: boolean;
  minLength?: number;
}

function isNodeWithinElement(node: Node | null, element: HTMLElement) {
  if (!node) {
    return false;
  }

  return element.contains(
    node.nodeType === Node.TEXT_NODE ? node.parentNode : node,
  );
}

function isSelectionWithinElement(element: HTMLElement) {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  return (
    isNodeWithinElement(selection.anchorNode, element) ||
    isNodeWithinElement(selection.focusNode, element)
  );
}

function shouldSkipCopy(
  selectedText: string,
  enabled: boolean,
  minLength?: number,
) {
  if (!enabled || !selectedText) {
    return true;
  }

  if (typeof minLength === "number" && selectedText.length < minLength) {
    return true;
  }

  return false;
}

function createCopyHandler({
  append,
  enabled,
  minLength,
  shouldHandle,
}: Required<Pick<UseCopyAttributionOptions, "append" | "enabled">> &
  Pick<UseCopyAttributionOptions, "minLength"> & {
    shouldHandle?: () => boolean;
  }) {
  return (event: ClipboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (shouldHandle && !shouldHandle()) {
      return;
    }

    const selectedText = window.getSelection()?.toString() ?? "";

    if (shouldSkipCopy(selectedText, enabled, minLength) || !event.clipboardData) {
      return;
    }

    const appendText =
      typeof append === "function" ? append(selectedText) : append;
    const finalText = `${selectedText}${appendText}`;

    event.preventDefault();
    event.clipboardData.setData("text/plain", finalText);
  };
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

    const handleCopy = createCopyHandler({
      append,
      enabled,
      minLength,
      shouldHandle: () => isSelectionWithinElement(element),
    });

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [append, enabled, minLength, ref]);
}

export function useGlobalCopyAttribution(
  options: UseCopyAttributionOptions = {},
): void {
  const { append = "", enabled = true, minLength } = options;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleCopy = createCopyHandler({ append, enabled, minLength });

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [append, enabled, minLength]);
}
