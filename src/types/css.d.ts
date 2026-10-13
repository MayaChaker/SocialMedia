import "react";

// Allow CSS custom properties in inline styles, e.g. style={{ "--swatch": "#b96c78" }}.
declare module "react" {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
