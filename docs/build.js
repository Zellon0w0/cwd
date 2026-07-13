import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, "widget/dist/cwd.js");
const destDir = path.resolve(__dirname, "public");
const dest = path.resolve(destDir, "cwd.js");
const emotionSrcDir = path.resolve(__dirname, "../emotion");
const emotionDestDir = path.resolve(destDir, "emotion");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);

if (fs.existsSync(emotionSrcDir)) {
  fs.rmSync(emotionDestDir, { recursive: true, force: true });
  fs.cpSync(emotionSrcDir, emotionDestDir, {
    recursive: true,
    filter: (source) => path.basename(source) !== ".DS_Store",
  });
}
