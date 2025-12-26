/**
 * Returns the {top, left} coordinates of the caret in a textarea.
 * This is done by creating a mirrored div that replicates the textarea's styles
 * and inserting the text up to the caret position to measure its height.
 */
export function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): { top: number; left: number } {
  const div = document.createElement('div');
  const style = window.getComputedStyle(element);

  // Copy relevant styles from the textarea to the mirror div
  div.style.direction = style.direction;
  div.style.boxSizing = style.boxSizing;
  div.style.width = style.width;
  div.style.height = style.height;
  div.style.overflowX = style.overflowX;
  div.style.overflowY = style.overflowY;
  div.style.borderTopWidth = style.borderTopWidth;
  div.style.borderRightWidth = style.borderRightWidth;
  div.style.borderBottomWidth = style.borderBottomWidth;
  div.style.borderLeftWidth = style.borderLeftWidth;
  div.style.paddingTop = style.paddingTop;
  div.style.paddingRight = style.paddingRight;
  div.style.paddingBottom = style.paddingBottom;
  div.style.paddingLeft = style.paddingLeft;
  div.style.fontStyle = style.fontStyle;
  div.style.fontVariant = style.fontVariant;
  div.style.fontWeight = style.fontWeight;
  div.style.fontStretch = style.fontStretch;
  div.style.fontSize = style.fontSize;
  div.style.lineHeight = style.lineHeight;
  div.style.fontFamily = style.fontFamily;
  div.style.textAlign = style.textAlign;
  div.style.textTransform = style.textTransform;
  div.style.textIndent = style.textIndent;
  div.style.letterSpacing = style.letterSpacing;
  div.style.wordSpacing = style.wordSpacing;

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';

  const textContent = element.value.substring(0, position);

  // Create a span for the text BEFORE cursor, and append a dummy span for the cursor itself.
  const textNode = document.createTextNode(textContent);
  const caretSpan = document.createElement('span');
  caretSpan.textContent = '|';

  div.appendChild(textNode);
  div.appendChild(caretSpan);

  document.body.appendChild(div);

  const coordinates = {
    top: caretSpan.offsetTop + parseInt(style.borderTopWidth || '0'),
    left: caretSpan.offsetLeft + parseInt(style.borderLeftWidth || '0'),
  };

  document.body.removeChild(div);

  return coordinates;
}
