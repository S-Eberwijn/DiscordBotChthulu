const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let sumOfResults = 0, resultPerDie = 0, typeOfDie = 0, toBeAddedValue = 0, correctedRollString;

    if (!args[0]) return message.channel.send(`You didn\'t provide any arguments!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

    let numberOfDice = parseInt(args[0].split("d")[0]);
    if (isNaN(numberOfDice)) return message.channel.send(`Number of dice you want to roll is not a number!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
    if (!(numberOfDice < 25)) return message.channel.send(`Number of dice you want to roll can not be higher than 24!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));


    correctedRollString = message.content.replace(/ /g, "").slice(1 + this.help.name.length);

    typeOfDie = parseInt(correctedRollString.split('d')[1]);
    correctedRollString = correctedRollString.slice(parseInt(correctedRollString.split('d')[0]).toString().length + 1 + parseInt(correctedRollString.split('d')[1]).toString().length)

    while (correctedRollString.charAt(0).includes('+') || correctedRollString.charAt(0).includes('-')) {
        if (!correctedRollString.charAt(1)) return message.channel.send(`You did not type anything after the operator`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));;
        switch (correctedRollString.charAt(0)) {
            case '+':
                toBeAddedValue += parseInt(correctedRollString.substring(1));
                break;
            case '-':
                toBeAddedValue -= parseInt(correctedRollString.substring(1));
                break;
        }
        correctedRollString = correctedRollString.slice(1 + parseInt(correctedRollString.substring(1)).toString().length);
    }

    let outputEmbed = new MessageEmbed();

    if (isNaN(typeOfDie)) return message.channel.send(`The type of die you entered is not correct!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
    if (typeOfDie % 2 != 0) return message.channel.send(`The type of die you want to roll must be even!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));


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
    if (toBeAddedValue > 0) {
        outputEmbed.setTitle(`${message.author.username} is rolling ${numberOfDice}d${typeOfDie} + ${Math.abs(toBeAddedValue)}!`);
        outputEmbed.addField(`RESULT`, `[${sumOfResults} + ${Math.abs(toBeAddedValue)}] = **${sumOfResults + toBeAddedValue}**`, false);
    } else if (toBeAddedValue < 0) {
        outputEmbed.setTitle(`${message.author.username} is rolling ${numberOfDice}d${typeOfDie} - ${Math.abs(toBeAddedValue)}!`);
        outputEmbed.addField(`RESULT`, `[${sumOfResults} - ${Math.abs(toBeAddedValue)}] = **${sumOfResults + toBeAddedValue}**`, false);
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