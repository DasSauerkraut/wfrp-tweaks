const calculateAdjustedStatus = (missing, currentStatus) => {
    let tier = currentStatus.split(" ")[0];
    let level = parseInt(currentStatus.split(" ")[1]);
    let newTier = "";
    let newLevel = 0;
    let tierAbbrev = ""
    
    console.log(`Missing ${missing}, ${tier} ${level}`)
    console.log(level-missing)
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

    if(newTier == "Silver")
        tierAbbrev = "s";
    else if(newTier == "Gold")
        tierAbbrev = "g";
    else
        tierAbbrev == "b"
    return {
        string: `${newTier} ${newLevel}`,
        tier: tierAbbrev,
        standing: newLevel
    }
}

const formatCareerStatus = (status) =>{
    let newStatus = "";
    if(status.tier == "s")
        newStatus = "Silver";
    else if(status.tier == "g")
        newStatus = "Gold";
    else
        newStatus == "Brass"
    return `${newStatus} ${status.standing}`
}

export const trappingStatus = () => {
    Hooks.on('renderActorSheet', (sheet, settings, entity)  => {
        let currentCareer = entity.actor.careers.filter(career => career.data.current.value == true)[0]
        let targetTrappings = currentCareer.data.trappings;
        let currentTrappings = entity.actor.items.filter(item => item.type == "trapping");
        let currentStatus = entity.actor.status;
        let careerStatus = undefined
        if(entity.actor.flags.tweaksCareerStatus){
            careerStatus = entity.actor.flags.tweaksCareerStatus
        } else {
            careerStatus = currentCareer.data.status
            game.actors.get(entity.actor._id).update({"flags.tweaksCareerStatus": careerStatus})
        }
        careerStatus = formatCareerStatus(careerStatus)

        console.log('Before adjust')
        console.log(entity.actor)
        let missingCount = 0;
        targetTrappings.forEach(target => {
            let found = false;
            for(let i = 0; i < currentTrappings.length; i++){
                if(currentTrappings[i].name == target){
                    found = true;
                    break;
                }
            }
            if(!found)
                missingCount++;
        })
        if(missingCount != 0){
            let newStatus = calculateAdjustedStatus(missingCount, careerStatus)
            console.log(newStatus + " " + currentStatus)
            //&& missingCount != entity.actor.flags.tweaksMissingTrappings
            if(newStatus.string != currentStatus ){
                console.log(game.actors)
                console.log(entity.actor._id)
                console.log(game.actors.get(entity.actor._id))
                // entity.actor.status = newStatus.string;
                game.actors.get(entity.actor._id).update({"status": newStatus.string})
                entity.actor.data.details.status.standing = newStatus.standing
                entity.actor.data.details.status.tier = newStatus.tier
                console.log(entity.actor.data.details.status)
                // game.actors.get(entity.actor._id).update({"data.details.status.standing": newStatus.standing})
                // game.actors.get(entity.actor._id).update({"data.details.status.tier": newStatus.tier})
                game.actors.get(entity.actor._id).update({"flags.tweaksMissingTrappings": missingCount})
            }
        }
        console.log('after adjust')
        console.log(entity.actor)
    })
}