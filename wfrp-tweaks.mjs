/**
 * This is your JavaScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: DasSauerkraut
 * Software License: MIT
 */

// Import JavaScript modules
import { registerSettings } from './modules/settings.mjs';
import { preloadTemplates } from './modules/preloadTemplates.mjs';
import { macroHooks } from './modules/wfrp-macros.mjs'
import { trappingStatus } from './modules/wfrp-trappingStatus.mjs';
import { spendAdvantage } from './modules/wfrp-spendAdvantage.mjs';
import { advantageBonus } from './modules/wfrp-advantageBonus.mjs';
import { integratedPenalties } from './modules/wfrp-integratedPenalties.mjs';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.on('init', async function() {
	console.log('wfrp-tweaks | Initializing wfrp-tweaks');

	// Assign custom classes and constants here
	
	// Register custom module settings
	registerSettings();
	// Preload Handlebars templates
	await preloadTemplates();

	// Start Tweaks
	macroHooks();
	if(game.settings.get("wfrp-tweaks", 'trappingStatus'))
		trappingStatus();
	if(game.settings.get("wfrp-tweaks", 'spendAdvantage'))
		spendAdvantage();
	else if(game.settings.get("wfrp-tweaks", 'advantageBonus') != 10)
		advantageBonus();
	// if(game.settings.get("wfrp-tweaks", "integratedPenalties"))
	// 	integratedPenalties();
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function() {
	// Do anything after initialization but before
	// ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function() {
	// Do anything once the module is ready
	// CONFIG.debug.hooks = true;
});

// Add any additional hooks if necessary