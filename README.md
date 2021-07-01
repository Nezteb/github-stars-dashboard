# GitHub Stars Dashboard

https://user-images.githubusercontent.com/3588798/124159675-083f9680-da61-11eb-85aa-b5b72975f11a.mp4

_This repo is a mess, but it works!_

# About

Built with TypeScript (with liberal usage of `any`, which I will eventually fix), React, [Vite](https://vitejs.dev/), and [React Table](https://react-table.tanstack.com/).

# Build

`make` will build and then run the app locally. `make build` does just the build.

The `scripts` directory has the Node script that can be used to get your GitHub stars from their API. Export a `GITHUB_TOKEN` variable with a GitHub token that can read your user profile, and then run `make json` in the root to generate your own `scripts/stars.json`, which the React app will use to generate a searchable/filterable table.

To deploy to your own GitHub pages site, follow the instructions from the previous paragraph and then run `yarn deploy` which will use the [gh-pages](https://github.com/tschaub/gh-pages) tool to do the deploy.

# Other

The styling isn't great, I'll try to fix that eventually. PRs are welcome! I also quickly hacked this together so most of it is in single files that use `any` way too much, which I will also fix eventually.
