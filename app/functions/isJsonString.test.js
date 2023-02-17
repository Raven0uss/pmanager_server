const isJsonString = require("./isJsonString");

describe("isJsonString function", () => {
  test("String which is not a Json", () => {
    const input = "lol";
    const expected = false;

    const result = isJsonString(input);
    expect(result).toBe(expected);
  });

  test("Input is null", () => {
    const input = null;
    const expected = false;

    const result = isJsonString(input);
    expect(result).toBe(expected);
  });

  test("Input is empty string", () => {
    const input = "";
    const expected = false;

    const result = isJsonString(input);
    expect(result).toBe(expected);
  });

  test("String which is a Json", () => {
    const input = '{"test":42}';
    const expected = true;

    const result = isJsonString(input);
    expect(result).toBe(expected);
  });
});
