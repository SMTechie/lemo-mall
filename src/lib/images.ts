const imagePathPattern = /^\/api\/images\/[a-z0-9]+$/i;

export function imageAssetPath(id: string) {
  return `/api/images/${id}`;
}

export function isStoredImagePath(value: string) {
  return imagePathPattern.test(value);
}
