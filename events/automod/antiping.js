const ms = require('ms');

module.exports = {
  name: "messageCreate",

  async run(client, message) {
    const guild = message.guild;
    const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
    const config = guildManager.get("automod")?.antieveryone;
    if (!config || !config.toggle) return;

    const everyoneRegex = /@(everyone|here)/g;
    if (!everyoneRegex.test(message.content)) return;

    const bypass = shouldBypass(message, guild, guildManager);
    if (bypass) return;

    await performActions(message, client, everyoneRegex);
  }
};

function shouldBypass(message, guild, guildManager) {
  const client = message.client;
  const authorId = message.author.id;
  const ownerId = guild.ownerId;
  const crowns = guildManager.get("crowns") || [];

  return authorId === client.user.id || authorId === ownerId || crowns.includes(authorId) || hasItemPermission(message.member, guild, client);
}

function hasItemPermission(member, guild, client) {
  const guildId = guild.id;
  const allItemPermissions = Array.from(client.managers.permissionManager).filter(([key]) => key.split("-")[1] === guildId && key.includes("everyone"));

  for (const [, itemPermissions] of allItemPermissions) {
    if (itemPermissions.itemId === member.id || member.roles.cache.has(itemPermissions.itemId)) {
      return true;
    }
  }

  return false;
}

async function performActions(message, client, everyoneRegex) {
  const config = message.guild.client.managers.guildManager.getOrCreate(message.guild.id).get("automod")?.antieveryone;

  config.actions?.forEach(async (action) => {
    if (action === "delete") message.delete().catch(() => { });
    if (action === "reply") message.channel.send(`${message.author}, ${await message.client.lang('antiraid.antieveryone', message.guild.id)}`).then((m) => setTimeout(() => m.delete(), 1000)).catch(() => { });
    if (action === "mute") {
        const reason = 'ShieldDefender Anti-Ping'
        await message.member.timeout(ms('5s'), reason).catch(() => { });
    }
    })
}
