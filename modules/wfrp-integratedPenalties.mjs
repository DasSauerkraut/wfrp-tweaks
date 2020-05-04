export const integratedPenalties = () => {
    Hooks.on("updateToken", (scene, token, arg) => {
        if(arg.effects == undefined || arg.effects == null)
            return
        let actor = game.actors.get(token.actorId)
        let characteristics = {}

        let mallusLvl = 0;
        arg.effects.forEach(effect => {
            if(effect.includes('fatigued')){
                let str = effect.slice(32)
                mallusLvl += parseInt(str.replace( /^\D+/g, ''))
            } else if(effect.includes('poisoned')){
                let str = effect.slice(32)
                mallusLvl += parseInt(str.replace( /^\D+/g, ''))
            }
        });
        console.log(mallusLvl)
        if(actor.data.flags.tweaksIntegratedPenalties){
            console.log('Flag found, grabbing original stats')
            characteristics = actor.data.flags['tweaksIntegratedPenalties'].char
        } else {
            console.log('No Flag found, storing stats')
            let pkg = {
                char: actor.data.data.characteristics,
                penalty: mallusLvl
            }
            characteristics = actor.data.data.characteristics
            actor.update({'flags.tweaksIntegratedPenalties': pkg}) 
        }
        let newCharacteristics = {};
        for (let [key, value] of Object.entries(characteristics)) {
            newCharacteristics[`${key}`] = JSON.parse(JSON.stringify(value));
            newCharacteristics[`${key}`].initial -= mallusLvl * 10;
        }
        actor.update({'data.characteristics': newCharacteristics})
    })

    Hooks.on('renderActorSheet', (sheet, settings, entity)  => {
        console.log(game.actors.get(entity.actor._id).data.flags.tweaksIntegratedPenalties.penalty)
        if(game.actors.get(entity.actor._id).data.flags.tweaksIntegratedPenalties.penalty != 0) {
            let characteristics = document.getElementsByClassName('table-data ch-value');
            for(let i = 0; i < characteristics.length; i++){
                characteristics[i].style.backgroundColor = 'rgba(255, 0, 0, 0.5)' 
            }
        }
    })
}