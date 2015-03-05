# react-meetup-data-flow

Repo for the talk "Data flow" at React.js meetup in Paris, March 12th 2015

## Install

```
# after cloning, move into directory and run :
npm install
npm run build
```

Then open `index.html` in your favorite web browser.

## Usage

If you want to hack around, there's a `watch` task that automatically recompiles code one change :
`npm run watch`

Note that this repo is written using JSX and ES6 (ES2015) then transpiled to ES5 with Babel and Browserify.
Feel free to use ES6 or node-style modules since Browserify supports both.

## Branches

Each style of data flow/state management strategy is in its own branch. Below are the branches name and a description of what's inside. To switch, run `git checkout [branch-name]`.

* `base` : Base implementation, classical top-down/bottom-up flow.
* `base-wrapper` : Same than `base` but with a stateful wrapper.
* `events` : Split the components and communicate with events (here Node events)

## License

The MIT License.

See the `LICENSE` file.