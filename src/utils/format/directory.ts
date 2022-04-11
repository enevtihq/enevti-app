export function getDirectory(path: string) {
  return path.substring(0, path.lastIndexOf('/') + 1);
}

export function getFilename(path: string) {
  return path.substring(path.lastIndexOf('/') + 1, path.length);
}

export function trimExtension(path: string, extension?: string) {
  if (extension) {
    if (
      path.substring(path.length - (extension.length + 1), path.length) ===
      `.${extension}`
    ) {
      return path.substring(0, path.length - (extension.length + 1));
    } else {
      return path;
    }
  } else {
    return path.replace(/\.[^/.]+$/, '');
  }
}
