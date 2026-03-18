import path from "path/posix";
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

  const entrySep = ",\n";
  let isFirstEntry = true;
  await scanDirs(rootPath, async (dir, files, onNextDir) => {
    if (dir !== "") {
      const dirEntry = `${entrySep}    { "path": "${dir}", "type": "directory" }`;
      await appendFile(snapshotFile, dirEntry);
    }

    await files.reduce(async (resP, { name, stat }) => {
      await resP;

      const maybeSep = isFirstEntry ? "" : ",\n";
      isFirstEntry = false;

      const entryPath = path.join(dir, name);
      const content = await readFile(path.join(rootPath, dir, name));
      const base64Content = content.toString("base64");
      const fileEntry = `${maybeSep}    { "path": "${entryPath}", "type": "file", "size": ${stat.size}, "content": "${base64Content}" }`;

      await appendFile(snapshotFile, fileEntry);
    }, Promise.resolve());

    await onNextDir();
  });

  const footer = `
  ]
}
`;
  await appendFile(snapshotFile, footer);
};

await snapshot();
