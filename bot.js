require('dotenv').config();
const { Client } = require('discord.js');
const fs = require("fs");
const Enmap = require('enmap');
const keep_alive = require('./keep_alive.js')




// Initialize Discord Bot
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Enmap();

// Read and log command files
fs.readdir("./commands/", async (err, dirs) => {
    if (err) console.log(err);
    if (dirs.length <= 0) {
        console.log("Found no dirs files!");
        return;
    }
    dirs.forEach((d, i) => {
        fs.readdir(`./commands/${d}`, async (err, files) => {
            if (err) console.log(err);
            var jsFiles = files.filter(f => f.split(".").pop() === "js");
            if (dirs.length <= 0) {
                console.log("Found no dirs files!");
                return;
            }
            jsFiles.forEach((f, i) => {
                var fileGet = require(`./commands/${d}/${f}`);
                console.log(`--{ Command ${f} is loaded }--`);
                var commandName = fileGet.help.name;
                var commandAlias = fileGet.help.alias;
                bot.commands.set(commandName.toLowerCase(), fileGet);
                commandAlias.forEach(alias => {
                    bot.commands.set(alias.toLowerCase(), fileGet);
                });
            });
        });
    });
});

// Read and log event files
fs.readdir('./events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`--{ Event ${evtName} is loaded }--`);
        bot.on(evtName, evt.bind(null, bot));
    });
});
bot.login(`${process.env.TOKEN}`);
