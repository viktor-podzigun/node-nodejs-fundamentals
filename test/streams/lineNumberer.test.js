import fs from "fs";
import os from "os";
import path from "path";
import { deepEqual } from "node:assert/strict";
import StringWritable from "../StringWritable.js";
import LineNumberTransformer from "../../src/streams/LineNumberTransformer.js";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("lineNumberer.test.js", () => {
  it("should prepend each input line with its number", async () => {
    //given
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "node-nodejs-fundamentals-"),
    );
    const file = path.join(tmpDir, "example.txt");
    fs.writeFileSync(file, "hello\nWorld!!!");
    const readable = fs.createReadStream(file, {
      highWaterMark: 6,
    });
    const writable = new StringWritable();

    //when
    const tr = new LineNumberTransformer();
    readable.pipe(tr).pipe(writable);

    //then
    /** @type {(v: any) => void} */
    let resolve = () => {};
    const resP = new Promise((res) => (resolve = res));
    readable.once("end", () => {
      resolve(undefined);
    });
    await resP;
    deepEqual(writable.data, "1 hello\n2 World!!!");

    //cleanup
    fs.unlinkSync(file);
    deepEqual(fs.existsSync(file), false);

    fs.rmdirSync(tmpDir);
    deepEqual(fs.existsSync(tmpDir), false);
  });
});
