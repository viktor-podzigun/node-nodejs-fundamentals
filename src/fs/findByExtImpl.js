// import { readdir } from "fs/promises"

/**
 * @param {Set<string>} extensions
 * @returns {Promise<readonly string[]>}
 */
async function findByExtImpl(extensions) {
  /** @type {(dir: string) => Promise<readonly string[]>} */
  async function loop(dir) {
    extensions.has(dir);
    return [];
  }

  return loop(".");
}

export default findByExtImpl;
