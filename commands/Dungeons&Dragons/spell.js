const tagSelector = require('cheerio');
const request = require('request');
const baseURL = "https://www.dnd-spells.com/spell/"
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let stringMessage = args.join(' ');
    stringMessage = stringMessage.replace(/ /g, "-");
    let url = baseURL + stringMessage;
    request(url, function (error, response, body) {
        let data = ProcesRequest(body, url)
        if (data == "404") {
            ritual(message, stringMessage)
        }
        else {
            message.channel.send(EmbedSpellInMessage(data, stringMessage));
        }
    });
    return;
}

module.exports.help = {
    name: "spell",
    description: "Returns a spell in an embed",
    category: "Dungeons & Dragons"
}

function ProcesRequest(body) {
    let page = tagSelector.load(body);
    let content = page('h1[class=classic-title]').parent().text();
    let pageArray = content.split("\n");
    pageArray = pageArray.filter(item => item.trim());
    let casters = "";
    let spellDescription = "";
    let atHigherLevel = "Cannot be cast at higher level";
    let i = 8;

    if (pageArray.length <= 9) {
        return "404";
    }
    do {//append all spell description
        spellDescription += pageArray[i++].trim();
    } while ((!pageArray[i].includes("Page: ")) && (!pageArray[i].includes("At higher level")) && i < pageArray.length - 1)

    if (pageArray[i].includes("At higher level")) {
        i++
        atHigherLevel = "";
        do {//append at higherlevel
            atHigherLevel += pageArray[i++];
        } while (!pageArray[i].includes("Page: ") && i < pageArray.length - 1)
    }
    i += 2;
    do {//get all casters
        casters += pageArray[i++].trim() + " ";
    } while (pageArray[i].trim() != 'spell' && i < pageArray.length)

    return {
        "title": pageArray[1].trim(),
        "school": pageArray[2].split(" ").slice(-1)[0].trim(),
        "level": pageArray[3].split(":")[1].trim(),
        "castTime": pageArray[4].split(":")[1].trim(),
        "range": pageArray[5].split(":")[1].trim(),
        "comp": pageArray[6].split(":")[1].trim(),
        "duration": pageArray[7].split(":")[1].trim(),
        "description": spellDescription,
        "higherLevel": atHigherLevel,
        "casters": casters.substring(0, casters.length - 2)
    };
}

function ritual(message, stringMessage) {
    stringMessage = stringMessage.replace(/ /g, "-").toLowerCase() + "-ritual";
    let url = baseURL + stringMessage;
    request(url, function (error, response, body) {
        let data = ProcesRequest(body, url)
        /*console.log(data);*/
        if (data == "404") {
            message.channel.send("That spell was not found in the db");
        }
        else {
            message.channel.send(EmbedSpellInMessage(data, stringMessage));
        }

    });
    return;
}
function EmbedSpellInMessage(data, message) {
    let shortDescription;
    if (data.description.length > 1020) {
        shortDescription = `${data.description.substring(0, 1020)}...`
    } else {
        shortDescription = data.description;
    }
    let msg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(data.title)
        .setDescription(data.school)
        .setURL(baseURL + message)
        .attachFiles(['./images/DnD/SpellSigils/' + data.school + '.png'])
        .setThumbnail('attachment://' + data.school + '.png')
        .addFields(
            { name: '\u200B', value: `Level: **${data.level}**\nCasting time: **${data.castTime}**\nRange: **${data.range}**\nComponents: **${data.comp}**\nDuration: **${data.duration}**`, inline: false },
            { name: '\u200B', value: shortDescription, inline: false },
            { name: 'At Higher Level: ', value: `${data.higherLevel}`, inline: false },
        )
        .setTimestamp()
        .setFooter(data.casters);
    return msg;
}