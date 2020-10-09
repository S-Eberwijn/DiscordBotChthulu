const { updateServerStatChannels } = require('../otherFunctions/updateServerStatChannel.js');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = async (bot, member) => {
    const newcomerRole = member.guild.roles.cache.find(role => role.name === 'Newcomer');
    const welcomeZoneChannel = bot.channels.cache.find(c => c.name == "general" && c.type == "text");

    // Update Server Stats channels
    //updateServerStatChannels(bot, member);

    //When a new person joins the server
    if (newcomerRole) member.roles.add(newcomerRole);
    if (welcomeZoneChannel) welcomeZoneChannel.send(`<@${member.id}>`,await createWelcomeAttachment(member));

}

async function createWelcomeAttachment(member){
    
    const canvas = Canvas.createCanvas(800, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./images/WelcomeCanvas/test.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed under the member's display name
    ctx.font = '34px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Welcome to the ${member.guild.name}`, canvas.width / 3.6, canvas.height / 1.1);
    ctx.lineWidth = 0.5;
    ctx.strokeText(`Welcome to the ${member.guild.name}`, canvas.width / 3.6, canvas.height / 1.1);

    // Number of user in the server
    ctx.font = '34px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`#${member.guild.members.cache.filter(m => !m.user.bot).size}`, canvas.width / 1.08, canvas.height / 5.2);
    ctx.lineWidth = 0.5;
    ctx.strokeText(`#${member.guild.members.cache.filter(m => !m.user.bot).size}`, canvas.width/ 1.08, canvas.height / 5.2);


    // Add an exclamation point here and below
    ctx.strokeStyle = 'black';
    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName}!`, canvas.width / 3.5, canvas.height / 2.8);
    ctx.lineWidth = 1;
    ctx.strokeText(`${member.displayName}!`, canvas.width / 3.5, canvas.height / 2.8);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(125, 125, 105, 105, 0, 0, Math.PI * 2, false);
    ctx.fill();

    // Pick up the pen
    ctx.beginPath();
    // Start the arc to form a circle
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    // Put the pen down
    ctx.closePath();
    // Clip off the region you drew on
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    return new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
}

// Pass the entire Canvas object because you'll need to access its width, as well its context
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};