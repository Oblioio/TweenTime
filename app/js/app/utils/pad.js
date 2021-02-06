/**
 * Returns 0-padded number s digits in length
 *
 * @param  {string} n
 * @param  {number} s
 */
const pad = (n, s) => (`000000000${n}`).substr(-s);

export { pad as default };
