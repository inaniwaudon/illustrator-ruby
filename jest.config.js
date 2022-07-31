module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
