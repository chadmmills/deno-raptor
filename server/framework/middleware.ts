export function requestTime(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const start = performance.now();
    const result = await fn(req);
    const end = performance.now();
    console.log(
      `${req.method} - ${result.status} - ${new URL(req.url).pathname} - ${
        Math.round(end - start)
      }ms`,
    );

    return result;
  };
}
