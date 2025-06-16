exports.handler = async () => {
  // This example just returns a fixed number, e.g., 123
  return {
    statusCode: 200,
    body: JSON.stringify({ count: 123 }),
  };
};
