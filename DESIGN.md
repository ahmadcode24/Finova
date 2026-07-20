---
name: Obsidian Flux
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is defined by a high-tech, immersive aesthetic that prioritizes depth and atmosphere. It leans heavily into a "dark mode by default" philosophy, utilizing deep obsidian blacks and charcoal grays to create a canvas where information feels illuminated rather than just displayed.

The visual style is a fusion of **Minimalism** and **Glassmorphism**, specifically focusing on "inner glows" and subtle light leaks to simulate a premium, hardware-integrated feel. The emotional response is one of calm precision, sophistication, and advanced intelligence—perfect for SaaS, AI interfaces, and fintech platforms that require a focused, distraction-free environment.

## Colors

The palette is strictly monochromatic to maintain a high-tech, premium feel. 

- **Primary (#FFFFFF):** Used for critical information, primary headers, and active icons.
- **Secondary (#1A1A1A):** The main surface color for cards and elevated panels.
- **Tertiary (#262626):** Used for hover states, subtle borders, and secondary UI controls.
- **Neutral (#0D0D0D):** The base background color for the entire application.

The "glow" effect is achieved through high-contrast white gradients with low opacity (10-20%) and extended blurs, creating a sense of bioluminescence against the dark backdrop.

## Typography

This design system utilizes **Geist** for its clean, geometric, and developer-friendly proportions. It provides a technical but readable foundation. **JetBrains Mono** is introduced for labels and metadata to reinforce the high-tech, systematic nature of the interface.

To maintain the immersive feel, body text often uses reduced opacity (60-80%) rather than gray hex codes to ensure it blends naturally with the dark backgrounds. Headlines should be tight and impactful, utilizing negative letter spacing to feel modern and "contained."

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** with generous safe areas to create a "cinematic" feel. Content is grouped into large, rounded containers that float within the neutral base.

- **Desktop:** A 12-column grid with a maximum content width of 1440px. Gutters are kept tight (16px) to maintain the "monolithic" look of the UI components.
- **Mobile:** A 4-column grid with 16px side margins. Large containers reflow into a single-column stack.
- **Rhythm:** An 8px linear scale is used for all internal padding and margins to ensure mathematical consistency.

## Elevation & Depth

Depth is not created with traditional shadows, but through **Tonal Layering** and **Atmospheric Glows**.

- **Level 0 (Background):** Pure #0D0D0D.
- **Level 1 (Panels):** #1A1A1A with a 1px border of #262626.
- **Level 2 (Active/Hover):** #262626 with a subtle top-down inner white glow (opacity 5%).
- **Interactive Focus:** Elements that are active or focused emit a soft, white outer glow (Spread: 20px, Opacity: 10%) to simulate light projection from the screen.

Backdrop blurs (20px - 40px) are used extensively for floating menus and modals to maintain context while ensuring legibility.

## Shapes

The shape language is characterized by **Smooth, High-Radius Corners**. 

Standard components use a `0.5rem` (8px) radius, while primary containers and main interface "pods" use `rounded-xl` (1.5rem / 24px) or higher to create a friendly, organic contrast against the technical typography. Buttons and input fields should follow a consistent `1rem` (16px) radius to feel "soft" to the touch in an otherwise sharp, technical environment.

## Components

### Buttons
- **Primary:** Solid White background with Black text. No shadow, but a slight outer glow on hover.
- **Secondary:** Transparent background with a 1px #262626 border. On hover, the background fills to #1A1A1A.
- **Radius:** 12px or fully pill-shaped depending on context.

### Input Fields
- **Style:** Deep charcoal (#131313) background with a 1px border that brightens to white on focus.
- **Typography:** Uses JetBrains Mono for the input text to emphasize data entry precision.

### Cards & Containers
- Cards use the Level 1 Elevation (#1A1A1A).
- They feature a "Gloss" effect: a subtle linear gradient from top-left (light) to bottom-right (dark) at 5% opacity.

### Navigation / Sidebar
- Navigation items are icon-heavy with Geist labels.
- The active state is indicated by a "pill" background with a soft horizontal glow effect behind the icon.

### Chips
- Small, pill-shaped elements with #262626 backgrounds and white text. Used for tags, status indicators, and filters.