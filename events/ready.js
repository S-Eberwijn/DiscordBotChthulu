const fs = require("fs");

module.exports = async bot => {
    // Check to see if bot is ready
    console.log(`\n${bot.user.username} is online!\n`);
    // let date = new Date(new Date().getTime() + (0*24*60*60*1000))
    // console.log(date.getDate());
    bot.user.setActivity(`Khthonios`, { type: "LISTENING" });

    //Initialize databases
    bot.stupidQuestionTracker = require("../jsonDb/stupidQuestionTracker.json");
    bot.ressurection = require("../jsonDb/ressurection.json");
    bot.initialization = require("../jsonDb/initialization.json");
    bot.sessions = require("../jsonDb/sessions.json");
    
    //Update resurrection database
    let ressurectionCount = bot.ressurection['resurrections'].count + 1;
    bot.ressurection['resurrections'] = {
        count: ressurectionCount
    };
    fs.writeFile("./jsonDb/ressurection.json", JSON.stringify(bot.ressurection, null, 4), err => {
        if (err) throw err;
    });
}