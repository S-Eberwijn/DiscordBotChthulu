const fs = require("fs");

module.exports = async bot => {
    // Check to see if bot is ready
    console.log(`${bot.user.username} is online!\n`)
    bot.user.setActivity(`Khthonios`, { type: "LISTENING" });

    //Initialize databases
    bot.stupidQuestionTracker = require("../jsonDb/stupidQuestionTracker.json");
    bot.ressurection = require("../jsonDb/ressurection.json");
    bot.initialization = require("../jsonDb/initialization.json");
    
    //Update resurrection database
    let ressurectionCount = bot.ressurection['resurrections'].count + 1;
    bot.ressurection['resurrections'] = {
        count: ressurectionCount
    };
    fs.writeFile("./jsonDb/ressurection.json", JSON.stringify(bot.ressurection, null, 4), err => {
        if (err) throw err;
    });
}