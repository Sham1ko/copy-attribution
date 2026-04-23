import { useEffect } from 'react'

function getSelectedText() {
  const pageSelection = window.getSelection()?.toString()

  if (pageSelection) {
    return pageSelection
  }

  const activeElement = document.activeElement

  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    const { selectionStart, selectionEnd, value } = activeElement

    if (
      selectionStart !== null &&
      selectionEnd !== null &&
      selectionStart !== selectionEnd
    ) {
      return value.slice(selectionStart, selectionEnd)
    }
  }

  return ''
}

export function useCopyWithAttribution(attributionText: string) {
  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
      const selectedText = getSelectedText().trim()

      if (!selectedText || !event.clipboardData) {
        return
      }

      const attributedText = `${selectedText}\n\n${attributionText}`

      event.preventDefault()
      event.clipboardData.setData('text/plain', attributedText)
    }

    document.addEventListener('copy', handleCopy)

    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [attributionText])
}
