const mockStatusCatch = jest.fn((statusCode) => {
  void statusCode;
  return { json: (value) => value };
});

module.exports = mockStatusCatch;
