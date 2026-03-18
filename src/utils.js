/**
 * @import nodeFs from "fs"
 */
import path from "path";
import { readdir, stat } from "fs/promises";

/**
 * @param {readonly string[]} processArgs
 * @param {string} argName
 * @param {string} [valueSep]
 * @returns {readonly string[]}
 */
export function parseArgs(processArgs, argName, valueSep = ",") {
  /** @type {string[]} */
  const values = [];

  if (processArgs.length > 2) {
    const arg1 = processArgs[2];

    if (arg1.trim() === argName && processArgs.length > 3) {
      const arg2 = processArgs[3];

      arg2.split(valueSep).forEach((_) => values.push(_));
    }
  }

  return values;
}

/**
 * @param {string} rootPath
 * @param {(rel: String, item: String, stat: nodeFs.Stats) => Promise<void>} onDirItem
 * @returns {Promise<void>}
 */
export async function scanDirs(rootPath, onDirItem) {
  /** @type {(rel: string) => Promise<void>} */
  async function loop(rel) {
    const items = await readdir(path.join(rootPath, rel));
    const stats = await Promise.all(
      items.map(async (item) => {
        const s = await stat(path.join(rootPath, rel, item));
        return { item, stat: s };
      }),
    );

    await stats.reduce(async (resP, { item, stat }) => {
      await resP;
      await onDirItem(rel, item, stat);

      if (stat.isDirectory()) {
        await loop(path.join(rel, item));
      }
    }, /** @type {Promise<void>} */ (Promise.resolve()));
  }

  await loop("");
}
