# Johnsidian Better Vim 

I was frustrated for a long time that Obsidian’s vim mode doesn’t yank to the system clipboard.

I recently learnt that the [obsidian vimrc plugin](https://github.com/esm7/obsidian-vimrc-support) actually supports this.
But I didn’t need any of it’s other features, and am hesitant to pull in big plugins for a single feature. Nonetheless, knowing that it was possible to achieve this with a plugin was a huge help!

So this plugin just exists to make vim mode in Obsidian use the system clipboard. Maybe one day it will have a second feature.

## Caveats
- I implemented this by overwriting the default commands in code mirror’s vim to always use the “+” register. This is fine for me since I don’t use other registers in Obsidian. Maybe it will not be okay for you though.
- I’ve not tested this in windows
- I’ve only tested this with my own setup

