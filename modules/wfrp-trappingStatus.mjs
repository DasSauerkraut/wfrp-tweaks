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

const formLoaded = (element) => {
    return new Promise(resolve => {
      function check() {
        if (document.getElementsByClassName(element)) {
            console.log('elements found!')
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    })
  }

const trappingListStyling = async(missingTrappings) => {
    console.log('trappingListStyling awaiting')
    await formLoaded('tag')
    console.log('Resolved')
    let trappings = document.getElementsByClassName('tag')
    // .filter(elmnt => {
    //     elmnt.innerText.includes('Trappings:')
    // })[0]
    console.log(trappings)
}

const changeStyling = (missingTrappings) => {
    let status = document.getElementById('input-status');
    status.style.color = 'red';
    status.title = `Your status has taken a hit as you are lacking the following trappings: ${missingTrappings.join(', ')}`
    trappingListStyling(missingTrappings)
}

export const trappingStatus = () => {
    Hooks.on('renderActorSheet', (sheet, settings, entity)  => {
        let currentCareer = entity.actor.careers.filter(career => career.data.current.value == true)[0]
        let targetTrappings = currentCareer.data.trappings;
        let currentTrappings = entity.actor.items.filter(item => item.type == "trapping");
        let currentStatus = entity.actor.data.details.status.value;
        let careerStatus = formatCareerStatus(currentCareer.data.status)
        let missingTrappings = [];
        let statusAdjusted = false;

        targetTrappings.forEach(target => {
            let found = false;
            for(let i = 0; i < currentTrappings.length; i++){
                if(currentTrappings[i].name == target){
                    found = true;
                    break;
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

        console.log(entity.actor)
    })
}