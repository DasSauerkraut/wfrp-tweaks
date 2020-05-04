export const registerSettings = function() {
  // Register any custom module settings here
  console.log('wfrp-tweaks | Registering settings...')
	// game.settings.register('wfrp-tweaks', 'trappingStatus', {
  //   name: "Career Trapping Status,",
  //   hint: "If you lack the trappings associated with your career, you take a malus to your status.",
  //   scope: 'world',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  // });
  game.settings.register('wfrp-tweaks', 'integratedPenalties', {
      name: "Integrated Penalties",
      hint: "This will allow for auto-calculation of penalties from things such as fatigue, injuries, and armor.",
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
}