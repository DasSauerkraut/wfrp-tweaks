export const spendAdvantage = () => {
    let advantage = 0;
    let startingAdvantage = 0;
    Hooks.on("renderDialog", (dialog, arg, content) => {
        if(document.getElementsByName('advantage')[0]){
            startingAdvantage = document.getElementsByName('advantage')[0].value
            let advantageField = document.getElementsByClassName('form-group')[0]

            const adjustMod = () => {
                advantage = parseInt(document.getElementsByName('advantage')[0].value)
                let advScaler = game.settings.get("wfrp-tweaks", 'spendAdvantageAmount')
                let advBonus = game.settings.get("wfrp-tweaks", 'advantageBonus')
                let modifier = document.getElementsByName('testModifier')[0]
                if(!Number.isNaN(advantage)){
                    if(advantage > startingAdvantage){
                        advantage = startingAdvantage;
                        document.getElementsByName('advantage')[0].value = startingAdvantage;
                    } else if (advantage < 0){
                        advantage = 0;
                        document.getElementsByName('advantage')[0].value = 0;
                    }
                    modifier.value = (advantage * advBonus) + (advantage > 1 ? ((advantage - 1) * advScaler) : 0)
                }
            }
            advantageField.innerHTML = `
                <label>Advantage (${startingAdvantage})</label>
                <input type="text" name="advantage" value="0"/>
            `
            document.getElementsByName('advantage')[0].addEventListener("input", adjustMod); 
        }
    })

    Hooks.on("wfrp4e:rollTest", (roll, cardOptions) => {
        let target = canvas.tokens.get(cardOptions.speaker.token)
        target.actor.update({"data.status.advantage.value" : `${startingAdvantage - advantage}`});
    })
}