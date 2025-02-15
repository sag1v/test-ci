import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

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
  viteFinal: (config) => {
    // Remove any existing vite-plugin-dts instances
    config.plugins = config.plugins?.filter(plugin => 
      plugin && !(typeof plugin === 'object' && 
        'name' in plugin && 
        plugin.name === 'vite-plugin-dts')
    ) || [];
    
    // Add vanilla-extract plugin
    config.plugins?.push(vanillaExtractPlugin());
    
    return config;
  },
};

export default config;
