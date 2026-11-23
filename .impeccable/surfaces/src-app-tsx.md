---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief: portfolio home (single page)

Scope: the whole one-page portfolio (`src/App.tsx` and its sections). Visitor mode: Experience. The work leads from the first viewport.

Audience and job: hiring managers and recruiters from iGaming/game-frontend studios and React/TS product companies, scanning fast on desktop. They need to see real things built (playable, inspectable) and enough evidence for each project to trust the claims. Action: play the game, open a project, get in touch.

Constraints: the playable Asteroid Blaster modal, live code-drawn thumbnails (no real screenshots), both light and dark editions at WCAG AA, honest copy only (see PRODUCT.md "Evidence on Hand" and the don't-claim notes for the agent-built projects).

## Direction contract

THESIS: The site is a 1990s big-box PC game. The box front carries Asteroid Blaster as live cover art, and every project is a back-of-box panel with a live screenshot, plain feature bullets and a System Requirements table that is its stack. It refuses the category default: the dark dev portfolio with one glowing accent, a hero blurb and a card grid.

OWN-WORLD: Saturated print inks that own whole regions: red #d7261e, yellow #ffc400, blue #2155c4, black #111, paper #f7f4ec, plus oxblood #5a0d0a on the black box. Bowlby One display with a printed offset extrusion; Archivo variable body, with the 87.5% width as back-of-box small print. A fixed red spine (top bar on phones), a die-cut screenshot frame, a sticker burst, pre-release status stickers, and a white printed System Requirements box. No glows, glass or gradients. Two editions: the black box (dark fields) and the white box (paper, yellow, blue and red fields).

STORY: The visitor sees a person who builds real-time canvas work and product apps, can play the game straight away, then turns the box to read what each project is, how it was built (openly agent-directed where true) and what it runs on. Then they get in touch.

FIRST VIEWPORT: The JAMES GARDENER title in heavy box lettering top-left, the role label beneath it plus "Making games on the side.", a yellow rule, then the live Asteroid Blaster cover art filling the rest, with a PLAY NOW sticker on the right that opens the game. A red foot strip lists the box contents and holds the primary yellow "Turn it over" button. The spine on the left carries Work, Experience, Contact and the theme toggle.

FORM: Big-Box PC Game, my #1 grounded candidate (shown as IMPECCABLE'S PICK and chosen by the user over the rolled Signed Route; both were prototyped). seed:7b75754535bf3f33. Signature interaction: the box front is hinged on the spine and swings open on scroll (pinned GSAP rotateY) to reveal the back cover; "Turn it over" glides through it, and an idle hinge-peek hints that it opens. Motion grammar: that one turn, plus the live thumbnails. No section entrances.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- The Sixfold thumbnail is the heaviest canvas on the page; watch its performance on low-end phones.
- The box turn hasn't been checked on real phones (address-bar resize while pinned).
