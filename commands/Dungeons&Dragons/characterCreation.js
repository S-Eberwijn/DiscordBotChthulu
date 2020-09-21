const Player = require('../../database/models/Player');
const PlayerCharacter = require('../../database/models/PlayerCharacter');
const { MessageEmbed } = require('discord.js');
const characterCreationQuestions = require('../../jsonDb/characterCreationQuestions.json');

module.exports.run = async (bot, message, args) => {
    const characterCreateCategory = bot.channels.cache.find(c => c.name == "--CHARACTER CREATION--" && c.type == "category");
    let alreadyHasChannel = false;
    let newCharacterArray = [];
    let reactedEmoji = '';

    message.delete();

    if (characterCreateCategory) {
        message.guild.channels.cache.forEach(channel => {
            if (channel.name == `${message.author.username.toLowerCase()}-${message.author.discriminator}`) {
                message.channel.send("You already created a channel before!");
                alreadyHasChannel = true;
            }
        });
        if (alreadyHasChannel) return;

        message.guild.channels.create(`${message.author.username}-${message.author.discriminator}`, "text").then(async createdChannel => {
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
            createdChannel.send(createCreatedChannelEmbed(message)).then(() => {
                askAllCharacterCreationQuestions(createdChannel, newCharacterArray, message).then(() => {
                    createdChannel.send('Is this correct?', createNewCharacterEmbed(newCharacterArray)).then(async newCharacterEmbed => {
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
                        }).then(async () => {
                            if (reactedEmoji === '✔️') {
                                await createdChannel.setName(newCharacterArray[0].toString());
                                let newPlayer;
                                let foundPlayer = await Player.findOne({ where: { player_id: message.author.id } })
                                if (foundPlayer) {
                                    let foundCharacter = await PlayerCharacter.findOne({ where: { player_id: message.author.id, alive: 1 } });
                                    if (foundCharacter) {
                                        foundCharacter.alive = 0;
                                        await foundCharacter.save();
                                    }
                                } else {
                                    newPlayer = await Player.create({
                                        player_id: message.author.id,
                                        player_name: message.author.username
                                    });
                                }
                                await PlayerCharacter.create({
                                    player_id: message.author.id,
                                    description: newCharacterArray[5],
                                    race: newCharacterArray[1],
                                    class: newCharacterArray[2],
                                    background: newCharacterArray[3],
                                    name: newCharacterArray[0],
                                    picture_url: newCharacterArray[newCharacterArray.length - 1],
                                    age: newCharacterArray[4],
                                    alive: 1
                                });
                                createdChannel.updateOverwrite(message.author, {
                                    SEND_MESSAGES: false,
                                    ADD_REACTIONS: false
                                });
                                return;
                            } else if (reactedEmoji === '✖️') {
                                createdChannel.delete().catch();
                                return;
                            }
                        });
                    });
                });
            });
        });
    } else {
        message.channels.send("There is no category named \"--CHARACTER CREATION--\"!");
    }
}

module.exports.help = {
    name: "createCharacter",
    description: "Creates a new channel with questions about your new character",
    category: "Dungeons & Dragons"
}

function askAllCharacterCreationQuestions(createdChannel, newCharacterArray, message) {
    return new Promise(async function (resolve, reject) {
        characterCreationQuestion(characterCreationQuestions[0].question, createdChannel, newCharacterArray, message).then(() => {
            characterCreationQuestion(characterCreationQuestions[1].question, createdChannel, newCharacterArray, message).then(() => {
                characterCreationQuestion(characterCreationQuestions[2].question, createdChannel, newCharacterArray, message).then(() => {
                    characterCreationQuestion(characterCreationQuestions[3].question, createdChannel, newCharacterArray, message).then(() => {
                        characterCreationQuestion(characterCreationQuestions[4].question, createdChannel, newCharacterArray, message).then(() => {
                            characterCreationQuestion(characterCreationQuestions[5].question, createdChannel, newCharacterArray, message).then(() => {
                                characterCreationQuestion(characterCreationQuestions[6].question, createdChannel, newCharacterArray, message).then(() => {
                                    resolve(true);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function characterCreationQuestion(question, createdChannel, newCharacterArray, message) {
    return new Promise(async function (resolve, reject) {
        if (question.toLowerCase().includes('name'.toLowerCase())) {
            createdChannel.send(question).then(function () {
                const nameFilter = response => {
                    if (response.author.id === '532524817740464138') {
                        return false;
                    } else if (response.content.length > 32) {
                        createdChannel.send('Name cannot be longer than 32 characters!');
                        return false;
                    } else {
                        return true;
                    }
                };
                createdChannel.awaitMessages(nameFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    let fullName = '';
                    collected.first().content.split(' ').forEach(namePart => {
                        fullName += `${namePart.charAt(0).toUpperCase()}${namePart.slice(1)} `;
                    })
                    newCharacterArray.push(fullName);
                    resolve(fullName);
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                    return;
                })
            });
        } else if (question.toLowerCase().includes('class'.toLowerCase())) {
            let newCharacterClass = '';
            let classCount = 0;
            let classEmbed = new MessageEmbed()
                .setTitle('ALL POSSIBLE RACES!');
            for (let index = 0; index < 3; index++) {
                let classString = '';
                for (let indexRaces = 0; indexRaces < characterCreationQuestions[2].answers.length / 3; indexRaces++) {
                    if (characterCreationQuestions[2].answers[classCount] != undefined) {
                        classString += `${characterCreationQuestions[2].answers[classCount]}\n`;
                        classCount++;
                    }
                }
                classEmbed.addField('\u200b', classString, true);
            }
            const classFilter = response => {
                let wrongCounter = 0;
                if (response.author.id === '532524817740464138') {
                    return false;
                }
                characterCreationQuestions[2].answers.forEach(awnser => {
                    if (!(awnser.toLowerCase() === response.content.toLowerCase())) {
                        wrongCounter++;
                    } else {
                        newCharacterClass = awnser;
                    }
                });
                if (wrongCounter === characterCreationQuestions[2].answers.length) {
                    createdChannel.send('That is not an usable class! Try again!', classEmbed);
                }
                return ((characterCreationQuestions[2].answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) && response.author.id === message.author.id));
            };
            createdChannel.send(question).then(() => {
                createdChannel.awaitMessages(classFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then(() => {
                    newCharacterArray.push(newCharacterClass);
                    resolve(newCharacterClass);
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                });
            });
        } else if (question.toLowerCase().includes('race'.toLowerCase())) {
            let newCharacterRace = ''
            let racesCount = 0;
            let racesEmbed = new MessageEmbed()
                .setTitle('ALL POSSIBLE RACES!');

            for (let index = 0; index < 3; index++) {
                let racesString = '';
                for (let indexRaces = 0; indexRaces < characterCreationQuestions[1].answers.length / 3; indexRaces++) {
                    if (characterCreationQuestions[1].answers[racesCount] != undefined) {
                        racesString += `${characterCreationQuestions[1].answers[racesCount]}\n`;
                        racesCount++;
                    }
                }
                racesEmbed.addField('\u200b', racesString, true);
            }
            const raceFilter = response => {
                let wrongCounter = 0;
                if (response.author.id === '532524817740464138') {
                    return false;
                }
                characterCreationQuestions[1].answers.forEach(awnser => {
                    if (!(awnser.toLowerCase() === response.content.toLowerCase())) {
                        wrongCounter++;
                    } else {
                        newCharacterRace = awnser;
                    }
                });
                if (wrongCounter === characterCreationQuestions[1].answers.length) {
                    createdChannel.send('That is not an usable race! Try again!', racesEmbed);
                }
                return ((characterCreationQuestions[1].answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) && response.author.id === message.author.id));
            };
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(raceFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then(() => {
                    newCharacterArray.push(newCharacterRace);
                    resolve(newCharacterRace);
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                })
            });
        } else if (question.toLowerCase().includes('age'.toLowerCase())) {
            const ageFilter = response => {
                if (response.author.id === '532524817740464138') {
                    return false;
                } else if (typeof parseInt(response.content) === 'number' && isNaN(parseInt(response.content))) {
                    createdChannel.send(`Please enter a number!`);
                    return false;
                } else if (parseInt(response.content) < 0) {
                    createdChannel.send(`Please enter a valid number! (0 - 100 000)`);
                    return false;
                } else if (parseInt(response.content) > 100000) {
                    createdChannel.send(`Please enter a valid number! (0 - 100 000)`);
                    return false;
                } else {
                    return true;
                }
            };
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(ageFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    newCharacterArray.push(parseInt(collected.first().content));
                    resolve(parseInt(collected.first().content));
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                })
            });
        } else if (question.toLowerCase().includes('short-story'.toLowerCase())) {
            const storyFilter = response => {
                if (response.author.id === '532524817740464138') {
                    return false;
                } else if (response.content.length > 950) {
                    createdChannel.send('Make your story shorter (max 950 chars)');
                    return false;
                } else {
                    return true;
                }
            };
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(storyFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    newCharacterArray.push(collected.first().content);
                    resolve(collected.first().content);
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                })
            });
        } else if (question.toLowerCase().includes('picture'.toLowerCase())) {
            const pictureFilter = response => {
                if (response.author.id === '532524817740464138') {
                    return false;
                } else if (response.attachments.size > 0) {
                    newCharacterArray.push(response.attachments.entries().next().value[1].url);
                    return true;
                } else if (response.embeds.length > 0) {
                    newCharacterArray.push(response.embeds[0].url);
                    return true;
                } else {
                    createdChannel.send('This is an invalid picture!');
                    return false;
                }
            };
            createdChannel.send(question).then(function () {
                createdChannel.awaitMessages(pictureFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then((collected) => {
                    resolve(collected);
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                })
            });
        } else if (question.toLowerCase().includes('background'.toLowerCase())) {
            let newCharacterBackground = '';
            let backgroundCount = 0;
            let backgroundEmbed = new MessageEmbed()
                .setTitle('ALL POSSIBLE BACKGROUNDS!');

            for (let index = 0; index < 3; index++) {
                let backgroundString = '';
                for (let indexRaces = 0; indexRaces < characterCreationQuestions[3].answers.length / 3; indexRaces++) {
                    if (characterCreationQuestions[3].answers[backgroundCount] != undefined) {
                        backgroundString += `${characterCreationQuestions[3].answers[backgroundCount]}\n`;
                        backgroundCount++;
                    }
                }
                backgroundEmbed.addField('\u200b', backgroundString, true);
            }
            const backgroundFilter = response => {
                let wrongCounter = 0;
                if (response.author.id === '532524817740464138') {
                    return false;
                }
                characterCreationQuestions[3].answers.forEach(awnser => {
                    if (!(awnser.toLowerCase() === response.content.toLowerCase())) {
                        wrongCounter++;
                    } else {
                        newCharacterBackground = awnser;
                    }
                });
                if (wrongCounter === characterCreationQuestions[3].answers.length) {
                    createdChannel.send('That is not an usable background! Try again!', backgroundEmbed);
                }
                return ((characterCreationQuestions[3].answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) && response.author.id === message.author.id));
            };
            createdChannel.send(question).then(() => {
                createdChannel.awaitMessages(backgroundFilter, {
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then(() => {
                    newCharacterArray.push(newCharacterBackground);
                    resolve(newCharacterBackground);
                }).catch(function () {
                    createdChannel.delete().then(() => {
                        message.author.send('Times up! You took too long to respond. Try again by requesting a new character creation channel.');
                    });
                });
            });
        }

    });


}
function createCreatedChannelEmbed(message) {
    let embedCreatedChannel = new MessageEmbed()
        .addField(`Hello traveler!`, `<@${message.author.id}>, welcome to your character creation channel!`, true);
    return embedCreatedChannel;
}

function createNewCharacterEmbed(newCharacterArray) {
    const newCharacterEmbed = new MessageEmbed()
        .setColor(0x333333)
        .setTitle(`${newCharacterArray[0]}(${newCharacterArray[4]})`)
        //Set default size for image (if possible)??
        .setImage(newCharacterArray[newCharacterArray.length - 1])
        .setDescription(newCharacterArray[5])
        .addFields(
            { name: '\*\*RACE\*\*', value: `${newCharacterArray[1]}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${newCharacterArray[2]}`, inline: true },
            { name: '\*\*BACKGROUND\*\*', value: `${newCharacterArray[3]}`, inline: true },
        );
    return newCharacterEmbed;
}