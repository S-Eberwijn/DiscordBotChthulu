module.exports = (bot, messageReaction, user) => {
    if (user.bot) return;
    const { message, emoji } = messageReaction;
    console.log(`${user.username} removed a reaction: ${emoji.name}`);
}