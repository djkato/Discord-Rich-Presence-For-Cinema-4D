# Discord-Rich-Presence-For-Cinema-4D
A hacky way of allowing all your discord friends to know what your'e working on in Cinema 4D!

How it works:
>gets process info on c4D and takes windows name, extracts name from it
>hooks into discord api via npms `discord-rich-presence` and uses my custom app assets to show as cinema 4D, puts project name there

How to use:
    
-Download the release zip from Releases here:https://github.com/djkato/Discord-Rich-Presence-for-Cinema-4D/releases/tag/v1.0.2

-run the EXE file once, then close. It generates a `DRCSettings.json`. Change what porfolio website should be displayed there.

-create a shortcut for `RunInvisibly.vbs` script.

-do `[WINDOWS BUTTON+R]`, then type `shell:StartUp`, take the shortcut and put it there there so it automatically starts with pc

ps: If you want to close the app from running in background, open task manager, go to `details` tab, find `node.exe` process(should be using around 20mb of RAM), and end task. 

enjoy~

Love, Dj