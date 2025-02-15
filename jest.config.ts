import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.css\\.ts$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy',
  },
};

export default config;
