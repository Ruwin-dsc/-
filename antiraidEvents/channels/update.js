const { Channel } = require("discord.js"),
    ShieldDefender = require("../../structures/ShieldDefender");

module.exports = {
    name: "CHANNEL_UPDATE",

    /**
     * @param {ShieldDefender} client
     * @param {Channel} channel
     */

    async run(client, channel) {
        const guild = client.guilds.cache.get(channel.guild_id);
        const log = (await guild.fetchAuditLogs({ type: 11, limit: 1 })).entries.first();
        if (!log) return;
        const executor = log.executor;
        if (!executor) return;
        if (executor.id === client.user.id) return;
        const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
        if (!guildManager) return;
        const config = guildManager.get("antiraid")?.channels.update;
        if (!config || !config?.toggle) return;
        const allItemPermissions = client.managers.permissionManager.filter((permissions, key) => key.split("-")[1] === guild.id && permissions.has("channelsUpdate"));
        let bypass = false;
        const executorMember = await guild.members.fetch(executor.id);
        if (executor.id === client.user.id) return;
        if (executor.id === guild.ownerId) bypass = true;
        if ((guildManager.get("crowns") || []).includes(executor.id)) bypass = true;
        for await (const itemPermissions of allItemPermissions.values()) {
            if (itemPermissions.itemId === executor.id || executorMember.channels.cache.has(itemPermissions.itemId)) {
                bypass = true;
                break;
            }
        }
        if (bypass) return;
        let parent_id = channel.parent_id;

        guild.channels.edit(channel.id, {
            ...channel,
            reason: "ShieldDefender - Anti-ChannelUpdate"
        })
        client.util.punish(guild, executorMember, config.punish, "ShieldDefender - Anti-ChannelUpdate", `${await client.lang('antiraid.channelupdate.err', message.guild.id)}`, `${await client.lang('antiraid.channelupdate.succes', message.guild.id)}`)
    }
}