import { useEffect } from "react";

export interface UseCopyAttributionOptions {
  append?: string | ((selectedText: string) => string);
  enabled?: boolean;
  minLength?: number;
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
}: Required<Pick<UseCopyAttributionOptions, "append" | "enabled">> &
  Pick<UseCopyAttributionOptions, "minLength">) {
  return (event: ClipboardEvent) => {
    if (event.defaultPrevented) {
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

export function useCopyAttribution(
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
