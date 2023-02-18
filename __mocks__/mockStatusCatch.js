const mockStatusCatch = (statusCode) => {
  void statusCode;
  return { json: (value) => value };
};

module.exports = mockStatusCatch;
