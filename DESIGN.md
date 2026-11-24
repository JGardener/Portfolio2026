---
name: James Gardener — Big Box
description: A one-page portfolio printed as a 1990s big-box PC game, in a black-box and a white-box edition.
colors:
  red: "#d7261e"
  red-deep: "#8f130e"
  yellow: "#ffc400"
  blue: "#2155c4"
  black: "#111111"
  white: "#f7f4ec"
  screen: "#0b0b0c"
  oxblood: "#5a0d0a"
  print-white: "#ffffff"
  ink-2-black-box: "#c9c5ba"
  ink-2-white-box: "#45423b"
  rule-black-box: "#3a3833"
  rule-white-box: "#cfcabd"
  sysreq-plate-black-box: "#1b1a17"
  sysreq-ink-black-box: "#f1ede3"
  sysreq-rule-black-box: "#45423b"
  sysreq-rule-white-box: "#b9b4a8"
  yellow-hover: "#ffd23d"
  hint-ink-on-yellow: "#4a3a00"
typography:
  display:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(2.6rem, 10.5vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(2rem, 13cqi, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
  title:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.15
  lead:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.1vw + 0.8rem, 1.375rem)"
    fontWeight: 650
    lineHeight: 1.35
  body:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  label:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 87.5"
  section-title:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.95
  section-title-back:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 0.95
  section-title-contents:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.875rem, 2.8vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1
  section-title-publisher:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1
  publisher-email:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 3.4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.1
  contents-name:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.25rem, 1.6vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.1
  sticker-big:
    fontFamily: "'Bowlby One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.35rem, 1.9vw, 1.85rem)"
    fontWeight: 400
    lineHeight: 0.95
  company:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 800
    lineHeight: 1.3
  body-sm:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
  small-tight:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
  micro:
    fontFamily: "'Archivo Variable', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 87.5"
rounded:
  none: "0px"
  die: "14px"
  round: "50%"
spacing:
  gutter: "clamp(20px, 5vw, 80px)"
  block: "clamp(64px, 9vw, 136px)"
  spine: "88px"
  spine-bar: "56px"
  rule: "3px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.7em 1.15em"
    height: "48px"
  button-primary-red-panel:
    backgroundColor: "{colors.black}"
    textColor: "{colors.print-white}"
  button-primary-white-box-paper:
    backgroundColor: "{colors.red}"
    textColor: "{colors.print-white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "currentColor"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.7em 1.15em"
    height: "48px"
  button-turn:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.55em 0.75em 0.55em 1.2em"
    height: "52px"
  sticker-play:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.red}"
    rounded: "{rounded.none}"
    size: "clamp(9.5rem, 15vw, 13.5rem)"
  status-sticker:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.35em 0.8em"
  screenshot-frame:
    backgroundColor: "{colors.screen}"
    rounded: "{rounded.die}"
  sysreq-plate-black-box:
    backgroundColor: "{colors.sysreq-plate-black-box}"
    textColor: "{colors.sysreq-ink-black-box}"
    rounded: "{rounded.none}"
  sysreq-plate-white-box:
    backgroundColor: "{colors.print-white}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
  spine:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    width: "{spacing.spine}"
  spine-phone:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    height: "{spacing.spine-bar}"
---

# Design System: James Gardener — Big Box

## Overview

**Creative North Star: "The Big Box on the Shelf"**

The site is a printed 1990s PC game box, not a web page dressed as one. Saturated print inks own whole regions edge to edge; nothing floats on a neutral canvas. You hold it by a red spine, you see a box front with live cover art and a sale sticker, you turn it over, and every project is a back-of-box panel: a framed screenshot, plain diamond-bulleted features, and a System Requirements box that is the project's stack. A yellow publisher strip with a barcode closes the box.

The system ships in two editions that share one set of fixed inks. The **black box** (dark theme, the default) keeps its fields dark: black, blue, oxblood, red. The **white box** (light theme) prints on paper, yellow, blue and red. The theme never changes an ink; it changes which ink each slot prints with. Density is loud and confident at the display level and plain, readable small print underneath: heavy box lettering with a printed extrusion over honest, factual copy.

The world explicitly replaced a near-black, single-glowing-accent dev portfolio (Syne and Inter, card grid, hero blurb). Everything that made that look (glow, glass, gradient, eyebrow labels, section numbers, loaders, marquees, count-ups, custom cursors) is off the table.

**Key Characteristics:**
- Fixed print inks; editions re-ink slots, never the inks themselves.
- Bowlby One box lettering with a stepped, hard offset extrusion; Archivo condensed to 87.5% as the small-print voice.
- Square printed edges and thick 3px black rules; the only rounded corner is the die-cut screenshot.
- One authored motion moment (the box turn) plus live PixiJS thumbnails; no section entrances.
- WCAG AA in both editions, checked per tone slot.

## Colors

A flat, saturated four-ink print set (red, yellow, blue, black) on warm paper, with oxblood as the black box's fourth field.

### Primary
- **Box Red** (#d7261e): the spine, the box-front foot strip, the game modal bar, the System Requirements header, the fourth panel field, and the white box's title fill. The colour you hold the box by.
- **Deep Red** (#8f130e): hover ink for links printed on yellow (contents list, publisher email). Never a field.

### Secondary
- **Sticker Yellow** (#ffc400): the back cover, the publisher strip, primary buttons on dark fields, the PLAY NOW burst, status stickers, the cover-art top rule, text selection, and the black box's title fill.

### Tertiary
- **Print Blue** (#2155c4): a full panel field (slot 2 on the black box, slot 3 on the white box), always with white ink and a black frame.
- **Oxblood** (#5a0d0a): the black box's third panel field only; keeps the dark edition dark without repeating black.

### Neutral
- **Box Black** (#111111): the black box's paper, every structural rule and border, the fold line on the spine, and the extrusion ink on light fields.
- **Paper** (#f7f4ec): the white box's paper and the black box's main ink. Warm, never pure white.
- **Yellow Hover** (#ffd23d): the "Turn it over" button's hover fill. A lift of Sticker Yellow, never a field.
- **Hint Ink** (#4a3a00): the "or scroll" hint on the yellow turn button; a dark yellow-brown that reads as secondary print on yellow at AA.
- **Print White** (#ffffff): ink on blue, oxblood and red fields, the white box's System Requirements plate, the barcode label.
- **Screen** (#0b0b0c): behind every live screenshot and the cover art.
- **Secondary ink** (#c9c5ba on the black box, #45423b on the white box): taglines' supporting text, credit periods and tools, the dotted credit leaders.
- **Rule** (#3a3833 / #cfcabd): hairline dividers in each edition.
- **System Requirements plate** (#1b1a17 plate, #f1ede3 ink, #45423b row rules on the black box; #b9b4a8 row rules on the white box).

### Named Rules

**The Fixed Ink Rule.** The eight print inks never change with the theme. An edition only reassigns which ink a slot prints with, through `--paper`, `--ink`, `--title-fill`, `--title-extrude`, `--sysreq-*` and the panel tone tokens.

**The Tone Slot Rule.** Project panels cycle four slots in page order. Black box: black, blue, oxblood, red. White box: paper, yellow, blue, red. Everything inside a panel (background, ink, secondary ink, title fill, mark, frame, extrusion, primary button, status sticker, System Requirements header) is driven by that slot's `--tone-*`, `--btn-*`, `--status-*` and `--tone-extrude` tokens, never by a hard-coded colour. A new slot or a changed slot is re-checked for WCAG AA.

**The Large-Yellow Rule.** Yellow on red or on blue (about 3.8:1 and 4.3:1) is for large display text only: titles, the spine mark, the sticker. Body text, labels and buttons on red or blue print in white or black.

## Typography

**Display Font:** Bowlby One (with Arial Black)
**Body Font:** Archivo Variable (with system-ui)
**Label Font:** Archivo Variable at 87.5% width, bold, uppercase

**Character:** Bowlby One is the shouting box lettering, always uppercase, always heavy, usually extruded. Archivo is the plain voice of the back of the box; squeezed to 87.5% width and set in caps it becomes the legal small print, labels and buttons.

### Hierarchy
- **Display** (400, clamp(2.6rem, 10.5vw, 6rem), 0.92): the box-front name only, uppercase, six-step extrusion.
- **Headline** (400, clamp(2rem, 13cqi, 5.5rem), 0.95): project titles, sized by a container query to their own column so the longest word never runs into the screenshot. Section titles (back cover, Credits, publisher) use the same face at 1.75 to 4rem.
- **Title** (400, clamp(1.25rem, 2vw, 1.75rem), 1.15): credit roles, contents entries, the System Requirements and "How it was built" heads at about 0.9375rem.
- **Lead** (650, clamp(1.125rem, 1.1vw + 0.8rem, 1.375rem), 1.35): project taglines (max 34ch) and the back-cover copy at weight 400 (max 54ch).
- **Body** (400, 1.0625rem, 1.55): features and descriptions, 56 to 66ch, tabular numerals.
- **Section titles** (Bowlby One 400): Credits clamp(2.25rem, 5vw, 4rem); back cover clamp(2rem, 4.2vw, 3.75rem); contents clamp(1.875rem, 2.8vw, 2.5rem); publisher clamp(1.75rem, 3vw, 2.5rem). Contents entries clamp(1.25rem, 1.6vw, 1.625rem); the sticker's big line clamp(1.35rem, 1.9vw, 1.85rem).
- **Publisher email** (Archivo 800, clamp(1.25rem, 3.4vw, 2.75rem)): the one large Archivo line, so the address reads as type, not a link list.
- **Small steps** (Archivo): 1.1875rem for credit companies, 1rem for the box-front inside list, 0.9375rem for small print (contents lines, System Requirements values, credit tools, buttons, spine links), 0.875rem for status stickers, 0.75rem for micro labels (System Requirements keys, the sticker's small line).
- **Label** (700 to 800, 0.75 to 0.9375rem, 0.04 to 0.1em tracking, uppercase, 87.5% width): buttons, spine links, credit periods, System Requirements keys, the front sub-band, the publisher small print.

### Named Rules

**The Printed Extrusion Rule.** Box titles carry a stepped hard offset in the edition's extrusion ink: 6 steps of 1px on the cover, 4 on panel and Credits titles, 3 on the publisher title. The extrusion is native to this world; it is the box-art title treatment, not a decorative shadow, and it belongs to Bowlby One display text only.

**The Small Print Rule.** The 87.5% width is the small-print voice. Use it for labels, buttons and legal text, never for running paragraphs.

## Layout

A single column of full-bleed ink fields stacked like the faces of a box. A fixed red spine (88px) runs down the left and pads the body; under 768px it becomes a 56px top bar and pads the top instead, with anchor scroll-margin matched to it. Content sits in 1320px containers (1080px for Credits) with a fluid gutter (clamp(20px, 5vw, 80px)) and a fluid vertical block (clamp(64px, 9vw, 136px)).

The box front is a full viewport (min 36rem; 34rem on phones) in three rows: title band, cover art, red foot strip. The back cover is a two-column grid (copy left, contents right) that stacks below 960px. Project panels are a two-column grid of head, screenshot, features, System Requirements and links; alternate panels mirror the columns, and all stack below 960px. Credits collapse their dotted-leader line below 640px; the publisher strip stacks below 640px.

Fields are separated by a 3px black rule at the top of each, never by gaps or cards.

## Elevation & Depth

Flat print. Depth comes from ink fields, thick black rules, and the printed title extrusion. One soft drop exists for things that physically sit on the print: stickers and the screenshot frame. The spine meets the box at a 3px inset black fold.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 10px 24px -8px rgb(0 0 0 / 0.45)`): the screenshot frame and the status sticker.
- **Sticker drop** (`filter: drop-shadow(0 8px 14px rgb(0 0 0 / 0.5))`): the PLAY NOW burst.
- **Turn button press** (`0 6px 14px -6px rgb(0 0 0 / 0.55)`, deepening on hover, shrinking on press): the one chunky physical button.
- **Spine fold** (`box-shadow: inset -3px 0 0 #111`, inset bottom on phones): keeps the red spine distinct from red panels.

### Named Rules

**The Sits-On-The-Print Rule.** A soft drop shadow is allowed only on an object stuck onto the box (sticker, screenshot, the turn button). Fields, panels and plates are flat.

## Shapes

Square, printed edges everywhere: buttons, plates, stickers, bars, the modal. Borders are 3px solid black (or the panel's frame ink); the publisher small print rule is 2px; row dividers in System Requirements are 1px. The single rounded form is the **die-cut** screenshot corner (14px) with a 5px frame. Circles appear only for the theme toggle and the turn button's arrow disc. Feature bullets are 0.62em squares rotated 45 degrees into diamonds in the panel's mark ink. The PLAY NOW sticker is an 18-point starburst (outer radius 50, inner 41) tilted −10 degrees; status stickers tilt −4 degrees.

## Components

### Buttons
Chunky, printed, uppercase small print.
- **Shape:** square (0px), 3px border in currentColor, min height 48px.
- **Primary:** the panel's `--btn-bg` / `--btn-fg` (yellow on black by default; black with white on red; red with white on the white box's paper; black with yellow on the white box's yellow).
- **Outline:** transparent, ink and border in the field's ink.
- **Hover / Focus:** lifts 2px over 150ms ease-out; focus is a 3px currentColor outline offset 3px.
- **Turn it over:** a yellow, black-bordered 52px button with a Bowlby label, an "or scroll" print hint, and a black disc arrow that nudges downward (1.8s loop, motion permitting). It is the one call to act on the box front.

### Navigation (the spine)
Red, fixed, the edge you hold and the hinge the front turns on. Yellow Bowlby "JG" mark at the top, vertical uppercase print links (rotated 180 degrees) that turn yellow on hover, and a 48px circular theme toggle at the bottom labelled by edition ("Switch to the white box"). Under 768px it runs across the top as a 56px bar with horizontal links and a borderless 44px toggle.

### Box front and the turn (signature)
The name band, a yellow 8px rule, the live PixiJS cover art on screen black, and a red foot strip holding the "Inside" contents line and the turn button. The front is hinged on its left edge: a pinned, scrubbed GSAP rotateY (0 to 100 degrees over 90% of a viewport) swings it open while a black shade deepens on it and the back cover scales from 0.95 to 1. Idle at the top for 2.2s, the front peeks on its hinge twice (11 degrees). Under reduced motion there is no pin; front and back simply stack.

### PLAY NOW sticker
A yellow starburst with a black stroke, red Bowlby "PLAY NOW" and black print sub-line, tilted −10 degrees. Hover straightens it to −4 degrees and scales it 1.05; it opens the game modal.

### Back-of-box panel
- **Status sticker:** display-face label in the slot's status inks, tilted −4 degrees, overlapping the screenshot's top-left corner with a lift shadow.
- **Screenshot:** a 5:3 die-cut frame (14px, 5px border in the slot's frame ink) holding a live PixiJS thumbnail.
- **Features:** diamond bullets in the slot's mark ink.
- **How it was built:** a developer's note under a 3px rule in the mark ink, in secondary ink with a small Bowlby head.
- **System Requirements:** a square plate with a 3px border, a header strip in the slot's System Requirements ink, and label/value rows. On the black box it is a dark plate (#1b1a17) framed in the slot's frame ink; on the white box it is a white plate framed in black.

### Credits
Bowlby role, a 3px dotted leader in secondary ink, bold company, print-voice period; tools line below. Leaders drop out under 640px.

### Publisher strip
Yellow field closing the box: a white barcode label with a 3px black border, an extruded Bowlby title, a large bold email link (hover deep red), outline buttons, and a 2px-ruled small-print line.

### Game modal
Near-opaque black backdrop, a black panel with a 4px yellow border, a red title bar with the white close control; focus returns to the opener.

## Do's and Don'ts

### Do:
- **Do** print whole regions in one ink and separate them with a 3px black rule.
- **Do** drive every colour inside a project panel from its tone slot tokens, and re-check WCAG AA in both editions when touching a slot.
- **Do** keep yellow on red or blue to large display text; body, labels and buttons there print in white or black.
- **Do** give Bowlby One titles the printed extrusion in the edition's extrusion ink.
- **Do** keep motion to the box turn and the live thumbnails, and give every effect a reduced-motion path (no pin, still thumbnails, collapsed transitions).
- **Do** keep thumbnails as live code-drawn PixiJS "screenshots" in the die-cut frame.

### Don't:
- **Don't** use glows, glassmorphism or gradients (including gradient text).
- **Don't** add eyebrow labels above headings or section numbers.
- **Don't** add loaders, marquees, count-up stats or custom cursors.
- **Don't** add per-section entrance animations.
- **Don't** round anything but the die-cut screenshot and the two circular controls.
- **Don't** change a print ink per edition; re-ink a slot instead.
