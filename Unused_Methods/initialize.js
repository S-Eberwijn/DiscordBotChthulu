const discord = require('discord.js');
let fs = require('fs');
let entryExists = false;
let guild;


module.exports.run = async (bot, message, args) => {
    bot.initialization = require("../jsonDb/initialization.json");
    guild = message.guild;

    //Create Verify-Message
   
    if (args[0]) {
        let verifiedRole = message.guild.roles.cache.find(role => role.name === "Verified");

        if (args[0].toUpperCase() === "verify".toUpperCase()) {

            for (var k in bot.initialization.initialized) {
                if (bot.initialization.initialized[k].guildId == guild.id) {
                    bot.initialization.initialized[k].verifyChannel = true;
                    break;
                }
            }
            console.log("making verify channel");

            message.guild.channels.create('--VERIFICATION--', {
                type: 'category',
            }).then(channel => {
                channel.updateOverwrite(channel.guild.roles.everyone, {
                    CREATE_INSTANT_INVITE: false,
                    KICK_MEMBERS: false,
                    BAN_MEMBERS: false,
                    ADMINISTRATOR: false,
                    MANAGE_CHANNELS: false,
                    MANAGE_GUILD: false,
                    ADD_REACTIONS: true,
                    READ_MESSAGES: true,
                    SEND_MESSAGES: false,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_MESSAGES: false,
                    EMBED_LINKS: false,
                    ATTACH_FILES: false,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false,
                    EXTERNAL_EMOJIS: false,
                    CONNECT: false,
                    SPEAK: false,
                    MUTE_MEMBERS: false,
                    DEAFEN_MEMBERS: false,
                    MOVE_MEMBERS: false,
                    USE_VAD: false,
                    CHANGE_NICKNAME: false,
                    MANAGE_NICKNAMES: false,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false,
                    MANAGE_EMOJIS: false,
                    PRIORITY_SPEAKER: false,
                    STREAM: false,
                    USE_EXTERNAL_EMOJIS: false,
                    VIEW_CHANNEL: true,
                });
                channel.updateOverwrite(verifiedRole, {
                    VIEW_CHANNEL: false,
                    ADD_REACTIONS: false
                });
            }).then(async () => {
                await createChannel(`verify`, "text", "--VERIFICATION--", bot).then(channel => {
                   
                });
            });
         } 
        //else if (args[0].toUpperCase() == "serverstats".toUpperCase()) {
        //     console.log("making serverstat channels");
        //     message.guild.channels.create('--SERVER STATS--', {
        //         type: 'category',
        //     }).then(channel => {
        //         channel.updateOverwrite(channel.guild.roles.everyone, {
        //             CREATE_INSTANT_INVITE: false,
        //             KICK_MEMBERS: false,
        //             BAN_MEMBERS: false,
        //             ADMINISTRATOR: false,
        //             MANAGE_CHANNELS: false,
        //             MANAGE_GUILD: false,
        //             ADD_REACTIONS: false,
        //             READ_MESSAGES: false,
        //             SEND_MESSAGES: false,
        //             SEND_TTS_MESSAGES: false,
        //             MANAGE_MESSAGES: false,
        //             EMBED_LINKS: false,
        //             ATTACH_FILES: false,
        //             READ_MESSAGE_HISTORY: false,
        //             MENTION_EVERYONE: false,
        //             EXTERNAL_EMOJIS: false,
        //             CONNECT: false,
        //             SPEAK: false,
        //             MUTE_MEMBERS: false,
        //             DEAFEN_MEMBERS: false,
        //             MOVE_MEMBERS: false,
        //             USE_VAD: false,
        //             CHANGE_NICKNAME: false,
        //             MANAGE_NICKNAMES: false,
        //             MANAGE_ROLES: false,
        //             MANAGE_WEBHOOKS: false,
        //             MANAGE_EMOJIS: false,
        //             PRIORITY_SPEAKER: false,
        //             STREAM: false,
        //             USE_EXTERNAL_EMOJIS: false,
        //             VIEW_CHANNEL: false,
        //         });
        //         channel.updateOverwrite(verifiedRole, {
        //             VIEW_CHANNEL: true
        //         });
        //     }).then(() => {
        //         const botCountChannel = createChannel(`Bot Count : ${message.guild.members.cache.filter(m => m.user.bot).size}`, "voice", "--SERVER STATS--", bot).then(channel => {
        //             for (var k in bot.initialization.initialized) {
        //                 if (bot.initialization.initialized[k].guildId == guild.id) {
        //                     bot.initialization.initialized[k].serverStatsChannels.botCountChannelId = channel.id;

        //                     obj = bot.initialization;
        //                     obj.initialized.push();
        //                     let json = JSON.stringify(obj, null, 4);
        //                     fs.writeFile('./jsonDb/initialization.json', json, err => { if (err) throw err });

        //                     break;
        //                 }
        //             }


        //         });
        //         const onlineUsersChannel = createChannel(`Online Users :  ${message.guild.members.cache.filter(m => !m.user.bot && (m.user.presence.status === "online" || m.user.presence.status === "idle" || m.user.presence.status === "dnd")).size}`, "voice", "--SERVER STATS--", bot).then(channel => {
        //             for (var k in bot.initialization.initialized) {
        //                 if (bot.initialization.initialized[k].guildId == guild.id) {
        //                     bot.initialization.initialized[k].serverStatsChannels.onlineUsersChannelId = channel.id;

        //                     obj = bot.initialization;
        //                     obj.initialized.push();
        //                     let json = JSON.stringify(obj, null, 4);
        //                     fs.writeFile('./jsonDb/initialization.json', json, err => { if (err) throw err });

        //                     break;
        //                 }
        //             }
        //         });
        //         const totalUsersChannel = createChannel(`Total Users : ${message.guild.members.cache.filter(m => !m.user.bot).size}`, "voice", "--SERVER STATS--", bot).then(channel => {
        //             for (var k in bot.initialization.initialized) {
        //                 if (bot.initialization.initialized[k].guildId == guild.id) {
        //                     bot.initialization.initialized[k].serverStatsChannels.totalUsersChannelId = channel.id;


        //                     obj = bot.initialization;
        //                     obj.initialized.push();
        //                     let json = JSON.stringify(obj, null, 4);
        //                     fs.writeFile('./jsonDb/initialization.json', json, err => { if (err) throw err });

        //                     break;
        //                 }
        //             }
        //         });

        //         for (var k in bot.initialization.initialized) {
        //             if (bot.initialization.initialized[k].guildId == guild.id) {
        //                 bot.initialization.initialized[k].serverStats = true;

        //                 obj = bot.initialization;
        //                 obj.initialized.push();
        //                 let json = JSON.stringify(obj, null, 4);
        //                 fs.writeFile('./jsonDb/initialization.json', json, err => { if (err) throw err });

        //                 break;
        //             }
        //         }

        //     });
        // }
    } else {
        let obj = bot.initialization;
        //Check if server is already in the database,
        for (var k in bot.initialization.initialized) {
            if (bot.initialization.initialized[k].guildId == guild.id) {
                console.log("This server already has an entry.");
                entryExists = true;
                break;
            } else {
                entryExists = false;
            }
        }
        //If not create an entry
        if (!entryExists) {
            console.log("Entry is being made.");
            obj.initialized.push({ guildName: bot.guilds.cache.get(message.guild.id).name, guildId: bot.guilds.cache.get(message.guild.id).id, verifyChannel: false, serverStats: false, serverStatsChannels: { botCountChannelId: '', onlineUsersChannelId: '', totalUsersChannelId: '' } });
            let json = JSON.stringify(obj, null, 4);
            fs.writeFile('./jsonDb/initialization.json', json, err => { if (err) throw err });
        }
    }
}

async function createChannel(name, category, categoryParentName, bot) {
    let serverStatCategory = await bot.channels.cache.find(c => c.name == categoryParentName && c.type == "category");
    if (!serverStatCategory) throw new Error("Category channel does not exist");

    const newChannel = await guild.channels.create(name, { type: category })
    await newChannel.setParent(serverStatCategory.id).then(async channel => {
        await channel.lockPermissions();
    });
    return newChannel;
}

module.exports.help = {
    name: "initialize",
    description: "Initializes the verify channel",
    category: "Test"
}