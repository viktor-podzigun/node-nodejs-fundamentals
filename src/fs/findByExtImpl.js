import path from "path";
import { readdir, stat } from "fs/promises";

/**
 * @param {readonly string[]} processArgs
 * @param {string} dir
 * @returns {Promise<readonly string[]>}
 */
async function findByExtImpl(processArgs, dir) {
  const extensions = new Set([".txt"]);
  const parsedArgs = parseArgs(processArgs);
  if (parsedArgs.length > 0) {
    extensions.clear();
    parsedArgs.forEach((_) => {
      extensions.add(_);
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

/** @type {(processArgs: readonly string[]) => readonly string[]} */
function parseArgs(processArgs) {
  /** @type {string[]} */
  const result = [];

  if (processArgs.length > 2) {
    const arg1 = processArgs[2];
    if (arg1.trim() === "--ext" && processArgs.length > 3) {
      const arg2 = processArgs[3];

      arg2.split(",").forEach((_) => {
        const ext = _.trim();
        result.push(ext.startsWith(".") ? ext : `.${ext}`);
      });
    }
  }

  return result;
}

export default findByExtImpl;
