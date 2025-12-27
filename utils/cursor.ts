/**
 * Returns the {top, left} coordinates of the caret in a textarea.
 * This is done by creating a mirrored div that replicates the textarea's styles
 * and inserting the text up to the caret position to measure its height.
 */
export interface CaretCoordinates {
  top: number;
  left: number;
}

export function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): CaretCoordinates {
  const div = document.createElement('div');
  const style = window.getComputedStyle(element);
  
  const properties: string[] = [
    'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
    'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign',
    'textTransform', 'textIndent', 'textDecoration', 'letterSpacing',
    'wordSpacing', 'tabSize'
  ];

  properties.forEach(prop => {
    (div.style as any)[prop] = style.getPropertyValue(prop);
  });

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.overflow = 'hidden';

  const textContent = element.value.substring(0, position);
  
  // Create a span for the text BEFORE cursor, and append a dummy span for the cursor itself.
  const textNode = document.createTextNode(textContent);
  const caretSpan = document.createElement('span');
  caretSpan.textContent = '|';
  
  div.appendChild(textNode);
  div.appendChild(caretSpan);
  
  document.body.appendChild(div);

  const borderTop = parseInt(style.borderTopWidth) || 0;
  const paddingTop = parseInt(style.paddingTop) || 0;
  
  const coordinates: CaretCoordinates = {
    top: caretSpan.offsetTop + borderTop + paddingTop,
    left: caretSpan.offsetLeft
  };
  
  document.body.removeChild(div);

  return coordinates;
}

/**
 * Get the line height of a textarea element
 */
export function getLineHeight(element: HTMLTextAreaElement): number {
  const style = window.getComputedStyle(element);
  const lineHeight = style.lineHeight;
  
  if (lineHeight === 'normal') {
    // Approximate normal line height as 1.2 * font size
    const fontSize = parseFloat(style.fontSize);
    return fontSize * 1.2;
  }
  
  return parseFloat(lineHeight);
}
