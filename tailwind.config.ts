import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};
export default config;
