const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let sumOfResults = 0, resultPerDie = 0, typeOfDie = 0, toBeAddedValue;

    if (!args[0]) return message.channel.send(`You didn\'t provide any arguments!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

    let numberOfDice = parseInt(args[0].split("d")[0]);
    if (!(typeof numberOfDice == 'number' && !isNaN(numberOfDice))) return message.channel.send(`Number of dice you want to roll is not a number!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
    if (!(numberOfDice < 25)) return message.channel.send(`Number of dice you want to roll can not be higher than 24!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

    let outputEmbed = new MessageEmbed();
    if (args[0].includes("+")) {
        typeOfDie = parseInt(args[0].split("d")[1].split('+')[0]);
        if (args[0].split("d")[1].split('+')[1]) {
            toBeAddedValue = parseInt(args[0].split("d")[1].split('+')[1]);
        } else if (args[1]) {
            toBeAddedValue = parseInt(args[1]);
        } else return message.channel.send(`You did not type anything after the \"+\"`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        if (!(typeof toBeAddedValue == 'number' && !isNaN(toBeAddedValue))) return message.channel.send(`The amount you want to add is not a number!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
    } else if (args[1] && args[1].includes('+')) {
        typeOfDie = parseInt(args[0].split("d")[1]);
        //TODO: make this work !roll 1d4 +2
        if (args[1].length > 1) {
            toBeAddedValue = parseInt(args[1].split('+')[1]);
        } else {
            if (!args[2]) return message.channel.send(`You did not type anything after the \"+\"`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
            toBeAddedValue = parseInt(args[2]);
        }
    } else {
        typeOfDie = parseInt(args[0].split("d")[1]);
    }

    if (!(typeof typeOfDie == 'number' && !isNaN(typeOfDie))) return message.channel.send(`The type of die you entered is not correct!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
    if (!(typeOfDie % 2 == 0)) return message.channel.send(`The type of die you want to roll must be even!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));


    for (let i = 0; i < numberOfDice; i++) {
        resultPerDie = calculateResultPerDie(typeOfDie);
        outputEmbed.addField(`Die #${i + 1}`, `${showRightColourOfRolledDie(resultPerDie, typeOfDie)}`, true);
        sumOfResults += resultPerDie;
    }

    // Adding blank space(s) if the number of dice rolled is not equal to a multiple of 3
    if (numberOfDice % 3 != 0) {
        for (let i = 0; i < 3 - numberOfDice % 3; i++) {
            outputEmbed.addField('\u200b', '\u200b', true);
        }
    }
    if (toBeAddedValue) {
        outputEmbed.setTitle(`${message.author.username} is rolling ${numberOfDice}d${typeOfDie} + ${toBeAddedValue}!`);
        outputEmbed.addField(`RESULT`, `[${sumOfResults} + ${toBeAddedValue}] = **${sumOfResults + toBeAddedValue}**`, false);
    } else {
        outputEmbed.setTitle(`${message.author.username} is rolling ${numberOfDice}d${typeOfDie}!`);
        outputEmbed.addField(`RESULT`, `**-= ${sumOfResults} =-**`, false);
    }
    message.channel.send(outputEmbed).then().catch(console.error);


}

module.exports.help = {
    name: "roll",
    description: "Roll ANY dice!",
    category: "Dungeons & Dragons"
}

function calculateResultPerDie(typeOfDie) {
    return Math.floor(Math.random() * ((typeOfDie - 1) + 1) + 1);
}

function showRightColourOfRolledDie(resultPerDie, typeOfDie) {
    if (resultPerDie == 1) {
        return `\`\`\`fix\n ${resultPerDie.toString()}\`\`\``;
    } else if (resultPerDie == typeOfDie) {
        return `\`\`\`xl\n ${resultPerDie.toString()}\`\`\``;
    } else {
        return `\`\`\`md\n ${resultPerDie.toString()}\`\`\``;
    }
}