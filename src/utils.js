/**
 * @import nodeFs from "fs"
 */
import path from "path/posix";
import { readdir, rmdir, stat, unlink } from "fs/promises";

/**
 * @typedef {{
 *  readonly name: string;
 *  readonly stat: nodeFs.Stats;
 * }} DirFileItem
 */

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
 * @param {(dir: string, files: readonly DirFileItem[], onNextDir: () => Promise<void>) => Promise<void>} onDirItems
 * @returns {Promise<void>}
 */
export async function scanDirs(rootPath, onDirItems) {
  /** @type {(dir: string) => Promise<void>} */
  async function loop(dir) {
    const names = await readdir(path.join(rootPath, dir));
    const items = await Promise.all(
      names.map(async (name) => {
        const s = await stat(path.join(rootPath, dir, name));
        return { name, stat: s };
      }),
    );

    const dirs = items.filter((_) => _.stat.isDirectory());
    const files = items.filter((_) => !_.stat.isDirectory());

    await onDirItems(dir, files, async () => {
      await dirs.reduce(async (resP, { name }) => {
        await resP;
        await loop(path.join(dir, name));
      }, Promise.resolve());
    });
  }

  await loop("");
}

/**
 * @param {string} rootPath
 * @returns {Promise<void>}
 */
export async function deleteDirs(rootPath) {
  await scanDirs(rootPath, async (dir, files, onNextDir) => {
    await files.reduce(async (resP, { name }) => {
      await resP;
      await unlink(path.join(rootPath, dir, name));
    }, Promise.resolve());

    await onNextDir();
    await rmdir(path.join(rootPath, dir));
  });
}
