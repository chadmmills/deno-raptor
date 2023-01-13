export default function getParams(
  url: string,
  path: string,
): Record<string, string> {
  const params: Record<string, string> = {};
  const urlParts = url.split("/");
  const pathParts = path.split("/");

  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i];
    const urlPart = urlParts[i];

    if (pathPart.startsWith("$")) {
      params[String(pathPart.slice(1))] = urlPart;
    }
  }

  return params;
}
