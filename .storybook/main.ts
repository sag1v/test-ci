import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    // Remove any existing vite-plugin-dts instances
    // https://github.com/qmhc/vite-plugin-dts/issues/275
    config.plugins = await withoutVitePlugins(config.plugins, ['vite:dts']);

    return config;
  },
};

export default config;
