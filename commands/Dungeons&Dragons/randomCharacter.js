const { MessageEmbed } = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

let url = "https://www.kassoon.com/dnd/backstory-generator/";
let nameURL = "https://www.behindthename.com/random/random.php?number=2&sets=1&gender=both&surname=&all=yes";

let outputField;
let charName, charRace, charClass, charFamily, charLifestyle;
let charBackground, charMotivation, charOrigin;


module.exports.run = async (bot, message, args) => {
    await request(nameURL, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            let $ = cheerio.load(body);

            $('center').each(function (index, element) {
                if ($(element).text()) {
                    text = $(element).text().replace(/(\r\n|\n|\r)/gm, '\n').split('\n');
                    charName = text[3].trim();
                }
            });
        }
    });
    await request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            let $ = cheerio.load(body);

            $('div[id="content"]').each(function (index, element) {
                if ($(element).text()) {
                    text = $(element).text().replace(/(\r\n|\n|\r)/gm, '\n').slice(362).split('\n');
                    charRace = text[0].split('Race: ')[1];
                    charFamily = text[6].split('Family: ')[1];
                    charLifestyle = text[7].split('Lifestyle: ')[1];
                    charBackground = text[12].split('Background: ')[1];
                    charMotivation = text[13].split('Motivation: ')[1];
                    charClass = text[14].split('Class: ')[1];
                    charOrigin = text[15].split('Origin: ')[1];
                }
            });
        }
        if (charName === undefined) {
            charName = "John Doe";
        }
        outputField = new MessageEmbed()
            //TODO: AUTOMATE NAME BY RACE
            //TODO: DECLARE MALE OR FEMALE
            .setTitle(`${charName}`)
            .attachFiles([`./images/DnD/ClassIcons/${charClass.trim()}.png`])
            .setThumbnail(`attachment://${charClass.trim()}.png`)
            .addFields(
                { name: '\_\_\*\*RACE\*\*\_\_', value: `${charRace}`, inline: true },
                { name: '\_\_\*\*CLASS\*\*\_\_', value: `${charClass}`, inline: true },
                { name: '\_\_\*\*BACKGROUND\*\*\_\_', value: `${charBackground}`, inline: true }
            )
            .addField('\_\_\*\*FAMILY\*\*\_\_', charFamily)
            .addField('\_\_\*\*LIFESTYLE\*\*\_\_', charLifestyle)
            .addField('\_\_\*\*ORIGIN\*\*\_\_', charOrigin)
            .addField('\_\_\*\*MOTIVATION\*\*\_\_', charMotivation)
            .setColor("#A9A9A9");
        message.channel.send(outputField);
    });
}

module.exports.help = {
    name: "randomCharacter",
    description: "Gives you a random generated character",
    category: "Dungeons & Dragons"
}



