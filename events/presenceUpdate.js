module.exports = (bot, oldMember, newMember) => {
    console.log(`${newMember.user.tag} went ${newMember.user.presence.status}.`);
}