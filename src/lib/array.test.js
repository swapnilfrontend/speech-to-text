import { deepEqual, deepClone, compact } from "./array";

describe("array fn test", () => {
  test("deepEqual", () => {
    expect(deepEqual([], [])).toBeTruthy();
    expect(deepEqual([1, 2], [1, 2])).toBeTruthy();
    expect(
      deepEqual(
        [
          [1, 2],
          [1, 2]
        ],
        [
          [1, 2],
          [1, 2]
        ]
      )
    ).toBeTruthy();
    expect(deepEqual([{ k: [1, 2] }], [{ k: [1, 2] }])).toBeTruthy();
  });

  test("deepClone", () => {
    const array = [{ k: [1, 2] }];
    const clonedArray = deepClone(array);
    expect(array === clonedArray).toBeFalsy();
    expect(array).toStrictEqual(clonedArray);
  });

  test("compact", () => {
    expect(compact(["1", 0])).toStrictEqual(["1"]);
    expect(compact(["1", 0, 2, true, false])).toStrictEqual(["1", 2, true]);
  });
});
