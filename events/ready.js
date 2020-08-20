const fs = require("fs");
const db = require('../database/database.js');
const { initializeDB } = require('../database/initializeDB');


module.exports = async bot => {
    // Check to see if bot is ready
    console.log(`\n${bot.user.username} is online!\n`);

    db.authenticate().then(async () => {
        console.log("Logged in to DB.");

        initializeDB(db);
        
    }).catch(err => console.log(err));

    // let date = new Date(new Date().getTime() + (0*24*60*60*1000))
    // console.log(date.getDate());

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
