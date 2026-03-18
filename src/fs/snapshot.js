import path from "path";
import { existsSync } from "fs";
import { appendFile, readFile, unlink } from "fs/promises";
import { scanDirs } from "../utils.js";

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
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
  const rootPath = path.resolve("./workspace");
  const snapshotFile = "./snapshot.json";
  if (existsSync(snapshotFile)) {
    await unlink(snapshotFile);
  }

  const header = `{
  "rootPath": "${rootPath}",
  "entries": [
`;
  await appendFile(snapshotFile, header);

  let isFirstEntry = true;
  await scanDirs(rootPath, async (rel, item, stat) => {
    const entryPath = path.join(rel, item);
    const maybeSep = isFirstEntry ? "" : ",\n";
    isFirstEntry = false;

    const entry = await (async () => {
      if (stat.isDirectory()) {
        return `${maybeSep}    { "path": "${entryPath}", "type": "directory" }`;
      }

      const content = await readFile(path.join(rootPath, rel, item));
      const base64Content = content.toString("base64");
      return `${maybeSep}    { "path": "${entryPath}", "type": "file", "size": ${stat.size}, "content": "${base64Content}" }`;
    })();

    await appendFile(snapshotFile, entry);
  });

  const footer = `
  ]
}
`;
  await appendFile(snapshotFile, footer);
};

await snapshot();
