import { deepEqual } from "node:assert/strict";
import findByExtImpl from "../../src/fs/findByExtImpl.js";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("findByExtImpl.test.js", () => {
  it("should return empty array if no matching files found", async () => {
    //given
    const extensions = new Set(".txt");

    //when
    const result = await findByExtImpl(extensions);

    //then
    deepEqual(result, []);
  });
});
