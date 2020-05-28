export const advantageBonus = () => {
    Hooks.on("renderDialog", (dialog, arg, content) => {
        if(document.getElementsByName('advantage')[0]){
            let bonus = game.settings.get("wfrp-tweaks", 'advantageBonus');
            let advantage = parseInt(document.getElementsByName('advantage')[0].value)
            let modifier = document.getElementsByName('testModifier')[0]
            if(!Number.isNaN(advantage))
                modifier.value = advantage * bonus
        }
    })
}