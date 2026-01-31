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
      padding: '3px'
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
  
    return css({
      padding: '16px',
      backgroundColor: 'primary.500',
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
