const { MessageEmbed } = require('discord.js');
let sumOfResults = 0, resultsPerDieType = [];
module.exports.run = async (bot, message, args) => {
    resetResults();
    let typeOfDie = 0, toBeAddedValue = 0, correctedRollString, embedTitleString = `${message.author.username} is rolling `, outputEmbed = new MessageEmbed();
    correctedRollString = message.content.replace(/ /g, "").slice(message.content.indexOf(message.content.match(/\d/)) - 1);

    let diceRollsArray = correctedRollString.match(/\d{1,24}d\d{1,100}/g);
    if (typeof diceRollsArray === 'undefined' || diceRollsArray === null) return message.channel.send(`Incorrect arguments!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

    //Every Dice That Has To Be Rolled!
    for (let i = 0; i < diceRollsArray.length; i++) {
        typeOfDie = parseInt(diceRollsArray[i].split('d')[1]);
        numberOfDice = parseInt(diceRollsArray[i].split('d')[0]);

        //Checks on each dice roll entry
        //if (typeOfDie % 2 != 0) return message.channel.send(`The type of die you want to roll must be even!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        if (!(getTotalAmountOfDiceToRoll(diceRollsArray) < 25)) return message.channel.send(`Number of dice you want to roll can not be higher than 24!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

        switch (correctedRollString.charAt(0)) {
            default:
                rollDice(numberOfDice, typeOfDie, outputEmbed);
                embedTitleString += `${diceRollsArray[i]}`;
                correctedRollString = correctedRollString.slice(diceRollsArray[i].length);
                break;
            case '+':
                rollDice(numberOfDice, typeOfDie, outputEmbed); embedTitleString += ` + ${diceRollsArray[i]}`;
                correctedRollString = correctedRollString.slice(diceRollsArray[i].length + 1);
                break;
            case '-':
                rollDice(numberOfDice, typeOfDie, outputEmbed, false);
                embedTitleString += ` - ${diceRollsArray[i]}`;
                correctedRollString = correctedRollString.slice(diceRollsArray[i].length + 1);
                break;
        }
    }

    //Determine the modifier
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

    // Adding blank space(s) if the number of dice rolled is not equal to a multiple of 3
    if (getTotalAmountOfDiceToRoll(diceRollsArray) % 3 != 0) {
        for (let i = 0; i < 3 - getTotalAmountOfDiceToRoll(diceRollsArray) % 3; i++) {
            outputEmbed.addField('\u200b', '\u200b', true);
        }
    }

    //Depending on what the modifiers result is, you'll get a different outcome
    setEmbedTitle(embedTitleString, toBeAddedValue, outputEmbed);

    //Send the embed to the channel the command was typed in
    message.channel.send(outputEmbed).catch(console.error);
}

module.exports.help = {
    name: "roll",
    alias: ["r"],
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

function rollDice(numberOfDice, typeOfDie, outputEmbed, shouldBeAdding) {
    shouldBeAdding = (typeof shouldBeAdding !== 'undefined') ? shouldBeAdding : true;
    let totalPerSet = 0;
    for (let i = 0; i < numberOfDice; i++) {
        let resultPerDie = calculateResultPerDie(typeOfDie);
        outputEmbed.addField(`d${typeOfDie}`, `${showRightColourOfRolledDie(resultPerDie, typeOfDie)}`, true);
        if (shouldBeAdding) {
            sumOfResults += resultPerDie;
            totalPerSet += resultPerDie;
        } else {
            sumOfResults -= resultPerDie;
            totalPerSet -= resultPerDie;
        }
    }
    resultsPerDieType.push(totalPerSet);

}

function resetResults() {
    sumOfResults = 0;
    resultsPerDieType = [];
}

function getTotalAmountOfDiceToRoll(diceRollsArray) {
    let totalNumberOfDice = 0;
    diceRollsArray.forEach(roll => {
        totalNumberOfDice += parseInt(roll.split('d')[0]);
    });
    return totalNumberOfDice
}

function setEmbedTitle(embedTitleString, toBeAddedValue, outputEmbed) {
    if (toBeAddedValue > 0) {
        outputEmbed.setTitle(`${embedTitleString} + ${Math.abs(toBeAddedValue)}!`);
        outputEmbed.addField(`RESULT`, `[${getResultsPerType()} + ${Math.abs(toBeAddedValue)}] = **${sumOfResults + toBeAddedValue}**`, false);
    } else if (toBeAddedValue < 0) {
        outputEmbed.setTitle(`${embedTitleString} - ${Math.abs(toBeAddedValue)}!`);
        outputEmbed.addField(`RESULT`, `[${getResultsPerType()} - ${Math.abs(toBeAddedValue)}] = **${sumOfResults + toBeAddedValue}**`, false);
    } else {
        outputEmbed.setTitle(`${embedTitleString}!`);
        outputEmbed.addField(`RESULT`, `[${getResultsPerType()}] = **${sumOfResults}**`, false);
    }
}

function getResultsPerType() {
    let returnString = `${resultsPerDieType[0]}`;
    for (let i = 1; i < resultsPerDieType.length; i++) {
        if (resultsPerDieType[i] >= 0) returnString += ` + ${Math.abs(resultsPerDieType[i])}`;
        if (resultsPerDieType[i] < 0) returnString += ` - ${Math.abs(resultsPerDieType[i])}`;

    }
    return returnString;
}