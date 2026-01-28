import type { Preview } from '@storybook/react';

// One import: core styles (Panda CSS) for Light DOM components
import '@reference-ui/core/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
