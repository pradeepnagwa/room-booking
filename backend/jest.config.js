module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.js"] 
};
