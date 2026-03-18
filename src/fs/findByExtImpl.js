import path from "path";
import { parseArgs, scanDirs } from "../utils.js";

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

  /** @type {string[]} */
  const result = [];

  await scanDirs(path.resolve(dir), async (rel, item, stat) => {
    if (!stat.isDirectory()) {
      const extIdx = item.lastIndexOf(".");
      const ext = extIdx >= 0 ? item.substring(extIdx) : item;
      if (extensions.has(ext)) {
        result.push(path.join(rel, item));
      }
    }
  });

  return result;
}

export default findByExtImpl;
