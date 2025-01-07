![Mod Banner](https://raw.githubusercontent.com/udu3324/mp3mark/refs/heads/main/src/lib/assets/banner_long.png)

![License](https://img.shields.io/github/license/udu3324/mp3mark)
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)
![SvelteKit](https://img.shields.io/badge/SvelteKit-%23f1413d.svg?logo=svelte&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)

# mp3mark
A web app that allows you to analyze and annotate music easily for mp3 files. Use it [here](https://mp3mark.vercel.app/)!

Currently, this website is best fit for desktop users. The appearance may vary on certain browsers but works best on chromium based ones. (developed on chrome) Mobile support is okay, but trackpad users have great control over the timeline.

## What it Looks Like
| ![showcase](https://raw.githubusercontent.com/udu3324/mp3mark/refs/heads/main/src/lib/assets/showcase.png) | 
|:----------------------------------------------------------------------------------------------------------:| 
|                             Screenshot of mp3mark's editor while creating an annotation                    |

| ![importing](https://raw.githubusercontent.com/udu3324/mp3mark/refs/heads/main/src/lib/assets/import_options.png) | 
|:-----------------------------------------------------------------------------------------------------------------:| 
|                                 Screenshot of the import menu                                                     |

## Documentation
Documentation for mp3mark can be found [here](https://mp3mark.vercel.app/docs).

## Developing
To run a development server:
```bash
# make sure to install dependencies
npm install

# startup dev server
npm run dev

# or start the server and open the app in a new browser tab 
npm run dev -- --open

# run with optimized dependencies
pnpm dev --open
```

## Building
To create a production version of your app:
```bash
npm run build

npm run preview
```

## Todo List
 - [X] Volume Control
 - [ ] Metronome
 - [X] Better Marking (set size)
 - [x] Projects Manager/Loader
 - [ ] Community Marks (copyright issues)
 - [X] Track Deletion
 - [X] Top Toolbar Menu
 - [X] Flags (small marks)
 - [X] Logo
 - [X] Front Page
 - [X] demo project
 - [ ] tutorial
 - [X] big line that marks the time
 - [X] favicon and seo
 - [X] documentation
 - [ ] ffmpeg trimming
 - [X] exporting/importing
 - [ ] fix mouse/touch slamming
 - [ ] dark mode
 - [ ] localization (i18n)
 - [ ] lighthouse/seo checks
 - [X] firefox css fixes
 - [ ] snap playhead to scroll
 - [ ] playback snapping to beat

## Credits
The audio used for the demo project is "Fastfall - Cider Time" by Lifeformed. Check their album out [here](https://lifeformed.bandcamp.com/album/fastfall)! It is under *CC BY-NC-SA 3.0* and to be used without profit.