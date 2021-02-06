/**
 * Loads an external script by placing a script tag in the document head
 * Returns a promise which resolves once the script has loaded
 *
 * @param  {string} src
 * @return {Promise} Promise object which resolves once script is loaded
 */
function loadScript(src) {
  return new Promise(((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  }));
}

export { loadScript as default };
