const map = new Map();
const ms = require('ms');

module.exports = {
  name: "messageCreate",

  async run(client, message) {
    if (message.author.id === client.user.id) return;
    const channel = message.channel;
    if (!channel || !channel.guild) return;
    const guildManager = client.managers.guildManager.getOrCreate(message.guild?.id);
    const config = guildManager.get("automod")?.antispam;
    if (!config || !config?.toggle) return;
    let userdata = map.get(message.author.id) || 0;
    let bypass = false;
    if (message.author.id === client.user.id) return;
    if (message.author.id === message.guild.ownerId) bypass = true;
    if ((guildManager.get("crowns") || []).includes(message.author.id)) bypass = true;
    if (bypass) return;
    map.set(message.author.id, userdata + 1);
    if (userdata >= 3) {
      config.actions?.forEach(async (action) => {
        if (action === "reply") message.channel.send(`${message.author}, ${await client.lang('antiraid.antispam', message.guild.id)}`).then((m) => setTimeout(() => m.delete(), 1000));
        if (action === "delete") {
          channel.messages.fetch({ limit: 90 }).then((messages) => {
            const filtered = messages.filter(m => m.author.id === message.author.id);
            const deletedCount = filtered.size;
            const spamCount = userdata;
            
            console.log(`Messages supprimés : ${deletedCount}`);
            console.log(`Messages spam : ${spamCount}`);
            
            channel.bulkDelete(filtered).catch(() => { });
          }).catch(() => { });
        }
        if (action === "mute") {
          const reason = 'ShieldDefender AntiSpam';
          await message.member.timeout(ms('5s'), reason).catch(() => { });
        }
      });
    }

    setTimeout(() => {
      map.delete(message.author.id);
    }, 2500);
  }
}
