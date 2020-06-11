const { MessageEmbed } = require('discord.js');


module.exports.run = async (bot, message, args) => {
    //if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have admin rights!')

    let question = message.content.slice(process.env.PREFIX.length + 5)
    if(!question){
        return message.channel.send('You did not provide a question!');
    }
    const Embed = new MessageEmbed()
        .setTitle(`ℹ️ ${question}`)
        .setColor('#4086bb')
        .setFooter(`${message.author.username} created this poll.`);

    message.delete().then(async () => {
        await message.channel.send(Embed).then(async message=>{
            await message.react('👎');
            await message.react('👍');
        });
    });
}

module.exports.help = {
    name: "poll",
    description: "Create a simple yes or no poll",
    category: "General"
}