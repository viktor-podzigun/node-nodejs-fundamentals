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

  await scanDirs(path.resolve(dir), async (dir, files, onNextDir) => {
    files.forEach(({ name }) => {
      const extIdx = name.lastIndexOf(".");
      const ext = extIdx >= 0 ? name.substring(extIdx) : name;
      if (extensions.has(ext)) {
        result.push(path.join(dir, name));
      }
    });

    await onNextDir();
  });

  return result;
}

export default findByExtImpl;
