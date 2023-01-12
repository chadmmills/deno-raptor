import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";

type TWalker = (path: string) => Promise<{ path: string }[]>
type TImporter<T> = (path: string) => Promise<T>

const Cwd = Deno.cwd()

async function routeWalker(path: string) {
  const paths = []
  for await (const entry of walk(path, { includeDirs: false })) {
    paths.push({ path: entry.path})
  }
  return paths
}

function localImporter<T>(path: string) {
  return import(path) as Promise<T>
}

export default class RouterMap {
  relativePath: string;
  walker: TWalker;

  constructor(relativePath: string, walker: TWalker = routeWalker) {
    this.relativePath = relativePath;
    this.walker = walker;
  }

  async load<T>(cwd:string = Cwd, importer: TImporter<T> = localImporter): Promise<{ [key: string]: T }> {
    const routePaths = await this.walker(this.relativePath);

    const routeMapper: { [key: string]: T } = {}

    // Is this slow? 
    console.info("Loading routes...");
    await Promise.all(routePaths.map(async (routePath) => {
      const route = await importer(cwd + "/" + routePath.path)
      const key = routePath.path.replace("index.ts", "")
        .replace("server/routes", "").replace(".ts", "")
        console.info(`- ${key}`)
      routeMapper[key] = route
    }));

    return routeMapper;
  }
}
