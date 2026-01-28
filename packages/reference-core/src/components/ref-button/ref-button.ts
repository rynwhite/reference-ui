import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { css } from '@reference-ui/system/css';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Props interface for RefButton component
 */
export interface RefButtonProps {
  /**
   * The button variant style
   */
  variant?: ButtonVariant;

  /**
   * The button size
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Button label text
   */
  label: string;
}

@customElement('ref-button')
export class RefButton extends LitElement implements RefButtonProps {
  /**
   * The button variant style
   */
  @property({ type: String }) declare variant: ButtonVariant;

  /**
   * The button size
   */
  @property({ type: String }) declare size: ButtonSize;

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean }) declare disabled: boolean;

  /**
   * Button label text
   */
  @property({ type: String }) declare label: string;

  /** Use Light DOM instead of Shadow DOM */
  override createRenderRoot() {
    return this;
  }

  private getButtonStyles() {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'medium',
      borderRadius: 'md',
      transition: 'all',
      cursor: 'pointer',
      border: 'none',
      fontFamily: 'system-ui',
    };

    const sizeStyles = {
      small: { paddingLeft: 3, paddingRight: 3, paddingTop: 1.5, paddingBottom: 1.5, fontSize: 'sm' },
      medium: { paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2, fontSize: 'md' },
      large: { paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3, fontSize: 'lg' },
    };

    const variantStyles = {
      primary: {
        backgroundColor: 'primary.500',
        color: 'white',
        _hover: { backgroundColor: 'primary.600' },
      },
      secondary: {
        backgroundColor: 'gray.200',
        color: 'gray.800',
        _hover: { backgroundColor: 'gray.300' },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'gray.300',
        backgroundColor: 'transparent',
        _hover: { backgroundColor: 'gray.50' },
      },
    };

    const variant = this.variant ?? 'primary';
    const size = this.size ?? 'medium';
    return css({
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    });
  }

  override render() {
    const disabled = this.disabled ?? false;
    return html`
      <button class=${this.getButtonStyles()} ?disabled=${disabled} type="button">
        ${this.label ?? ''} hi 4
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ref-button': RefButton;
  }
}
