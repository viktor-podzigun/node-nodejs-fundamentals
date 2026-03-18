import path from "path";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import readline from "readline";

/**
 * @typedef {SnapshotDirEntry | SnapshotFileEntry} SnapshotEntry
 */

/**
 * @typedef {{
 *  readonly path: string;
 *  readonly type: "directory";
 * }} SnapshotDirEntry
 */

/**
 * @typedef {{
 *  readonly path: string;
 *  readonly type: "file";
 *  readonly content: string;
 * }} SnapshotFileEntry
 */

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
  /**
```json
{
  "rootPath": "/absolute/path/to/workspace",
  "entries": [
    { "path": "file1.txt", "type": "file", "size": 1024, "content": "base64" },
    { "path": "nested", "type": "directory" }
  ]
}
```
`entries[].path` values must be relative to `workspace`.
   */
  const rootPath = "./workspace_restored";
  await mkdir(rootPath, { recursive: true });

  const rl = readline.createInterface({
    input: fs.createReadStream("./snapshot.json"),

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    crlfDelay: Infinity,
  });

  let isEntriesStart = false;
  let isEntriesEnd = false;
  for await (const line of rl) {
    if (!isEntriesStart && line.includes("entries")) {
      isEntriesStart = true;
      continue;
    }
    if (line.includes("]")) {
      isEntriesEnd = true;
      continue;
    }
    if (!isEntriesStart || isEntriesEnd) {
      continue;
    }

    const jsonStr = line.substring(0, line.lastIndexOf("}") + 1);
    /** @type {SnapshotEntry} */
    const entry = JSON.parse(jsonStr);
    const itemPath = path.join(rootPath, entry.path);

    if (entry.type === "directory") {
      await mkdir(itemPath, { recursive: true });
    } else {
      const content = Buffer.from(entry.content, "base64");
      await writeFile(itemPath, content);
    }
  }

  rl.close();
};

await restore();
