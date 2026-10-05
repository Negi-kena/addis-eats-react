/**
 * Relative image paths (e.g. "images/x.png") resolve differently
 * depending on how deep the current route is — correct at "/menu",
 * broken at "/admin/menu". Prefixing with "/" makes every path
 * root-relative, so it works identically no matter which route
 * renders it. Leaves absolute URLs and data URIs untouched.
 */
export function normalizeImagePath(path) {
  if (!path) return path;
  if (path.startsWith('/') || path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  return `/${path}`;
}