# polygon-redesign
This project is a landing page made with DuckDuckGo's layout and Polygon's branding elements.

## Design
To turn DuckDuckGo into a Polygon product, I wanted to keep the layout as close as possible to the original's while incorporating Polygon's content and feel: Its typography, colors, polygons, and overall safe, friendly, community-oriented nature. Where possible, I made direct subsitutions: For example, the three DuckDuckGo cards are replaced by the three cards from the Polygon site. While the overall flow is the same – drawing the user's eye in a straight line down the page, with each step urging any remaining viewers to click 'get started' – the page is made instantly more friendly by Polygon's flat, dichromatic, character-driven design.

## Development
For development, I focused on modularity and clean code. 

### Modularity
I edited Vuetify's global variables for text and color variables to make scaling the site easier. I also separated out more logic-/data-heavy code into their own files in the components folder.

### Responsiveness
Minor tweaks are made to accomodate for small breakpoints. For example, the polygon in the 'services' section disappears, the nav menu comes in from the bottom, the service cards are aligned in a column, and the intro-section h1 becomes slightly smaller.

### Accessibility
The whole site is keyboard- and screen-reader friendly. Other than the buttons which were already accessible, the nav menu's aria-label and tabindex properties are set to accomodate screenreaders and keyboards.

### Performance
While there isn't really much to load, and the SVGs are already lightweight, the pictures support lazy-loading to improve performance. I added this after realizing I sometimes *did* see the SVGs take a fraction of a second to load. This surprised me, and the effect was more dramatic with devtools' mobile-view and throttling on.

This project was bootstrapped with Create Vue.


## Timeframe
*Day 0*: Looked over Docker documentation at a high-level. Journaled notes about Polygon's philosophy.  

*Day 1*: Prototyped on Adobe xd (https://xd.adobe.com/view/ab4b5fe3-6689-4bc5-a25d-d6c95ac939ee-fe18). Looked over documentation on Vue essentials + modular components; started to look over Vuetify documentation.

*Day 2*: Continued with Vuetify documentation. Made basic structuring of the web page.


*Day 3*: Finished styling and optimizing. Modularized components. Lighthouse audits. Added Dockerfile.
