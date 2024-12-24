# mp3mark
A web app that allows you to analyze and annotate music easily for mp3 files. Use it [here](https://mp3mark.vercel.app/)!

Currently, this website is best fit for desktop users. The appearance may vary on certain browsers but works best on chromium based ones. (developed on chrome)

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
 - [ ] Volume Control
 - [ ] Metronome
 - [X] Better Marking (set size)
 - [x] Projects Manager/Loader
 - [ ] Community Marks (copyright issues)
 - [ ] Track Deletion
 - [X] Top Toolbar Menu
 - [X] Flags (small marks)
 - [X] Logo
 - [X] Front Page
 - [ ] demo project
 - [ ] tutorial
 - [ ] big line that marks the time
 - [X] favicon and seo
 - [ ] documentation