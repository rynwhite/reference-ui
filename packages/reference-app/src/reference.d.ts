declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ref-button': {
        label?: string;
        variant?: string;
        size?: string;
        disabled?: boolean;
      };
    }
  }
}
