export const macroHooks = function() {
    Hooks.on("renderItemSheetWfrp4e", (sheet, html, data) => {
        if (data.item.type == "spell" || data.item.type == "prayer" || data.item.type == "weapon"){
          let currentMacroText = data.item.flags["wfrp-macros"] || "";
          let currentMacroType = data.item.flags["wfrp-macros-type"] || ""

          let actorId = ""
          if (sheet.item.actor)
            actorId = sheet.item.actor.id
          let macroInput = $(`
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text skills-textarea">Macro Type</label>
            <select name=${currentMacroType} data-dtype="String"> 
              <option value="chat">Chat</option>
              <option value="script">Script</option>
            </select>
          </div>
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text skills-textarea">Macro</label>
            <div class="input-box skills-textarea">
              <textarea class="input-text" type="text" data-dtype="String">${currentMacroText}</textarea>
            </div>
          </div>`)
          
          macroInput.find("select")[0].children[0].selected = (currentMacroType == "chat" ? true : false)
          macroInput.find("select")[0].children[1].selected = (currentMacroType == "script" ? true : false)
    
          macroInput.find("textarea").on("change", function(event, sheet) {
            let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
            let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")
    
            if (actorId){
              game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-macros" : event.currentTarget.value})
            }
            else if (itemId){
              game.items.get(itemId).update({"flags.wfrp-macros" : event.currentTarget.value})
            }
          })
          macroInput.find("select").on("change", function(event, sheet) {
            let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
            let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")
    
            if (actorId){
              game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-macros-type" : event.currentTarget.value})
            }
            else if (itemId){
              game.items.get(itemId).update({"flags.wfrp-macros-type" : event.currentTarget.value})
            }
            console.log(event.currentTarget.value)
            console.log(data.item.flags["wfrp-macros-type"])
          })
          html.find(".details").append(macroInput)
        }
    } )
    
    Hooks.on("wfrp4e:rollCastTest", result => {
      let macroText = result.spell.flags["wfrp-macros"];
      let macroType = result.spell.flags["wfrp-macros-type"]
    
      if(macroType == undefined)
        macroType = 'chat';

      if(result.description != "Casting Failed" && macroText != undefined && macroText != ""){
        let macro = new Macro({type : macroType, author: game.user.id, name : result.spell.name, command : macroText})
        macro.execute()
      }
    })
    
    Hooks.on("wfrp4e:rollPrayerTest", result => {
      let macroText = result.prayer.flags["wfrp-macros"];
      let macroType = result.prayer.flags["wfrp-macros-type"]

      if(macroType == undefined)
        macroType = 'chat';
    
      if(result.description != "Prayer Refused" && macroText != undefined && macroText != ""){
        let macro = new Macro({type : macroType, author: game.user.id, name : result.prayer.name, command : macroText})
        macro.execute()
      }
    })

    Hooks.on("wfrp4e:rollWeaponTest", result => {
      let macroText = result.weapon.flags["wfrp-macros"];
      let macroType = result.weapon.flags["wfrp-macros-type"]

      if(macroType == undefined)
        macroType = 'chat';
      
      if(result.description.includes("Success") && macroText != undefined && macroText != ""){
        let macro = new Macro({type : macroType, author: game.user.id, name : result.weapon.name, command : macroText})
        macro.execute()
      }
    })
}