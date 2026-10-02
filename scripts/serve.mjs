import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (base && pathname === base) {
      res.writeHead(308, { Location: base + "/" });
      res.end();
      return;
    }
    if (base && !pathname.startsWith(base + "/")) throw new Error("Not found");
    const relative = base ? pathname.slice(base.length) : pathname;
    let path = resolve(root, "." + relative);
    if (path !== root && !path.startsWith(root + sep))
      throw new Error("Not found");
    if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
    const body = await readFile(path);
    res.writeHead(200, {
      "Content-Type": mime[extname(path)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(await readFile(resolve(root, "404.html")).catch(() => "Not found"));
  }
}).listen(Number(process.env.PORT || 3000), "0.0.0.0", () =>
  console.log(
    "Static preview ready on port " + (process.env.PORT || 3000) + base + "/",
  ),
);
