# Discord-Rich-Presence-For-Cinema-4D
A hacky way of allowing all your discord friends to know what your'e working on in Cinema 4D!

How it works:
>gets process info on c4D and takes windows name, extracts name from it
>hooks into discord api via npms `discord-rich-presence` and uses my custom app assets to show as cinema 4D, puts project name there

How to use:
    
-Download the exe from Releases here:https://github.com/djkato/Discord-Rich-Presence-for-Cinema-4D/releases/tag/v1.0.1

-Create a shortcut, then on the shortcut Rightclick > Properties > `Run: Minimzed` so it doesn't open windowed on each startup

-do `[WINDOWS BUTTON+R]`, then type `shell:StartUp`, and put the exe there so it automatically starts with pc

-run once, then close. It generates a `DRCSettings.json`. Change what porfolio website should be displayed there.

enjoy~
Dj