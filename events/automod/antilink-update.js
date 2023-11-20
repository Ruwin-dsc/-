const ms = require('ms');

module.exports = {
    name: "messageUpdate",

    async run(client, oldMessage, newMessage) {
        const guild = oldMessage.guild;
        const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
        const config = guildManager.get("automod")?.antilink;
        if (!config || !config.toggle) return;

        const discordInviteRegex = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        if (!discordInviteRegex.test(oldMessage.content) && !urlRegex.test(oldMessage.content)) return;

        const bypass = shouldBypass(oldMessage, guild, guildManager);
        if (bypass) return;

        await performActions(oldMessage, client, discordInviteRegex);
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
    const allItemPermissions = client.managers.permissionManager.filter((permissions, key) => key.split("-")[1] === guildId && permissions.has("links"));

    for (const itemPermissions of allItemPermissions.values()) {
        if (itemPermissions.itemId === member.id || member.roles.cache.has(itemPermissions.itemId)) {
            return true;
        }
    }

    return false;
}

async function performActions(message, client, discordInviteRegex) {
    const config = message.guild.client.managers.guildManager.getOrCreate(message.guild.id).get("automod")?.antilink;

    for (const action of config.actions || []) {
        switch (action) {
            case "delete":
                if (discordInviteRegex.test(message.content)) {
                    message.delete().catch(() => { });
                }
                break;
            case "reply":
                const replyMessage = await message.channel.send(`${message.author}, ${await message.client.lang('antiraid.antilink', message.guild.id)}`);
                setTimeout(() => replyMessage.delete().catch(() => { }), 2000);
                break;
            case "mute":
                const reason = 'ShieldDefender AntiLink';
                await message.member.timeout(ms('5s'), reason).catch(() => { });
                break;
        }
    }
}
