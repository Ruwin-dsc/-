const { ActionRowBuilder, ButtonBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "captcha",
    description: "Configure the captcha",
    userPermissions: ["Administrator"],

    async run(client, interaction) {

        
        const guildManager = client.managers.guildManager.getOrCreate(interaction.guild.id);
        const config = guildManager.get("captcha") || { roles: undefined, toggle: undefined, channel: undefined }
        const message = await interaction.reply({ embeds: [embed()], components: [buttons()], fetchReply: true })

        function embed() {
            return {
                title: `Captcha`,
                color: process.env.COLOR,
                fields: [
                    { name: `${client.botemojis.user} Roles`, value: config.roles?.map(async (r) => `<@&${r}>`).join(", ") || "None"},
                    { name: `${client.botemojis.role} Channel`, value: config.channel ? `<#${config.channel}>` : "None" },
                    { name: `Enabled` || "Activé", value: config.toggle ? client.botemojis.yes : client.botemojis.no }
                ]
            }
        }
        function update() {
            interaction.editReply({ embeds: [embed()], components: [buttons()] })
            guildManager.set("captcha", config).save()
        }
        function buttons() {
            return new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder({ label: "Role", custom_id: "role", style: 1 }),
                    new ButtonBuilder({ label: "Channel", custom_id: "channel", style: 1 }),
                    new ButtonBuilder({ label: config.toggle ? "Disabled" : "Enabled", style: config.toggle ? 4 : 3, custom_id: "toggle" })
                )
        }
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 300000
        })
        collector.on("collect", async (collected) => {
            const value = collected.customId
            if (value === "channel") {
                const menu = new ActionRowBuilder().setComponents(
                    new ChannelSelectMenuBuilder({ customId: "channel-menu", channelTypes: [0, 5], placeholder: "ShieldDefender" })
                )
                const reply = await collected.reply({ components: [menu], fetchReply: true })
                reply.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 120000, max: 1 }).on("collect", async (response) => {
                    const channel = response.values[0];
                    if (!channel) return response.reply({ content: await client.lang('captcha.button.invalidechannel', interaction.guild.id), ephemeral: true });
                    response.deferUpdate();
                    config.channel = channel;
                    collected.deleteReply();
                    update();
                })

            } else if (value === "toggle") {
                collected.deferUpdate();
                config.toggle = config.toggle ? false : true;
                update()
            } else if (value === "role") {
                const row = new ActionRowBuilder().setComponents(
                    new RoleSelectMenuBuilder()
                        .setPlaceholder("ShieldDefender")
                        .setCustomId("roles")
                )
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.yes) }, style: 3, custom_id: "ok" })
                )
                const reply = await collected.reply({ content: await client.lang('captcha.button.selecrole', interaction.guild.id), components: [row, button], fetchReply: true })
                const roles = [];
                reply.createMessageComponentCollector({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 120000
                }).on("collect", async (response) => {
                    const v = response.customId;
                    if (v === "roles") {
                        const role = response.roles.first();
                        if (role.managed) return response.reply({ content: await client.lang('captcha.button.invaliderole', interaction.guild.id), ephemeral: true });
                        if (!client.util.roleManageable(interaction.member, role, interaction.guild.ownerId)) return response.reply({ content: await client.lang('captcha.button.impossiblerole', interaction.guild.id), ephemeral: true });
                        response.deferUpdate();
                        roles.push(role.id);
                        response.message.edit({ content: `${await client.lang('captcha.button.selecrole', interaction.guild.id)}\n${roles.map((role) => `<@&${role}>`).join(" ,") || ""}`, components: [row, button], fetchReply: true })
                    } else if (v === "ok") {
                        config.roles = roles;
                        collected.deleteReply();
                        update();
                    }
                })
            }
        })
    }
}