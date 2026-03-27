export function removeTrailingSlash(path) {
  const lastIndex = path.length - 1;
  if (path[lastIndex] === '/') {
    return path.substring(0, lastIndex);
  }
  return path;
}

export function getTimestamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}
