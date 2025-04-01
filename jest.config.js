/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['built/'],
  moduleNameMapper: {
    '^axios$': 'axios/dist/node/axios.cjs',
  },
}
