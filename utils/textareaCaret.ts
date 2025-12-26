export type CaretCoordinates = {
  top: number;
  left: number;
  height: number;
};

/**
 * Returns caret coordinates in viewport space for a given selection position in a textarea.
 * Uses the "mirror div" technique so it works with wrapping and variable fonts.
 */
export function getTextareaCaretCoordinates(
  textarea: HTMLTextAreaElement,
  position: number,
): CaretCoordinates {
  // Defensive clamp
  const pos = Math.max(0, Math.min(position, textarea.value.length));

  const div = document.createElement("div");
  const style = window.getComputedStyle(textarea);

  // Copy the textarea's relevant styles to the mirror div
  const properties: Array<keyof CSSStyleDeclaration> = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "textTransform",
    "textIndent",
    "letterSpacing",
    "wordSpacing",
    "tabSize",
  ];

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.top = "0";
  div.style.left = "-9999px";

  for (const prop of properties) {
    // Some properties may not exist on some browsers; getPropertyValue is safe.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (div.style as any)[prop] = style[prop] || style.getPropertyValue(prop as any);
  }

  // Mirror content up to caret
  div.textContent = textarea.value.substring(0, pos);

  // Marker span at caret
  const span = document.createElement("span");
  // If at end, span must have content to get a measurable rect.
  span.textContent = textarea.value.substring(pos) || ".";
  div.appendChild(span);

  document.body.appendChild(div);

  const divRect = div.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();
  const taRect = textarea.getBoundingClientRect();

  // Translate mirror coords back into viewport coords for the textarea.
  const top =
    taRect.top + (spanRect.top - divRect.top) - (textarea.scrollTop || 0);
  const left =
    taRect.left + (spanRect.left - divRect.left) - (textarea.scrollLeft || 0);
  const height = spanRect.height || parseFloat(style.lineHeight) || 16;

  document.body.removeChild(div);

  return { top, left, height };
}

