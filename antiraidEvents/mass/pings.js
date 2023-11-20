const map = new Map()

const ShieldDefender = require("../../structures/ShieldDefender");


module.exports = {
  name: "MESSAGE_CREATE",

  /**
   * @param {ShieldDefender} client
   */

  async run(client, data) {
    const guild = client.guilds.cache.get(data.guild_id);
    if (!guild || !guild.channels) return; 
    const channel = guild.channels.cache.get(data.channel_id);
    if (!channel) return;
    const message = channel.messages.fetch(data.id).then((m) => m).catch((e) => { })
    if (!message || !message.mentions?.everyone) return;
    const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
    const config = guildManager.get("antiraid")?.mass.pings;
    if (!config || !config?.toggle) return;
    const number = config.limit.split("/")[0];
    const time = config.limit.split("/")[1];
    const allItemPermissions = client.managers.permissionManager.filter((permissions, key) => key.split("-")[1] === guild.id && permissions.has("pings"));
    let bypass = false;
    if (message.author.id === client.user.id) return;
    if (message.author.id === guild.ownerId) bypass = true;
    if ((guildManager.get("crowns") || []).includes(executor.id)) bypass = true;
    for await (const itemPermissions of allItemPermissions.values()) {
      if (itemPermissions.itemId === message.author.id || message.member.roles.cache.has(itemPermissions.itemId)) {
        bypass = true;
        break;
      }
    }
    if (bypass) return;
    const userdata = map.get(message.author.id) || 0;
    if (userdata >= number) {
      client.util.punish(guild, message.member, config.punish, "ShieldDefender - Anti-MassPings", `${await client.lang('antiraid.massping.err', message.guild.id)}`, `${await client.lang('antiraid.massping.succes', message.guild.id)}`)
      map.delete(message.author.id)
      return;
    } else {
      map.set(message.author.id, data + 1)
    }
    if (userdata === 0) {
      setTimeout(() => {
        map.delete(message.author.id)
      }, require("ms")("1" + time))
    }
  }
} 