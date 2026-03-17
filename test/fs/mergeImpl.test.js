import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { deepEqual } from "node:assert/strict";
import mergeImpl from "../../src/fs/mergeImpl.js";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("mergeImpl.test.js", () => {
  it("should merge files alphabetically", async () => {
    //given
    mkdirSync("./workspace/parts", { recursive: true });
    writeFileSync("./workspace/parts/a.txt", "test_file_a_content");
    writeFileSync("./workspace/parts/b.txt", "test_file_b_content");
    writeFileSync("./workspace/parts/c.txt", "test_file_c_content");

    //when
    await mergeImpl([]);

    //then
    deepEqual(
      readFileSync("./workspace/merged.txt").toString(),
      "test_file_a_contenttest_file_b_contenttest_file_c_content",
    );
  });

  it("should merge passed files", async () => {
    //given
    mkdirSync("./workspace/parts", { recursive: true });
    writeFileSync("./workspace/parts/a.txt", "test_file_a_content");
    writeFileSync("./workspace/parts/b.txt", "test_file_b_content");
    writeFileSync("./workspace/parts/c.txt", "test_file_c_content");

    //when
    await mergeImpl(["node", "./script.js", "--files", "b.txt,c.txt"]);

    //then
    deepEqual(
      readFileSync("./workspace/merged.txt").toString(),
      "test_file_b_contenttest_file_c_content",
    );
  });
});
