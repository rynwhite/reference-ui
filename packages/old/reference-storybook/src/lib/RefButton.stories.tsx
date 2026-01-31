import type { Meta, StoryObj } from '@storybook/react';
import { RefButton } from '@reference-ui/core/react';

/**
 * The RefButton component is a versatile button with multiple variants and sizes.
 * It's built with Stencil and wrapped for React compatibility.
 */
const meta = {
  title: 'Components/RefButton',
  component: RefButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'The button variant style',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    label: {
      control: 'text',
      description: 'Button label text',
    },
  },
} satisfies Meta<typeof RefButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button - the main call to action
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Primary Button',
    size: 'medium',
    disabled: false,
  },
};

/**
 * Secondary button - for less prominent actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary Button',
    size: 'medium',
    disabled: false,
  },
};

/**
 * Outline button - for subtle actions
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Outline Button',
    size: 'medium',
    disabled: false,
  },
};

/**
 * Small sized button
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    label: 'Small Button',
    size: 'small',
    disabled: false,
  },
};

/**
 * Large sized button
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    label: 'Large Button',
    size: 'large',
    disabled: false,
  },
};

/**
 * Disabled button state
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    label: 'Disabled Button',
    size: 'medium',
    disabled: true,
  },
};
