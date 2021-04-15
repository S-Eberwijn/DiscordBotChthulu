const { MessageEmbed } = require('discord.js');
const { progressBar } = require('../../otherFunctions/ProgressBar');


module.exports.run = async (bot, message, args) => {
    let voteResults = new Map();

    let question = message.content.slice(process.env.PREFIX.length + 5)
    if (!question) {
        return message.channel.send('You did not provide a question!');
    }

    const questionEmbed = new MessageEmbed()
        .setTitle(`${question.toUpperCase()}`)
        .setColor('#4086bb')
        .setDescription('You only have **1 vote**! So use it wisely.')

    const filter = (reaction, user) => {
        if (user.bot === false && (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️')) {
            if (!voteResults.has(user.id)) {
                voteResults.set(user.id, reaction.emoji.name);
            }
            return ['✔️', '✖️', '❔'].includes(reaction.emoji.name) && user.bot === false;
        }
    }

    message.delete().then(async () => {
        await message.channel.send(questionEmbed).then(async embedMessage => {
            this.embedMessage = embedMessage;
            await embedMessage.react('✔️');
            await embedMessage.react('❔');
            await embedMessage.react('✖️');
            await embedMessage.awaitReactions(filter, {
                max: message.guild.members.cache.filter(member => !member.user.bot).size,
                time: 300000,
                errors: ['time'],
            }).then(async (collected) => {
                embedMessage.delete().then(() => {
                    let votedTrue = 0;
                    let votedMaybe = 0;
                    let votedFalse = 0;
                    for (let reaction of voteResults.values()) {
                        if (reaction === '✔️') {
                            votedTrue++;
                        } else if (reaction === '✖️') {
                            votedFalse++;
                        } else if (reaction === '❔') {
                            votedMaybe++;
                        }
                    }
                    const votingResultEmbed = new MessageEmbed()
                        .setTitle(`${question.toUpperCase()}`)
                        .setColor('#4086bb')
                        .setFooter(`${message.author.username} created this poll.`)
                        .addField(`**VOTING RESULT**`, `✔️: ${progressBar(votedTrue, voteResults.size, 15)}\n❔: ${progressBar(votedMaybe, voteResults.size, 15)}\n✖️: ${progressBar(votedFalse, voteResults.size, 15)}`, true);

                    embedMessage.channel.send('Ballot box closed!', votingResultEmbed);
                })
            }).catch(function () {
                embedMessage.delete().then(() => {
                    let votedTrue = 0;
                    let votedMaybe = 0;
                    let votedFalse = 0;
                    for (let reaction of voteResults.values()) {
                        if (reaction === '✔️') {
                            votedTrue++;
                        } else if (reaction === '✖️') {
                            votedFalse++;
                        } else if (reaction === '❔') {
                            votedMaybe++;
                        }
                    }
                    const votingResultEmbed = new MessageEmbed()
                        .setTitle(`ℹ️ ${question} ℹ️`)
                        .setColor('#4086bb')
                        .setFooter(`${message.author.username} created this poll.`)
                        .addField(`**VOTING RESULT**`, `✔️: ${progressBar(votedTrue, voteResults.size, 15)}\n❔: ${progressBar(votedMaybe, voteResults.size, 15)}\n✖️: ${progressBar(votedFalse, voteResults.size, 15)}`, true);

                    embedMessage.channel.send('Ballot box closed!', votingResultEmbed);
                })
            });
        });
    });
}

module.exports.help = {
    name: "poll",
    alias: [],
    description: "Create a simple yes or no poll",
    category: "General"
}