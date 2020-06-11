const discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

let url = "https://www.kassoon.com/dnd/backstory-generator/";
let badges = [];

let outputField;
let charRace, charBirthplace, charClass, charParents, charFamily, charLifestyle;
let charChildhood, charBackground, charMotivation, charOrigin, charAge;


module.exports.run = async (bot, message, args) => {
    request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            let $ = cheerio.load(body);

            $('div[id="content"]').each(function (index, element) {
                if ($(element).text()) {
                    text = $(element).text().replace(/(\r\n|\n|\r)/gm, '\n').slice(362).split('\n');
                    charRace = text[0].split('Race: ')[1];
                    //charBirthplace = text[1].split('Birthplace: ')[1];
                    charAge = text[2].split('Current Age: ')[1];
                    //charParents = text[5].split('Parents: ')[1];
                    charFamily = text[6].split('Family: ')[1];
                    charLifestyle = text[7].split('Lifestyle: ')[1];
                    charChildhood = text[8].split('Childhood: ')[1];
                    charBackground = text[12].split('Background: ')[1];
                    charMotivation = text[13].split('Motivation: ')[1];
                    charClass = text[14].split('Class: ')[1];
                    charOrigin = text[15].split('Origin: ')[1];
                }
            });
            outputField = new discord.MessageEmbed()
            //TODO: AUTOMATE NAME
                .setDescription("A new character idea!")
            //TODO: AUTOMATE CLASS ICON
                .setThumbnail('https://cdn.discordapp.com/attachments/711689970456461372/720323454431133716/Class_Icon_-_Artificer.png')
                .addFields(
                    { name: '\_\_\*\*RACE\*\*\_\_', value: `${charRace}`, inline: true },
                    { name: '\_\_\*\*CLASS\*\*\_\_', value: `${charClass}`, inline: true },
                    { name: '\_\_\*\*BACKGROUND\*\*\_\_', value: `${charBackground}`, inline: true }
                )
                .addField('\_\_\*\*FAMILY\*\*\_\_', charFamily)
                .addField('\_\_\*\*LIFESTYLE\*\*\_\_', charLifestyle)
                .addField('\_\_\*\*ORIGIN\*\*\_\_', charOrigin)
                .addField('\_\_\*\*MOTIVATION\*\*\_\_', charMotivation);
        }
        message.channel.send(outputField);
    });
}

module.exports.help = {
    name: "nextCharacter",
    description: "Gives you a next character to build",
    category: "Dungeons & Dragons"
}




