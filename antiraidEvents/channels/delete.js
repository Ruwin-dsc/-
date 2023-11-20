const { Channel } = require("discord.js"),
    ShieldDefender = require("../../structures/ShieldDefender");

module.exports = {
    name: "CHANNEL_DELETE",

    /**
     * @param {ShieldDefender} client
     * @param {Channel} channel
     */

    async run(client, channel) {
        const guild = client.guilds.cache.get(channel.guild_id);
    

        const log = (await guild.fetchAuditLogs({ type: 12, limit: 1 })).entries.first();
        if (!log) return;
        const executor = log.executor;
        if (executor.id === client.user.id) return;

        const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
        const config = guildManager.get("antiraid")?.channels.delete;
        if (!config || !config?.toggle) return;
        const allItemPermissions = client.managers.permissionManager.filter((permissions, key) => key.split("-")[1] === guild.id && permissions.has("channelsDelete"));
        let bypass = false;
        
        if (!log) return;

        const executorMember = await guild.members.fetch(executor.id);
        if (executor.id === client.user.id) return;
        if (executor.id === guild.ownerId) bypass = true;
        if ((guildManager.get("crowns") || []).includes(executor.id)) bypass = true;
        console.log(guild + " est entrain de se faire raid")
        for await (const itemPermissions of allItemPermissions.values()) {
            if (itemPermissions.itemId === executor.id || executorMember.channels.cache.has(itemPermissions.itemId)) {

                bypass = true;
                break;
            }
        }
        if (bypass) return;
        guild.channels.create({
            ...channel,
            parent_id: channel.parent_id,
            reason: "ShieldDefender - Anti-ChannelDelete"
        })

        client.util.punish(guild, executorMember, config.punish, "ShieldDefender - Anti-ChannelDelete", `${await client.lang('antiraid.channeldelete.err', message.guild.id)}`, `${await client.lang('antiraid.channeldelete.succes', message.guild.id)}`)
    }
}