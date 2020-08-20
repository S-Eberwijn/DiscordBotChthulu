const Player = require('../../database/models/Player');
const PlayerCharacter = require('../../database/models/PlayerCharacter');
const { MessageEmbed } = require('discord.js');
//const { progressBar } = require("../../otherFunctions/ProgressBar");
const characterCreationQuestions = require('../../jsonDb/characterCreationQuestions.json');
const DnDClasses = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer'];



module.exports.run = async (bot, message, args) => {
    const characterCreateCategory = bot.channels.cache.find(c => c.name == "--CHARACTER CREATION--" && c.type == "category");
    let username = message.author.username;
    let userDiscrimintor = message.author.discriminator;
    let alreadyHasChannel = false;
    let newCharacterArray = [];
    let reactedEmoji = '';
    
    if (message.author.bot) return;

    if (characterCreateCategory) {
        message.guild.channels.cache.forEach(channel => {
            if (channel.name == `${username.toLowerCase()}-${userDiscrimintor}`) {
                message.channel.send("You already created a channel before!");
                alreadyHasChannel = true;
            }
        });

        if (alreadyHasChannel) return;

        message.guild.channels.create(`${username}-${userDiscrimintor}`, "text").then(async createdChannel => {
            createdChannel.setParent(characterCreateCategory, { lockPermission: false });
            createdChannel.updateOverwrite(message.channel.guild.roles.everyone, {
                VIEW_CHANNEL: false,
            });
            createdChannel.updateOverwrite(message.guild.roles.cache.find(role => role.name === 'Dungeon Master'), {
                VIEW_CHANNEL: true,
            });
            createdChannel.updateOverwrite(message.author, {
                VIEW_CHANNEL: true,
            });
            //createdChannel.setTopic(progressBar(0, 6, 34));
            let embedCreatedChannel = new MessageEmbed()
                .setTitle(`Hello, ${username}`)
                .setFooter(`Welcome to your character creation channel!`);
            createdChannel.send(embedCreatedChannel);

            characterCreationQuestion(characterCreationQuestions[0].question, createdChannel, newCharacterArray, message).then(() => {
                characterCreationQuestion(characterCreationQuestions[1].question, createdChannel, newCharacterArray, message).then(() => {
                    characterCreationQuestion(characterCreationQuestions[2].question, createdChannel, newCharacterArray, message).then(() => {
                        characterCreationQuestion(characterCreationQuestions[3].question, createdChannel, newCharacterArray, message).then(() => {
                            characterCreationQuestion(characterCreationQuestions[4].question, createdChannel, newCharacterArray, message).then(() => {
                                characterCreationQuestion(characterCreationQuestions[5].question, createdChannel, newCharacterArray, message).then(() => {

                                    createdChannel.send('Is this correct?');
                                    const newCharacterEmbed = new MessageEmbed()
                                        .setColor(0x333333)
                                        .setTitle(newCharacterArray[0])
                                        .setImage(newCharacterArray[newCharacterArray.length - 1])
                                        .setDescription(newCharacterArray[4])
                                        .addFields(
                                            { name: '\*\*RACE\*\*', value: `${newCharacterArray[1]}`, inline: true },
                                            { name: '\*\*CLASS\*\*', value: `${newCharacterArray[2]}`, inline: true },
                                            { name: '\*\*AGE\*\*', value: `${newCharacterArray[3]}`, inline: true }
                                        );
                                    createdChannel.send(newCharacterEmbed).then(async newCharacterEmbed => {

                                        await newCharacterEmbed.react('✔️');
                                        await newCharacterEmbed.react('✖️');

                                        const filter = (reaction, user) => {
                                            reactedEmoji = reaction.emoji.name;
                                            return (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️') && user.id === message.author.id;
                                        };

                                        newCharacterEmbed.awaitReactions(filter, {
                                            max: 1,
                                            time: 300000000,
                                            errors: ['time'],
                                        })
                                            .then(async () => {
                                                if (reactedEmoji === '✔️') {
                                                    await createdChannel.setName(newCharacterArray[0].toString());
                                                    //GO ON
                                                    let foundPlayer = await Player.findOne({ where: { player_id: message.author.id } })
                                                    if (foundPlayer) {
                                                        let foundCharacter = await PlayerCharacter.findOne({ where: { player_id: message.author.id, alive: 1 } });
                                                        if (foundCharacter) {
                                                            foundCharacter.alive = 0;
                                                            foundCharacter.save();
                                                        }
                                                    } else {
                                                        Player.create({
                                                            player_id: message.author.id,
                                                            player_name: message.author.username
                                                        });
                                                    }
                                                    PlayerCharacter.create({
                                                        player_id: message.author.id,
                                                        description: newCharacterArray[4],
                                                        race: newCharacterArray[1],
                                                        class: newCharacterArray[2],
                                                        name: newCharacterArray[0],
                                                        picture_url: newCharacterArray[newCharacterArray.length - 1],
                                                        age: newCharacterArray[3],
                                                        alive: 1
                                                    });
                                                    createdChannel.updateOverwrite(message.author, {
                                                        SEND_MESSAGES: false,
                                                        ADD_REACTIONS: false
                                                    });

                                                    //---
                                                    return;
                                                } else if (reactedEmoji === '✖️') {
                                                    createdChannel.delete().catch();
                                                    return;
                                                }
                                            })
                                    });
                                })
                            });
                        });
                    });
                });
            });
        })
    } else {
        message.channels.send("There is no category named \"--CHARACTER CREATION--\"!");
    }
}

module.exports.help = {
    name: "ticket",
    description: "Template for new commands",
    category: "TEST"
}


function characterCreationQuestion(question, createdChannel, newCharacterArray, message) {
    return new Promise(async function (resolve, reject) {
        if (question.toLowerCase().includes('name'.toLowerCase())) {
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(response => message.content, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    newCharacterArray.push(collected.first().content);
                    resolve(collected.first().content);
                }).catch(function () {
                    createdChannel.send('Times up!');
                })
            });
        } else if (question.toLowerCase().includes('class'.toLowerCase())) {
            const classFilter = response => {
                let wrongCounter = 0;
                if(response.author.id === '532524817740464138'){
                    return false;
                }
                characterCreationQuestions[2].answers.forEach(awnser => {
                    if(!(awnser.toLowerCase() === response.content.toLowerCase())){
                        wrongCounter++;
                    }
                });
                if(wrongCounter === characterCreationQuestions[2].answers.length){
                    console.log(response)
                    createdChannel.send('That is not a usable class!');
                }
                return ((characterCreationQuestions[2].answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) && response.author.id === message.author.id ));
            };
            createdChannel.send(question).then(() => {
                createdChannel.awaitMessages(classFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                   newCharacterArray.push(collected.first().content);
                   resolve(collected.first().content);
                }).catch(function () {
                    createdChannel.send('Times up!');
                });
            });
        } else if (question.toLowerCase().includes('race'.toLowerCase())) {
            //TODO


            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(response => message.content, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    newCharacterArray.push(collected.first().content);
                    resolve(collected.first().content);
                }).catch(function () {
                    createdChannel.send('Times up!');
                })
            });
        } else if (question.toLowerCase().includes('age'.toLowerCase())){
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(response => message.content, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    //if(typeof parseInt(collected.first().content) === 'number' && isNaN(parseInt(collected.first().content))){
                        newCharacterArray.push(collected.first().content);
                        resolve(collected.first().content);
                    //}
                }).catch(function () {
                    createdChannel.send('Times up!');
                })
            });
        }else if (question.toLowerCase().includes('short-story'.toLowerCase())){
            //TODO


            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(response => message.content, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    newCharacterArray.push(collected.first().content);
                    resolve(collected.first().content);
                }).catch(function () {
                    createdChannel.send('Times up!');
                })
            });
        }else if (question.toLowerCase().includes('picture'.toLowerCase())){
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(response => message.content, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    if(collected.first().content === ''){
                        newCharacterArray.push(collected.first().attachments.entries().next().value[1].url);
                        resolve(collected.first().attachments.entries().next().value[1].url)
                    } else {
                        newCharacterArray.push(collected.first().content);
                        resolve(collected.first().content);
                    }
                }).catch(function () {
                    createdChannel.send('Times up!');
                })
            });
        }

    });


}