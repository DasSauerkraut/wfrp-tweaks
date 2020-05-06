export const macroHooks = function() {
    Hooks.on("renderItemSheetWfrp4e", (sheet, html, data) => {
        if (data.item.type == "spell" || data.item.type == "prayer" || data.item.type == "weapon"){
          let currentMacro = data.item.flags["wfrp-macros"] || "";
          let currentAtkMacro = data.item.flags["wfrp-atk-macros"] || "";

          let actorId = ""
          if (sheet.item.actor)
            actorId = sheet.item.actor.id
          let macroInput = $(`
          <div class="form-group-stacked" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text">Macro Executed on Successful Test</label>
          </div>
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text skills-textarea">Macro Type</label>
            <select name=${currentMacro.type} data-dtype="String"> 
              <option value="chat">Chat</option>
              <option value="script">Script</option>
            </select>
          </div>
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text skills-textarea">Macro</label>
            <div class="input-box skills-textarea">
              <textarea class="input-text" type="text" data-dtype="String">${currentMacro.text}</textarea>
            </div>
          </div>`)

          let macroAtkInput = $(`
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text">Macro Executed on a Successful Targeted Attack</label>
          </div>
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text skills-textarea">Macro Type</label>
            <select name=${currentAtkMacro.type} data-dtype="String"> 
              <option value="chat">Chat</option>
              <option value="script">Script</option>
            </select>
          </div>
          <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
            <label class="label-text skills-textarea">Macro</label>
            <div class="input-box skills-textarea">
              <textarea class="input-text" type="text" data-dtype="String">${currentAtkMacro.text}</textarea>
            </div>
          </div>`
          )
          

          macroInput.find("select")[0].children[0].selected = (currentMacro.type == "chat" ? true : false)
          macroInput.find("select")[0].children[1].selected = (currentMacro.type == "script" ? true : false)

          macroAtkInput.find("select")[0].children[0].selected = (currentAtkMacro.type == "chat" ? true : false)
          macroAtkInput.find("select")[0].children[1].selected = (currentAtkMacro.type == "script" ? true : false)
    
          macroInput.find("textarea").on("change", function(event, sheet) {
            let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
            let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")
    
            if (actorId){
              game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-macros.text" : event.currentTarget.value})
            }
            else if (itemId){
              game.items.get(itemId).update({"flags.wfrp-macros.text" : event.currentTarget.value})
            }
          })
          macroInput.find("select").on("change", function(event, sheet) {
            let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
            let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")
    
            if (actorId){
              game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-macros.type" : event.currentTarget.value})
            }
            else if (itemId){
              game.items.get(itemId).update({"flags.wfrp-macros.type" : event.currentTarget.value})
            }
          })

          macroAtkInput.find("textarea").on("change", function(event, sheet) {
            let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
            let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")
    
            if (actorId){
              game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-atk-macros.text" : event.currentTarget.value})
              console.log(game.actors.get(actorId))
            }
            else if (itemId){
              game.items.get(itemId).update({"flags.wfrp-atk-macros.text" : event.currentTarget.value})
              console.log(game.items.get(itemId))
            }
          })
          macroAtkInput.find("select").on("change", function(event, sheet) {
            let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
            let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")
    
            if (actorId){
              game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-atk-macros.type" : event.currentTarget.value})
              console.log(game.actors.get(actorId))
            }
            else if (itemId){
              game.items.get(itemId).update({"flags.wfrp-atk-macros.type" : event.currentTarget.value})
              console.log(game.items.get(itemId))
            }
          })
          html.find(".details").append(macroInput)
          if(data.item.type == "weapon")
            html.find(".details").append(macroAtkInput)
        }
    } )
    
    Hooks.on("wfrp4e:rollCastTest", result => {
      let macro = result.spell.flags["wfrp-macros"];
    
      if(macro.type == undefined)
        macro.type = 'chat';

      if(result.description != "Casting Failed" && macro.text != undefined && macro.text != ""){
        let compiledMacro = new Macro({type : macro.type, author: game.user.id, name : result.spell.name, command : macro.text})
        compiledMacro.execute()
      }
    })
    
    Hooks.on("wfrp4e:rollPrayerTest", result => {
      let macro = result.prayer.flags["wfrp-macros"];
      if(macro.type == undefined)
        macro.type = 'chat';
    
      if(result.description != "Prayer Refused" && macro.text != undefined && macro.text != ""){
        let compiledMacro = new Macro({type : macro.type, author: game.user.id, name : result.prayer.name, command : macro.text})
        compiledMacro.execute()
      }
    })

    Hooks.on("wfrp4e:rollWeaponTest", result => {
      let macro = result.weapon.flags["wfrp-macros"];

      if(macro.type == undefined)
        macro.type = 'chat';
      
      if(result.description.includes("Success") && macro.text != undefined && macro.text != ""){
        let compiledMacro = new Macro({type : macro.type, author: game.user.id, name : result.weapon.name, command : macro.text})
        compiledMacro.execute()
      }
    })

    Hooks.on('wfrp4e:opposedTestResult', result => {
      let atkMacro, defMacro = undefined;

      if(result.winner == "attacker" && result.attackerTestResult.preData.function == "rollWeaponTest"){
        atkMacro = result.attackerTestResult.weapon.flags["wfrp-atk-macros"];
        if(atkMacro.type == undefined)
          atkMacro.type = 'chat';
      }

      // if(result.defenderTestResult.preData.function == "rollWeaponTest"){
      //   defMacroText = result.defenderTestResult.weapon.flags["wfrp-macros"];
      //   defMacroType = result.defenderTestResult.weapon.flags["wfrp-macros-type"];
      // }

      if(result.winner == "attacker" && atkMacro.text != undefined && atkMacro.text != ""){
        let compiledMacro = new Macro({type : atkMacro.type, author: game.user.id, name : result.attackerTestResult.weapon.name, command : atkMacro.text})
        compiledMacro.execute()
      } 
      // else if(result.winner == "defender" && defMacroText != undefined && defMacroText != ""){
      //   let macro = new Macro({type : defMacroType, author: game.user.id, name : result.defenderTestResult.weapon.name, command : defMacroText})
      //   macro.execute()
      // }
    })
}