# WFRP - Tweaks
A small-ish module with optional automation as well as macro support for spells, prayers, and weapons. More to come...

## Links:
* Manifest: https://raw.githubusercontent.com/DasSauerkraut/wfrp-tweaks/master/module.json
* Direct Link: https://github.com/DasSauerkraut/wfrp-tweaks/raw/master/package/wfrp-tweaks-v1.0.0.zip

## Features:
* Chat and Script macro support for spells, prayers, and weapons. Macros can be defined in the Details tab of the item, and they will be executed on successful cast or use of the item. You can define a macro which fires on successful use of the weapon, on a successful attack, and on a successful defense. If you have the Furnace installed, the attack and defense macros have an argument prepopulated. This argument is the opposed roll information, so the IDs of both actors, weapon info, and the like. This arg should be arg[0] and you will have to run JSON.parse() on it to turn it to an object. Check the [wiki](https://github.com/DasSauerkraut/wfrp-tweaks/wiki/Macro-Repository) for examples!
* Career Trapping Status: An optional setting that when enabled grants maluses to your status for each career trapping you lack.

## Planned Features:
* Integrated penalties: A setting that when enabled will apply penalties from armor, injuries, etc to your skills or characteristics.
