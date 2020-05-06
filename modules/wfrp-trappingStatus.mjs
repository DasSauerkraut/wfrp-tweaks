const calculateAdjustedStatus = (missing, currentStatus) => {
    let tier = currentStatus.split(" ")[0];
    let level = parseInt(currentStatus.split(" ")[1]);
    let newTier = "";
    let newLevel = 0;

    if(level - missing <= 0){
        if(tier !== "Brass"){
            newTier = (tier == "Silver" ? "Brass" : "Silver")
            newLevel = 5 - Math.abs(level-missing)
        } else {
            newTier = tier;
            newLevel = 0;
        }
    } else {
        newTier = tier
        newLevel = level - missing;
    }

    return `${newTier} ${newLevel}`
}

const formatCareerStatus = (status) =>{
    let newStatus = "";
    if(status.tier == "s")
        newStatus = "Silver";
    if(status.tier == "g")
        newStatus = "Gold";
    if(status.tier == "b")
        newStatus = "Brass"

    return `${newStatus} ${status.standing}`
}

const changeStyling = (missingTrappings) => {
    let status = document.getElementById('input-status');
    status.style.color = 'red';
    status.title = `Your status has taken a hit as you are lacking the following trappings: ${missingTrappings.join(', ')}`
}

export const trappingStatus = () => {
    Hooks.on('renderActorSheet', (sheet, settings, entity)  => {
        let currentCareer = entity.actor.careers.filter(career => career.data.current.value == true)[0]
        let targetTrappings = currentCareer.data.trappings;
        let currentTrappings = entity.actor.items.filter(item => item.type == "trapping" 
        || item.type == "weapon"
        || item.type == "armour"
        || item.type == "container"
        || item.type == "ammunition");
        let currentStatus = entity.actor.data.details.status.value;
        let careerStatus = formatCareerStatus(currentCareer.data.status)
        let missingTrappings = [];
        let statusAdjusted = false;

        // console.log(currentTrappings)
        targetTrappings.forEach(target => {
            let found = false;
            if (target.includes(' or ')){
                let targets = target.split(' or ')
                for(let i = 0; i < currentTrappings.length; i++){
                    if(targets[0].includes(currentTrappings[i].name) 
                    || targets[1].includes(currentTrappings[i].name)
                    || currentTrappings[i].name == targets[0]
                    || currentTrappings[i].name == targets[1]){
                        found = true;
                        break;
                    }
                }
            } else if (target.includes(' and ')){
                let targets = target.split(' and ');
                let target1Found = false;
                let target2Found = false;
                for(let i = 0; i < currentTrappings.length; i++){
                    if(targets[0].includes(currentTrappings[i].name) || currentTrappings[i].name == targets[0]){
                        target1Found = true;
                    }
                    if(targets[1].includes(currentTrappings[i].name) || currentTrappings[i].name == targets[1]) {
                        target2Found = true;
                    }
                    if(target1Found && target2Found){
                        found = true;
                        break;
                    }
                }
            } else {
                // console.log('Checking')
                for(let i = 0; i < currentTrappings.length; i++){
                    // console.log(`${target} ${currentTrappings[i].name}`)
                    if(target.includes(currentTrappings[i].name) || currentTrappings[i].name == target){
                        found = true;
                        break;
                    }
                }
            }
            if(!found && target != ""){
                missingTrappings.push(target)}
        })

        if(missingTrappings.length != 0){
            let newStatus = calculateAdjustedStatus(missingTrappings.length, careerStatus)
            if(newStatus != currentStatus ){
                game.actors.get(entity.actor._id).update({"data.details.status.value" : newStatus})
                game.actors.get(entity.actor._id).update({"flags.tweaksMissingTrappings": missingTrappings})
                statusAdjusted = true;
            }
        } else if(currentStatus != careerStatus){
            game.actors.get(entity.actor._id).update({"data.details.status.value" : careerStatus})
        }

        if(careerStatus != currentStatus || statusAdjusted)
            changeStyling(missingTrappings)

        // console.log(entity.actor)
    })
}