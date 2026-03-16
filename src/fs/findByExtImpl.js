import path from "path";
// import { readdir } from "fs/promises"

/**
 * @param {readonly string[]} processArgs
 * @param {string} dir
 * @returns {Promise<readonly string[]>}
 */
async function findByExtImpl(processArgs, dir) {
  const defaultExt = ".txt";
  const extensions = new Set([defaultExt]);

  if (processArgs.length > 2) {
    const arg1 = processArgs[2];
    if (arg1.trim() === "--ext" && processArgs.length > 3) {
      const arg2 = processArgs[3];

      extensions.clear();
      arg2.split(",").forEach((_) => {
        const ext = _.trim();
        extensions.add(ext.startsWith(".") ? ext : `.${ext}`);
      });

      if (extensions.size === 0) {
        extensions.add(defaultExt);
      }
    }
  }

  /** @type {(dir: string) => Promise<readonly string[]>} */
  async function loop(dir) {
    extensions.has(dir);
    return [];
  }

  return loop(path.resolve(dir));
}

export default findByExtImpl;
