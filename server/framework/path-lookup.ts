export default function pathLookup(path: string, pathKeys: string[]): string | null {
  for (const pathKey of pathKeys) {
    const pathKeyParts = pathKey.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);

    // console.log(pathKeyParts, pathParts);

    if (pathKeyParts.length === 0 && pathParts.length === 0) {
      return pathKey;
    }


    if (pathKeyParts.length !== pathParts.length) {
      continue;
    }

    for (let i = 0; i < pathKeyParts.length; i++) {
      const isAtEnd = i === pathKeyParts.length - 1;
      const isParam = pathKeyParts[i].startsWith(":");

      if (isAtEnd) {
        if (isParam) return pathKey;
        if (pathKeyParts[i] === pathParts[i]) return pathKey;
      }

      if (pathKeyParts[i].startsWith(":")) {
        continue;
      }
      
      if (pathKeyParts[i] !== pathParts[i]) {
        break;
      }
    }
  }

  return null;
}
