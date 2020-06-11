module.exports = async (bot, messageReaction, user) => {

    let verifyChannel = bot.channels.cache.find(c => c.name == "verify" && c.type == "text");
    let generalChannel= bot.channels.cache.find(c => c.name == "general" && c.type == "text");

    let verifiedRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Verified');
    let newcomerRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Newcomer');
    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    if (user.bot) return;
    const { message, emoji } = messageReaction;

    if (verifyChannel) {
        if (message.channel.id === verifyChannel.id) {

            if (emoji.name === '✅') {
                messageReaction.message.guild.members.cache.get(user.id).roles.add(verifiedRole);
                messageReaction.message.guild.members.cache.get(user.id).roles.remove(newcomerRole);

                message.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
                message.react('✅');

                generalChannel.send(`Welcome to the server ${messageReaction.message.guild.members.cache.get(user.id)}!`);
            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
    }
}