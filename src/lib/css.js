// Turns an inline CSS string ("color:#fff;font-size:11px") into a React style
// object, so markup can be ported from the design file without retyping styles.
const cache = new Map();

export function css(str) {
  let out = cache.get(str);
  if (out) return out;
  out = {};
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    if (!prop) continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = decl.slice(i + 1).trim();
  }
  cache.set(str, out);
  return out;
}
