const { MessageEmbed } = require('discord.js');
let fs = require('fs');
let { writeToJsonDb } = require('../otherFunctions/writeToJsonDb.js');
const { hexToDec } = require("../otherFunctions/numberFunctions");



module.exports = async (bot, messageReaction, user) => {

    let verifyChannel = bot.channels.cache.find(c => c.name == "verify" && c.type == "text");
    let generalChannel = bot.channels.cache.find(c => c.name == "general" && c.type == "text");
    let sessionRequestChannel = bot.channels.cache.find(c => c.name == "session-request" && c.type == "text");
    let plannedSessionsChannel = bot.channels.cache.find(c => c.name == "planned-sessions" && c.type == "text");
    let pastSessionsChannel = bot.channels.cache.find(c => c.name == "past-sessions" && c.type == "text");

    let verifiedRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Verified');
    let newcomerRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Newcomer');
    let dmRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeon Master');

    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    if (user.bot) return;
    const { message, emoji } = messageReaction;

    if (verifyChannel) {
        if (message.channel.id === verifyChannel.id) {

            if (emoji.name === '✅') {
                messageReaction.message.guild.members.cache.get(user.id).roles.add(verifiedRole);
                messageReaction.message.guild.members.cache.get(user.id).roles.remove(newcomerRole);

                message.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
                message.react('✅');

                generalChannel.send(`Welcome to the server ${messageReaction.message.guild.members.cache.get(user.id)}!`);
            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
    }
    if (sessionRequestChannel) {
        if (message.channel.id === sessionRequestChannel.id) {
            if (message.guild.member(user).roles.cache.has(dmRole.id)) {
                const editedEmbed = new MessageEmbed(message.embeds[0]).setTitle(`**Session_${bot.sessions.totalSessions + 1}: **`);

                // find the right session
                for (let i = 0; i < bot.sessions.requestedSessions.length; i++) {
                    if (bot.sessions.requestedSessions[i].sessionId === hexToDec(editedEmbed.hexColor)) {

                        // update plannedSessions
                        bot.sessions.plannedSessions[bot.sessions.plannedSessions.length] = bot.sessions.requestedSessions[i];

                        // remove from requestedSessions
                        bot.sessions.requestedSessions.splice(i, 1);
                        break;
                    }
                }

                // update totalSessions 
                bot.sessions.totalSessions += 1;

                // write away the new json db
                writeToJsonDb("sessions", bot.sessions);

                // update embed with the right DM
                editedEmbed.fields[2].value = `<@${user.id}>`;

                // send the message to a new channel
                plannedSessionsChannel.send(editedEmbed);
                message.delete();

            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }

        }
    }
    if (plannedSessionsChannel) {
        if (message.channel.id === plannedSessionsChannel.id) {
            if (message.guild.member(user).roles.cache.has(dmRole.id)) {
                const editedEmbed = new MessageEmbed(message.embeds[0]);

                // could for instance be "PLAYED" or "CANCELED"
                let status = "PLAYED";
                editedEmbed.title = `${editedEmbed.title}[${status}]`;

                for (let i = 0; i < bot.sessions.plannedSessions.length; i++) {
                    if (bot.sessions.plannedSessions[i].sessionId === hexToDec(editedEmbed.hexColor)) {
                        // update pastSessions
                        bot.sessions.pastSessions[bot.sessions.pastSessions.length] = bot.sessions.plannedSessions[i];

                        // remove from plannedSessions
                        bot.sessions.plannedSessions.splice(i, 1);
                        break;
                    }
                }

                // update the json database
                writeToJsonDb("sessions", bot.sessions);

                message.delete()
                pastSessionsChannel.send(editedEmbed);

            }
        }
    }
}