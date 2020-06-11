module.exports = async (bot, member) => {
    let newcomerRole = member.guild.roles.cache.find(role => role.name === 'Newcomer');

    //When a new person joins the server
    member.roles.add(newcomerRole);
}