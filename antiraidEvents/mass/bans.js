const map = new Map()


const ShieldDefender = require("../../structures/ShieldDefender"),
    { GuildBan } = require("discord.js"),
    ms = require("ms")

module.exports = {
    name: "GUILD_BAN_ADD",

    /**
     * @param {ShieldDefender} client
     * @param {GuildBan} ban
     */

    async run(client, ban) {
        const guild = client.guilds.cache.get(ban.guild_id);
        const log = (await guild.fetchAuditLogs({ type: 22, limit: 1 })).entries.first();
        if (!log) return;
        const executor = log.executor;
        if (executor.id === client.user.id) return;
        const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
        const config = guildManager.get("antiraid")?.mass.bans;

        if (!config || !config?.toggle) return;
        const number = config.limit.split("/")[0];
        const time = config.limit.split("/")[1];
        const allItemPermissions = client.managers.permissionManager.filter((permissions, key) => key.split("-")[1] === guild.id && permissions.has("banMembers"));
        let bypass = false;


        const executorMember = await guild.members.fetch(executor.id);
        if (executor.id === client.user.id) return;
        if (executor.id === guild.ownerId) bypass = true;
        if ((guildManager.get("crowns") || []).includes(executor.id)) bypass = true;
        for await (const itemPermissions of allItemPermissions.values()) {
            if (itemPermissions.itemId === executor.id || executorMember.roles.cache.has(itemPermissions.itemId)) {
                bypass = true;
                break;
            }
        }
        if (bypass) return;
        const data = map.get(`${guild.id}-${executor.id}`) || []
        if (data.length + 1 >= number) {
            client.util.punish(guild, executorMember, config.punish, "ShieldDefender - Anti-MassBan", `${await client.lang('antiraid.massban.err', message.guild.id)}`, `${await client.lang('antiraid.massban.succes', message.guild.id)}`)
            map.delete(`${guild.id}-${executor.id}`)
            data.forEach((id) => {
                guild.members.unban(id, "ShieldDefender - Anti-MassBan").catch(() => { })
            })
        } else {
            map.set(`${guild.id}-${executor.id}`, [...data, ban.user.id])
        }
        if (data.length === 0) {
            setTimeout(() => {
                map.delete(`${guild.id}-${executor.id}`)
            }, ms("1" + time))
        }
    }
}