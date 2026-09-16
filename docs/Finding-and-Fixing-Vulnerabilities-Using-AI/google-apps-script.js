// Google apps script
function linkifyCitations() { // Add hyperlinks from citations per bibliography
  // SAFE TO RERUN: Will replace URLs per the bibliography
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const citationMap = {};

  // 1. Get all paragraphs and list items in the document structure
  const numChildren = body.getNumChildren();
  let inBibliography = false;
  let bibliographyIndex = -1; // Top-level child index where "Bibliography" starts

  // 2. Map entries only AFTER finding the "Bibliography" header
  for (let i = 0; i < numChildren; i++) {
    const child = body.getChild(i);
    const type = child.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.LIST_ITEM) {
      const rawText = child.getText();
      const text = rawText.trim();

      // Check if this line is exactly "Bibliography"
      if (text.toLowerCase() === "bibliography") {
        inBibliography = true;
        bibliographyIndex = i;
        continue;
      }

      // If we are past the header, check for [ID] and a URL
      if (inBibliography && text.length > 0) {
        const idMatch = text.match(/^\[([^\s\]]+)\]/);
        const urlMatch = text.match(/(https?:\/\/[^\s>]+)/);

        if (idMatch && urlMatch) {
          const id = idMatch[1];
          const url = urlMatch[1].replace(/[.,;)]+$/, ''); // Clean trailing punctuation
          citationMap[id] = url;

          // Also make the URL text in the bibliography entry itself
          // clickable. Offsets must be relative to rawText (leading
          // whitespace trimmed off `text` would otherwise shift them).
          const leadingWhitespace = rawText.length - rawText.trimStart().length;
          const urlStart = leadingWhitespace + urlMatch.index;
          const urlEnd = urlStart + url.length - 1; // Exclude stripped trailing punctuation
          child.editAsText().setLinkUrl(urlStart, urlEnd, url);
        }
      }
    }
  }

  // Check if we found anything before doing the search-and-replace
  const citationKeys = Object.keys(citationMap);
  if (citationKeys.length === 0) {
    DocumentApp.getUi().alert('No citation keys with URLs were found after the Bibliography heading.');
    return;
  }

  // 3. Linkify every [ID] found in the document
  let totalLinked = 0;
  citationKeys.forEach(id => {
    // Escape special characters so findText regex doesn't break
    const escapedId = id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const searchPattern = "\\[" + escapedId + "\\]";
    const url = citationMap[id];
    
    let found = body.findText(searchPattern);
    while (found) {
      const textElement = found.getElement().asText();

      // Stop once we reach the Bibliography section itself: only the
      // *rest* of the document should get links, not the entries where
      // the [ID] sits right next to its own URL already.
      const paragraphIndex = body.getChildIndex(textElement.getParent());
      if (paragraphIndex >= bibliographyIndex) break;

      const startOffset = found.getStartOffset() + 1; // Start inside '['
      const endOffset = startOffset + id.length - 1;   // End before ']'

      textElement.setLinkUrl(startOffset, endOffset, url);
      totalLinked++;

      found = body.findText(searchPattern, found);
    }
  });

  DocumentApp.getUi().alert(`Success! Linked ${totalLinked} citation occurrences for ${citationKeys.length} sources.`);
}
