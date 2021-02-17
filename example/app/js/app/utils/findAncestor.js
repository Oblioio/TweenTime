/**
 * Searches ancestors of el for one that matches selector sel
 * Returns matching element or undefined if no match found
 *
 * @param  {HTMLElement} el
 * @param  {string} sel Selector to match
 * @return {HTMLElement|undefined}
 */
function findAncestor(el, sel) {
  let child = el;
  while (child && !child.matches(sel)) child = child.parentElement;
  return child;
}

export { findAncestor as default };