# LogiTrack UI Design System & Style Guide

This document defines the design tokens, layout patterns, and component specifications of the **LogiTrack** web application, compiled specifically to serve as the design specification for building the mobile and tablet versions of the app.

---

## 1. Design Philosophy

LogiTrack is built around a **tactical, command-center aesthetic**. It is dark-mode-first, high-contrast, clean, and highly readable. It avoids rounded circular bubbles in favor of a modern, slightly-rounded grid structure that feels precise, industrial, and premium.

- **Primary Motif**: Tactical dark theme.
- **Accents**: High-Vis fluorescent tones (Neon Green & Yellow) for crucial metrics, active trackers, and primary actions.
- **Borders**: Subtle, low-contrast separator borders (`0.5rem` / `8px` radius).
- **Plate Numbers**: Rendered in uppercase Monospace to evoke logistics-industrial numbering.

---

## 2. Typography

- **Primary Font**: Clean, modern sans-serif (e.g., `Inter`, `Outfit`, or system default `sans-serif`).
- **Tactical/Plate Font**: Monospace (`SFMono-Regular`, `Consolas`, or `Courier New`) for vehicle registration plates, coordinates, and timestamp values.

### Type Scale Hierarchy

- **Header Title**: `20px` / `1.25rem` — Bold (Welcome bars, page header titles)
- **Section Headers**: `14px` / `0.875rem` — Extra Bold (Card titles, widget sections)
- **Body / Primary text**: `12px` / `0.75rem` — Medium (Table values, form input labels)
- **Subtext / Captions**: `10px` to `11px` — Bold / Semibold (Aria labels, input helpers, secondary metadata)

---

## 3. Color Tokens (HSL / OKLCH Mappings)

All colors are designed for high readability against the deep charcoal background:

| Token Name              | Hex Code  | OKLCH / CSS Equivalent | Purpose / Application                                     |
| :---------------------- | :-------- | :--------------------- | :-------------------------------------------------------- |
| **Background**          | `#18181B` | `oklch(0.18 0.01 290)` | Canvas background for all views.                          |
| **Surface (Card)**      | `#27272A` | `oklch(0.23 0.01 290)` | Elevated cards, tables, panels, and sidebars.             |
| **Primary (Highlight)** | `#CCFF00` | `oklch(0.93 0.25 115)` | Active state indicator, Primary CTAs, active route paths. |
| **Accent (Highlight)**  | `#EAB308` | `oklch(0.85 0.2 90)`   | Warnings, delayed statuses, secondary highlights.         |
| **Muted Text**          | `#71717A` | `oklch(0.7 0.02 290)`  | Descriptions, label titles, secondary information.        |
| **Border / Divider**    | `#3F3F46` | `oklch(0.28 0.01 290)` | Subtle dividing lines between sections.                   |
| **Destructive**         | `#EF4444` | `oklch(0.55 0.2 25)`   | Low fuel warnings, error buttons, alerts.                 |

---

## 4. Layout & Spacing System

- **Corner Radius**: Fixed at `0.5rem` / `8px` (used for cards, buttons, status badges, and input elements).
- **Outer Padding**:
  - Mobile: `16px` (`p-4`)
  - Tablet: `24px` (`p-6`)
  - Desktop: `32px` (`p-8`)
- **Gaps between widgets**: `24px` (`gap-6`).

---

## 5. UI Components & States

### 5.1 Buttons

1. **Primary Button**:
   - Background: `#CCFF00` (Neon Green)
   - Text Color: `#18181B` (Deep Charcoal) — Extra Bold
   - Hover / Active: Scale slightly down or subtle brightness shift.
2. **Secondary Button**:
   - Background: Transparent with `#3F3F46` border, or solid `#27272A` surface.
   - Text Color: `#FAFAFA` (White/Light gray).

### 5.2 Status Badges

Used to represent fleet and vehicle availability states:

- **Active / On Route**:
  - Text: `#60A5FA` (Light Blue)
  - Background: Light Blue with 10% opacity (`#3B82F61A`)
- **Idle**:
  - Text: `#A1A1AA` (Medium Gray)
  - Background: Medium Gray with 10% opacity (`#71717A1A`)
- **Delayed**:
  - Text: `#F87171` (Light Red)
  - Background: Light Red with 10% opacity (`#EF44441A`)
- **Maintenance**:
  - Text: `#FBBF24` (Amber/Yellow)
  - Background: Amber with 10% opacity (`#F59E0B1A`)

### 5.3 Input Fields

- Background: `#18181B` (Deep Charcoal)
- Border: `#3F3F46` (Muted border)
- Text Color: `#FAFAFA`
- Focus State: Border color becomes `#CCFF00` (Neon Green) with a subtle outer glow.

---

## 6. Mobile & Tablet Optimization Guidelines

To match the web app's responsiveness, the mobile client should adopt the following behaviors:

1. **Navigation (Side Drawer)**:
   - On mobile/tablet, the sidebar is a sliding overlay that translates from the left screen edge.
   - Underneath the sliding drawer, a semi-transparent black overlay (`bg-black/60` with soft blur) dims the rest of the screen.
   - Tapping anywhere outside the drawer closes the menu.
2. **Layout Adaptation**:
   - Grid cards (e.g. Dashboard Stats) stack vertically on mobile (1-column), break into 2-columns on tablets, and expand to 4-columns on widescreen monitors.
   - Form modals and detail views slide in from the bottom of the viewport on mobile screens to preserve thumbs-reach ergonomics.
3. **Scroll Strategy**:
   - Avoid fixed, full-height panels on mobile. Allow content wrappers to scroll naturally downward (`h-auto` containers).
   - Maps should maintain a minimum height of `350px` to `400px` to allow gesture interactions without restricting layout scrollability.
