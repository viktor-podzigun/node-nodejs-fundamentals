import { appendFile, mkdir, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import { parseArgs } from "../utils.js";
import findByExtImpl from "./findByExtImpl.js";

/**
 * @param {readonly string[]} processArgs
 * @returns {Promise<void>}
 */
async function mergeImpl(processArgs) {
  const parsedFiles = parseArgs(processArgs, "--files");
  const filesSorted = await (async () => {
    if (parsedFiles.length > 0) {
      return parsedFiles;
    }

    const files = await findByExtImpl([], "./workspace/parts");
    return [...files].sort();
  })();

  await mkdir("./workspace/parts", { recursive: true });
  if (existsSync("./workspace/merged.txt")) {
    await unlink("./workspace/merged.txt");
  }

  await filesSorted.reduce(async (resP, file) => {
    await resP;
    const content = await readFile(`./workspace/parts/${file}`);
    await appendFile("./workspace/merged.txt", content.toString());
  }, Promise.resolve());
}

export default mergeImpl;
