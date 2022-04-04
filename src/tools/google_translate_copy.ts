document.addEventListener('keypress', ev => {
  if (ev.shiftKey && !ev.altKey && !ev.ctrlKey) {
    if (ev.key === 'W') {
      let clipboardStrings: string[] = []
      document.querySelectorAll('.kgnlhe').forEach(e => {
        clipboardStrings.push(e.innerHTML)
      })
      GM_setClipboard(clipboardStrings.join('|'))
    }
  }
})
