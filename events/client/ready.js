const ShieldDefender = require("../../structures/ShieldDefender");
const Discord = require('discord.js')
const blacklist = require('../../structures/blacklist/bl.json')
const importprevname = require('manage-cache')
module.exports = {
    name: "ready",

    /**
     * @param {ShieldDefender} client
    */

    async run(client) {
       importprevname()
        console.log(`ShieldDefender Bot is ready! Logged in as ${client.user.tag}!`)
        client.application.commands.set(client.commands.toJSON())
        process.env.COLOR = require("discord.js").resolveColor(process.env.COLOR);
         client.user.setPresence({
  activities: [{ name: `Surveille vos serveurs`, type: Discord.ActivityType.Streaming, url: 'https://twitch.tv/oni145' }],
  status: 'dnd',
});
setInterval(() => {
blacklist.blacklist.forEach(entry => {
  client.guilds.cache.forEach(guild => {
      const member = guild.members.cache.get(entry.user_id);
      if (member) {
          member.ban({ reason: entry.reason })
              .then(() => console.log(`[BlackList] ${member.user.username} de la guild ${guild.name}`))
              .catch(console.error);
      }
  });
})
}, 300)

/*
client.guilds.cache.forEach(async (guild) => {
    if (guild.memberCount < 4) {
      console.log(`Leaving ${guild.name} (${guild.memberCount} members) as it has less than 4 members.`);
      await guild.leave();
    }
  });
*/
    }

}
