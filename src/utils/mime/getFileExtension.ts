export default function getFileExtension(path: string) {
  return path.split(/[#?]/)[0].split('.').pop()!.trim();
}
