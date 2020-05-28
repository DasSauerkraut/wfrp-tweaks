export const registerSettings = function() {
  // Register any custom module settings here
  console.log('wfrp-tweaks | Registering settings...')
	game.settings.register('wfrp-tweaks', 'trappingStatus', {
    name: "Career Trapping Status",
    hint: "If you lack the trappings associated with your career, you take a malus to your status.",
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('wfrp-tweaks', 'advantageBonus', {
    name: "Advantage Bonus",
    hint: "Change the amount of bonus advantage gives.",
    scope: 'world',
    config: true,
    default: 10,
    type: Number,
  });
  game.settings.register('wfrp-tweaks', 'spendAdvantage', {
    name: "Spend Advantage",
    hint: "Advantage is changed to be consumed on use. Put the amount you want to spend in the 'Advantage' box in the Roll Dialog.",
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('wfrp-tweaks', 'spendAdvantageAmount', {
    name: "Spend Advantage Scaling,",
    hint: "If the Spend Advantage setting is enabled, for each advantage spent passed the first, add this amount to the total bonus.",
    scope: 'world',
    config: true,
    default: 0,
    type: Number,
  });
  // game.settings.register('wfrp-tweaks', 'integratedPenalties', {
  //     name: "Integrated Penalties",
  //     hint: "This will allow for auto-calculation of penalties from things such as fatigue, injuries, and armor.",
  //     scope: 'world',
  //     config: true,
  //     default: false,
  //     type: Boolean,
  //   });
}