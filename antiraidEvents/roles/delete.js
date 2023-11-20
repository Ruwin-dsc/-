const { Role } = require("discord.js"),
    ShieldDefender = require("../../structures/ShieldDefender");

module.exports = {
    name: "GUILD_ROLE_DELETE",

    /**
     * @param {ShieldDefender} client
     * @param {Role} role
     */

    async run(client, role) {
        const guild = client.guilds.cache.get(role.guild_id);
        const log = (await guild.fetchAuditLogs({ type: 32, limit: 1 })).entries.first();
        if (!log) return;
        const executor = log.executor;
        if (executor.id === client.user.id) return;
        const guildManager = client.managers.guildManager.getOrCreate(guild?.id);
        const config = guildManager.get("antiraid")?.roles.delete;

        if (!config || !config?.toggle) return;
        const allItemPermissions = client.managers.permissionManager.filter((permissions, key) => key.split("-")[1] === guild.id && permissions.has("rolesDelete"));
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
        guild.roles.create({
            ...role.role,
            reason: "ShieldDefender - Anti-RoleDelete"
        }).catch(e => { });

        client.util.punish(guild, executorMember, config.punish, "ShieldDefender - Anti-RoleDelete", `${await client.lang('antiraid.roledelete.err', message.guild.id)}`, `${await client.lang('antiraid.roledelete.succes', message.guild.id)}`)
    }
}