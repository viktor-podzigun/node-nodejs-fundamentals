import path from "path";
import { readdir, stat } from "fs/promises";
import { parseArgs } from "../utils.js";

/**
 * @param {readonly string[]} processArgs
 * @param {string} dir
 * @returns {Promise<readonly string[]>}
 */
async function findByExtImpl(processArgs, dir) {
  const extensions = new Set([".txt"]);
  const parsedExts = parseArgs(processArgs, "--ext");
  if (parsedExts.length > 0) {
    extensions.clear();
    parsedExts.forEach((_) => {
      const ext = _.trim();
      extensions.add(ext.startsWith(".") ? ext : `.${ext}`);
    });
  }

  /** @type {(dir: string, rel: string, result: string[]) => Promise<readonly string[]>} */
  async function loop(dir, rel, result) {
    const items = await readdir(path.join(dir, rel));
    const stats = await Promise.all(
      items.map(async (item) => {
        const s = await stat(path.join(dir, rel, item));
        return { item, stat: s };
      }),
    );

    await stats.reduce(async (resP, { item, stat }) => {
      await resP;
      if (stat.isDirectory()) {
        await loop(dir, path.join(rel, item), result);
        return;
      }

      const extIdx = item.lastIndexOf(".");
      const ext = extIdx >= 0 ? item.substring(extIdx) : item;
      if (extensions.has(ext)) {
        result.push(path.join(rel, item));
      }
    }, /** @type {Promise<void>} */ (Promise.resolve()));

    return result;
  }

  return loop(path.resolve(dir), "", []);
}

export default findByExtImpl;
