# Scaling Tren

How to grow Tren screen by screen without drifting from this system.

## 1. Build every new screen from this system
Start from the tokens and components here. If a screen needs something new, add it here first (a token or a component card), then use it. Never hard-code a colour, size or spacing value in a screen.

## 2. Screen checklist
- Margins `space-6`, cards `radius-xl` on `surface-card`, gaps on the 4-point grid.
- One hero number at most, one black button at most.
- Monochrome (black and white) for training actions; blue for rest and green for done or synced, as small accents.
- Everything you need mid-workout sits within thumb reach in the bottom half.
- Check light and dark mode, and reduced motion.

## 3. Taking it to code (openGym fork)
- Map these tokens onto openGym's existing theme variables rather than rewriting its screens. That keeps monthly upstream merges easy.
- Rebuild only the new pieces as components: StartBar (morph), TabBar (gooey lens), EffortSlider, the glossy buttons.
- Optional libraries: `liquid-gooey` (MIT) for richer goo, `metal-fx` (MIT, WebGL) for the live bar ring only.
- Keep the class prefix `tr-` and these token names, so design and code stay in sync.

## 4. Remaining v0.1 screens
Sign-up and passkey, workout summary, Routines, Exercise picker, History, Settings (export and delete account), the public Privacy page and the Admin dashboard. Suggested order: summary and History first, then the account and trust screens.
