const { CommandInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "automod",
    description: "Configure the automod system",

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const guildManager = client.managers.guildManager.getOrCreate(interaction.guild.id);
        const config = guildManager.get("automod") || { antilink: { toggle: false, actions: [] }, antispam: { toggle: false, actions: [] }, antieveryone: { toggle: false, actions: [] },}
        if (
            interaction.user.id !== interaction.guild.ownerId &&
            !(guildManager.get("crowns") || []).includes(interaction.user.id)
        )
            return interaction.reply({
                content: `${client.botemojis.no} | ${await client.lang('noperm', interaction.guild.id)}`,
                ephemeral: true,
            });

        config.antilink ? null : config.antilink = { toggle: false, actions: [] }
        config.antispam ? null : config.antispam = { toggle: false, actions: [] }
        config.antieveryone ? null : config.antieveryone = { toggle: false, actions: [] }
        chooseaOption()
        async function chooseaOption() {
            actlink = [...(config.antilink?.actions || [])]
            antispam = [...(config.antispam?.actions || [])]
            antieveryone = [...(config.antieveryone?.actions || [])]

            let embed = {
                title: "Automod",
                description: `
                **Anti-Spam**\n┖ ${config.antispam.toggle ? `${client.botemojis.yes} \`${await client.lang('enable', interaction.guild.id)}\`` : `${client.botemojis.no} \`${await client.lang('disable', interaction.guild.id)}\``}\n**Actions**\n┖ ${antispam.map((v) => `\`${v.charAt(0).toUpperCase() + v.slice(1)}\``).join(" , ") || `\`${await client.lang('noactions', interaction.guild.id)}\``}\n
                **Anti-Link**\n┖ ${config.antilink.toggle ? `${client.botemojis.yes} \`${await client.lang('enable', interaction.guild.id)}\`` : `${client.botemojis.no} \`${await client.lang('disable', interaction.guild.id)}\``}\n**Actions**\n┖ ${actlink.map((v) => `\`${v.charAt(0).toUpperCase() + v.slice(1)}\``).join(" , ") || `\`${await client.lang('noactions', interaction.guild.id)}\``}\n
                **Anti-Everyone**\n┖ ${config.antieveryone.toggle ? `${client.botemojis.yes} \`${await client.lang('enable', interaction.guild.id)}\`` : `${client.botemojis.no} \`${await client.lang('disable', interaction.guild.id)}\``}\n**Actions**\n┖ ${antieveryone.map((v) => `\`${v.charAt(0).toUpperCase() + v.slice(1)}\``).join(" , ") || `\`${await client.lang('noactions', interaction.guild.id)}\``}\n
                `,
                color: process.env.COLOR,
                footer: { text: await client.lang('footer', interaction.guild.id), icon_url: client.user.displayAvatarURL() },
            }





            let menu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder({ customId: "automod", placeholder: "ShieldDefender" })
                    .addOptions(
                        {
                            label: "Anti-Spam",
                            description:  await client.lang('automod.selecmenu.antispam.description', interaction.guild.id),
                            value: "antispam",
                            emoji: { id: client.util.getEmojiId(config.antispam?.toggle ? client.botemojis.yes : client.botemojis.no) }
                        },
                        {
                            label: "Anti-Link",
                            description:  await client.lang('automod.selecmenu.antilink.description', interaction.guild.id),
                            value: "antilink",
                            emoji: { id: client.util.getEmojiId(config.antilink?.toggle ? client.botemojis.yes : client.botemojis.no) }
                        },
                        {
                            label: "Anti-Everyone",
                            description:  await client.lang('automod.selecmenu.antieveryone.description', interaction.guild.id),
                            value: "antieveryone",
                            emoji: { id: client.util.getEmojiId(config.antieveryone?.toggle ? client.botemojis.yes : client.botemojis.no) }
                        },
                        
                    )
            )
            const message = await (interaction.replied ? interaction.editReply({ embeds: [embed], components: [menu] }) : interaction.reply({ embeds: [embed], components: [menu], fetchReply: true }))
            const response = await message.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60000 });
            if (!response) return;
            response.deferUpdate();
            if (response.values[0] === "antispam") configure("Anti-Spam", { toggle: config.antispam?.toggle || false, actions: config.antispam?.actions || [] }, "antispam")
            if (response.values[0] === "antilink") configure("Anti-Link", { toggle: config.antilink?.toggle || false, actions: config.antilink?.actions || [] }, "antilink")
            if (response.values[0] === "antieveryone") configure("Anti-Everyone", { toggle: config.antieveryone?.toggle || false, actions: config.antieveryone?.actions || [] }, "antieveryone")

        }
        async function configure(paramName, paramValue, paramKey) {
            let embed = {
                title: paramName,
                description: `**Status**: ${paramValue.toggle ? client.botemojis.yes : client.botemojis.no}\n\n${client.botemojis.role} **Actions**\n${paramValue.actions.map((v) => `\`${v.charAt(0).toUpperCase() + v.slice(1)}\``).join("\n") || `\`${await client.lang('noactions', interaction.guild.id)}\``}`,
                color: process.env.COLOR,
                footer: { text: await client.lang('footer', interaction.guild.id), icon_url: client.user.displayAvatarURL() },
            }
            let menu = () => new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder({ customId: paramKey, placeholder: "ShieldDefender" })
                    .addOptions( 
                        {
                            label: `${paramValue.toggle ? "Disable" : "Enable"}`,
                            value: "toggle",
                            emoji: { id: client.util.getEmojiId(paramValue.toggle ? client.botemojis.no :  client.botemojis.yes) }
                        }, 
                        {
                            label: "Actions",
                            value: "actions",
                            emoji: { id: client.util.getEmojiId(client.botemojis.role) }
                        },
                        {
                            label: "Back",
                            value: "back",
                            emoji: { id: client.util.getEmojiId(client.botemojis.back) }
                        }
                    )
            )
            let collect = true;
            const message = await interaction.editReply({ embeds: [embed], components: [menu()] });
            const collector = message.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id && collect, time: 60000 });
            collector.on("collect", async (response) => {
                const value = response.values[0];
                if (value === "back") {
                    response.deferUpdate();
                    collector.stop();
                    await chooseaOption();
                } else if (value === "toggle") {
                    paramValue.toggle = !(paramValue.toggle || false)
                    config[paramKey] = paramValue;
                    guildManager.set("automod", config).save();
                    response.deferUpdate();
                    update();
                } else if (value === "actions") {
                    let actions = [...(paramValue?.actions || [])];
                    collect = false;
                    let buttonActions = new ActionRowBuilder().addComponents(
                        new ButtonBuilder({ customId: "reply", label: "Reply", style: 1 }),
                        new ButtonBuilder({ customId: "delete", label: "Delete", style: 1 }),
                        new ButtonBuilder({ custom_id: "mute", label: "Mute", style: 1 }),
                        new ButtonBuilder({ custom_id: "valid", emoji: { id: client.util.getEmojiId(client.botemojis.yes) }, style: 3 })
                    );
                    const reply = await response.reply({ components: [buttonActions], fetchReply: true });
                    const actionsCollector = reply.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 60000 });
                    actionsCollector.on("collect", async (response) => {
                        response.deferUpdate();
                        if (response.customId === "valid") {
                            actionsCollector.stop();
                            paramValue.actions = actions;
                            config[paramKey] = paramValue;
                            guildManager.set("automod", config).save();
                            reply.delete();
                            collect = true;
                            update();
                            return;
                        } else if (response.customId === "reply") {
                            actions.includes("reply") ? actions = actions.filter(a => a !== "reply") : actions.push("reply");
                            update(actions)
                        } else if (response.customId === "delete") {
                            actions.includes("delete") ? actions = actions.filter(a => a !== "delete") : actions.push("delete");
                            update(actions)
                        } else if (response.customId === "mute") {
                            actions.includes("mute") ? actions = actions.filter(a => a !== "mute") : actions.push("mute");
                            update(actions)
                        }
                    })
                }
            });
            async function update(act = [...(paramValue?.actions || [])]) {
                embed.description = `**Status**: ${paramValue.toggle ? client.botemojis.yes : client.botemojis.no}\n\n${client.botemojis.role} **Actions**\n${act.map((v) => `\`${v.charAt(0).toUpperCase() + v.slice(1)}\``).join("\n") || `\`${await client.lang('noactions', interaction.guild.id)}\``}`;
                message.edit({ embeds: [embed], components: [menu()] });
            }
        }
    }
}
