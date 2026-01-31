import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { css } from '@reference-ui/core/styled-system/css'

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline'

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * Props interface for RefButton component
 */
export interface RefButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  label: string
}

@customElement('ref-button')
export class RefButton extends LitElement implements RefButtonProps {
  @property({ type: String }) declare variant: ButtonVariant
  @property({ type: String }) declare size: ButtonSize
  @property({ type: Boolean }) declare disabled: boolean
  @property({ type: String }) declare label: string

  override createRenderRoot() {
    return this
  }

  private getButtonStyles() {
    return css({
      padding: '16px',
      backgroundColor: 'primary.500',
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    })
  }

  override render() {
    const disabled = this.disabled ?? false
    return html`
      <button class=${this.getButtonStyles()} ?disabled=${disabled} type="button">
        ${this.label ?? ''}
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ref-button': RefButton
  }
}
