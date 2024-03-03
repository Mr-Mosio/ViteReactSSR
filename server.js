import { fileURLToPath } from 'url';
import path from 'path';
import fsp from "fs/promises"
import express from "express"
import compression from  "compression"
import {createServer as createViteServer} from 'vite';
import cookieParser from "cookie-parser"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = process.env.PORT || 3000;

let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";

function resolve(p) {
  return path.resolve(__dirname, p);
}

async function createServer() {
  let app = express();
  app.use(cookieParser())
  app.use(compression());

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await createViteServer({
      root,
      appType: 'custom',
      server: { middlewareMode: true },
    });


    app.use(vite.middlewares);
  } else {
    app.use("/assets", express.static(resolve("dist/client/assets")));
  }
  app.use("*", async (req, res) => {
    let url = req.originalUrl;
    try {
      let template;
      let render;

      if (!isProduction) {
        template = await fsp.readFile(resolve("index.html"), "utf8");
        template = await vite.transformIndexHtml(url, template);
        render = await (await vite
        .ssrLoadModule("src/entry.server.jsx")).render;
      } else {
        template = await fsp.readFile(
            resolve("dist/client/index.html"),
            "utf8"
        );
        render = (await import("./dist/server/entry.server.js")).render;
      }

      try {
        let appHtml = await render(req);
        let html = template.replace("<!--app-html-->", appHtml);
        res.setHeader("Content-Type", "text/html");
        return res.status(200).end(html);
      } catch (e) {
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          return res.redirect(e.status, e.headers.get("Location"));
        }
        throw e;
      }
    } catch (error) {
      if (!isProduction) {
        vite.ssrFixStacktrace(error);
      }
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  return app;
}

createServer().then((app) => {
  app.listen(port, () => {
    console.log(`HTTP server is running at http://localhost:${port}`);
  });
});
