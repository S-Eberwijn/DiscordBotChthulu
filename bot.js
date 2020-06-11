const { Client } = require('discord.js');
const fs = require("fs");
const Enmap = require('enmap');
const { token } = require('./config')

// Initialize Discord Bot
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Enmap();

// Read and log command files
fs.readdir("./commands/", async (err, files) => {
    if (err) console.log(err);
    var jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("Found no .js files!");
        return;
    }

    jsFiles.forEach((f, i) => {
        var fileGet = require(`./commands/${f}`);
        console.log(`--{ Command ${f} is loaded }--`);
        var commandName = fileGet.help.name;
        bot.commands.set(commandName.toLowerCase(), fileGet);
    });
    console.log('\n');
});

// Read and log event files
fs.readdir('./events/', (err, files) => {
    if(err) console.log(err);
    files.forEach(file => {
        if(!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`--{ Event ${evtName} is loaded }--`);
        bot.on(evtName, evt.bind(null, bot));
    });
    console.log('\n');
});

bot.login(token);
