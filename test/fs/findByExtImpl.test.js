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
    //when
    const result = await findByExtImpl([], "./test");

    //then
    deepEqual(result, []);
  });

  // it("should return non-empty array if matching files found", async () => {
  //   //when
  //   const result = await findByExtImpl(
  //     ["node", "./scrip.js", "--ext", "js"],
  //     "./test",
  //   );

  //   //then
  //   deepEqual(result.length > 0, true);
  // });
});
