const { formatData, insertData } = require("../db/utils/data-manipulation");
const testData = require("../db/data/test-data/index.js");

const { articleData, commentData, topicData, userData } = testData;

describe("#formatData", () => {
  test("should change the data given, into an obejct of arrays", () => {
    const output = formatData(testData);
    const expectedOutput = {
      topicValues: expect.any(Array),
      userValues: expect.any(Array),
      articleValues: expect.any(Array),
      commentValues: expect.any(Array),
    };

    expect(output).toMatchObject(expectedOutput);
  });
  test("each array of data should contain the same amount of entrys in the array passed to it", () => {
    const output = formatData(testData);
    expect(output.articleValues.length).toBe(articleData.length);
  });
  test("ensure that the original data is not mutated", () => {
    const copyTest = { ...testData };
    formatData(testData);

    expect(copyTest).toEqual(testData);
    expect(testData).not.toBe(copyTest);
  });
});
