const { CommandInteraction, ActionRowBuilder, ButtonBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder } = require("discord.js"),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "crown",
    description: "Manage Crown Members in the server",

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: `${client.botemojis.no} | ${await client.lang('noperm', interaction.guild.id)}`, ephemeral: true });
        const guildManager = client.managers.guildManager.getOrCreate(interaction.guild.id);
        let crowns = guildManager.get("crowns") || [];
        let buttonCollect = true;
        const message = await interaction.reply({ embeds: [embed()], components: [buttons()] });
        const collector = message.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id && buttonCollect, time: 60000 });

        collector.on("collect", async (collected) => {
            if (collected.customId === "add-crown") {
                buttonCollect = false;
                const row = new ActionRowBuilder().addComponents(
                    new UserSelectMenuBuilder({ customId: "add-crown-user", placeholder: "ShieldDefender" })
                );
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.yes) }, customId: "valid", style: 3 }),
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.no) }, customId: "cancel", style: 4 })
                );
                const _message = await collected.reply({ content: `${await client.lang('crown.add', interaction.guild.id)}`, components: [row, button], fetchReply: true });
                let choosedUsers = [];
                const _collector = _message.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 60000 });
                _collector.on("collect", async (_collected) => {
                    if (_collected.customId === "cancel") {
                        buttonCollect = true;
                        collected.deleteReply();
                        _collector.stop();
                        return update();
                    } else if (_collected.customId === "valid") {
                        buttonCollect = true;
                        collected.deleteReply();
                        _collector.stop();
                        crowns.push(...choosedUsers);
                        guildManager.set("crowns", crowns).save();
                        return update();
                    } else if (_collected.customId === "add-crown-user") {
                        _collected.deferUpdate();
                        if (choosedUsers.includes(_collected.values[0])) choosedUsers = choosedUsers.filter(id => id !== _collected.values[0]);
                        else choosedUsers.push(_collected.values[0]);
                        collected.editReply({ content: `${await client.lang('crown.addcrown1', interaction.guild.id)} ${choosedUsers.map(id => `<@${id}>`).join(", ") || `${await client.lang('crown.addcrown2', interaction.guild.id)}`}` });
                    }
                });
            } else if (collected.customId === "remove-crown") {
                buttonCollect = false;
                const menu = new StringSelectMenuBuilder({ customId: "remove-crown-user", placeholder: "ShieldDefender" });
                crowns.forEach(id => menu.addOptions({ label: client.users.cache.get(id).tag, value: id }));
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.yes) }, customId: "valid", style: 3 }),
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.no) }, customId: "cancel", style: 4 })
                );
                const _message = await collected.reply({ content: `${await client.lang('crown.remove', interaction.guild.id)}`, components: [new ActionRowBuilder().addComponents(menu), button], fetchReply: true });
                let choosedUsers = [];
                const _collector = _message.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 60000 });
                _collector.on("collect", async (_collected) => {
                    if (_collected.customId === "cancel") {
                        buttonCollect = true;
                        collected.deleteReply();
                        _collector.stop();
                        return update();
                    } else if (_collected.customId === "valid") {
                        buttonCollect = true;
                        collected.deleteReply();
                        _collector.stop();
                        crowns = crowns.filter(id => !choosedUsers.includes(id));
                        guildManager.set("crowns", crowns).save();
                        return update();
                    } else if (_collected.customId === "remove-crown-user") {
                        _collected.deferUpdate();
                        if (choosedUsers.includes(_collected.values[0])) choosedUsers = choosedUsers.filter(id => id !== _collected.values[0]);
                        else choosedUsers.push(_collected.values[0]);
                        collected.editReply({content: `${await client.lang('crown.removecrown1', interaction.guild.id)} ${choosedUsers.map(id => `<@${id}>`).join(", ") || `${await client.lang('crown.removecrown2', interaction.guild.id)}`}`});
                    }
                });
            } else if (collected.customId === "reset-crown") {
                buttonCollect = false;
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.yes) }, customId: "valid", style: 3 }),
                    new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.no) }, customId: "cancel", style: 4 })
                );
                const _message = await collected.reply({ content: await client.lang('crown.reset', interaction.guild.id), components: [button], fetchReply: true });
                const _collector = _message.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 60000 });
                _collector.on("collect", async (_collected) => {
                    if (_collected.customId === "cancel") {
                        buttonCollect = true;
                        collected.deleteReply()
                        _collector.stop();
                        return update();
                    } else if (_collected.customId === "valid") {
                        buttonCollect = true;
                        collected.deleteReply()
                        _collector.stop();
                        crowns = [];
                        guildManager.set("crowns", []).save();
                        return update();
                    }
                });
            }
        });
        function update() {
            interaction.editReply({ embeds: [embed()], components: [buttons()] });
        }
        function buttons() {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.plus) }, customId: "add-crown", style: 1 }),
                new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.minus) }, customId: "remove-crown", style: 1, disabled: crowns.length === 0 ? true : false }),
                new ButtonBuilder({ emoji: { id: client.util.getEmojiId(client.botemojis.reset) }, customId: "reset-crown", style: 1 })
            )
        }

        function embed() {
            return {
                title: `${client.botemojis.owner} Crown Members`,
                description: `\`\`\`${crowns.map(id => `${interaction.guild.members.cache.get(id)?.user.username || "Introuvable"} ( ID: ${id} )`).join("\n") || "No Crown Members"}\`\`\``,
                color: process.env.COLOR,
            }
        }
    }
}