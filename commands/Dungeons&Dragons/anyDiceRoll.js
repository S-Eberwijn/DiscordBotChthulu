const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let sumOfResults = 0;
    let resultPerDie = 0;
    let includesSum = 0;
    let sumPosition = 0;

    if (args[0]) {
        if (args[0].includes("d")) {
            let numberOfDice = parseInt(args[0].split("d")[0]);
            if (typeof numberOfDice == 'number' && !isNaN(numberOfDice)) {
                let typeOfDie = parseInt(args[0].split("d")[1]);
                if (typeof typeOfDie == 'number' && !isNaN(typeOfDie)) {
                    if (typeOfDie % 2 == 0) {
                        outputEmbed = new MessageEmbed();
                        for (let i = 0; i < numberOfDice; i++) {
                            resultPerDie = Math.floor(Math.random() * ((typeOfDie - 1) + 1) + 1);
                            sumOfResults += resultPerDie;

                            if (resultPerDie == 1) {
                                outputEmbed.addField(`Die #${i + 1}`, `\`\`\`fix\n ${resultPerDie.toString()}\`\`\``, true);
                            } else if (resultPerDie == typeOfDie) {
                                outputEmbed.addField(`Die #${i + 1}`, `\`\`\`xl\n ${resultPerDie.toString()}\`\`\``, true);
                            } else {
                                outputEmbed.addField(`Die #${i + 1}`, `\`\`\`md\n ${resultPerDie}\`\`\``, true);
                            }
                        }

                        if (numberOfDice % 3 != 0) {
                            for (let i = 0; i < 3 - numberOfDice % 3; i++) {
                                outputEmbed.addField('\u200b', '\u200b', true);
                            }
                        }
                        for (let i = 0; i < args.length; i++) {
                            if (args[i].includes("+")) {
                                includesSum = 1;
                                sumPosition = i;
                            }
                        }

                        if (includesSum == 1) {
                            let toBeAddedValue = parseInt(args[sumPosition + 1]);
                            if (toBeAddedValue) {
                                if (typeof toBeAddedValue == 'number' && !isNaN(toBeAddedValue)) {
                                    outputEmbed.setTitle(`${message.author.username} is rolling ${numberOfDice}d${typeOfDie} + ${toBeAddedValue}!`);
                                    outputEmbed.addField(`Result`, `[${sumOfResults} + ${toBeAddedValue}] = **${sumOfResults + toBeAddedValue}**`, false);
                                }
                            }
                        } else {
                            outputEmbed.setTitle(`${message.author.username} is rolling ${numberOfDice}d${typeOfDie}!`);
                            outputEmbed.addField(`Result`, `**${sumOfResults}**`, false);
                        }
                        message.channel.send(outputEmbed).then().catch(console.error);
                    }

                } else {
                    message.channel.send(`The type of die you entered is not correct!`)
                }
            } else {
                message.channel.send(`Number of dice you want to roll is not a number!`)
            }
        } else {
            message.channel.send(`2. Use e.g. \"!${this.help.name} 1d4\"`);
        }
    } else {
        message.channel.send(`1. Use e.g. \"!${this.help.name} 1d4\"`);
    }
}

module.exports.help = {
    name: "roll",
    description: "Roll ANY dice!",
    category: "Dungeons & Dragons"
}