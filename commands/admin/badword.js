const {
    CommandInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
} = require("discord.js"),
    ShieldDefender = require("../../structures/ShieldDefender");

module.exports = {
    name: "badword",
    description: "Configure the badword system",
    userPermissions: ["Administrator"],

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const guildData = client.managers.guildManager.getOrCreate(interaction.guild.id);
        let badwords = guildData.get("badwordsConfig")?.words || []
        let badwordsConfig = guildData.get("badwordsConfig") || []
     

        const buttons = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder({ emoji: client.botemojis.plus , custom_id: "add", style: 1 }),
                new ButtonBuilder({ emoji: client.botemojis.minus, custom_id: "del", style: 1 }),
                new ButtonBuilder({ emoji:  "🗑️" , custom_id: "clear", style: 4 })
            )
        const message = await interaction.reply({ embeds: [embed()], components: [buttons], fetchReply: true });
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 120000
        })
        collector.on("collect", async (button) => {
            const value = button.customId;
            if (value === "add") {
                await button.reply({ content: await client.lang('badwords.add', interaction.guild.id), fetchReply: true });
                msgCollector().on("collect", async (response) => {
                    badwords.push(response.content);
                    update(response);
                })
            } else if (value === "del") {
                if (badwords.length === 0) return button.reply({ content: await client.lang('badwords.noneremove', interaction.guild.id), ephemeral: true });
                let menu = new StringSelectMenuBuilder().setCustomId("menu-del-badword").setPlaceholder("ShieldDefender")
                for await (const badword of badwords) {
                    menu.addOptions({ label: badword, value: badword })
                }
                const reply = await button.reply({ content: await client.lang('badwords.remove', interaction.guild.id), components: [new ActionRowBuilder().setComponents(menu)], fetchReply: true });
                const response = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 600000
                });
                badwords = badwords.filter(c => c !== response.values[0]);
                update()
            } else if (value === "clear") {
                const buttonsYesOrNo = new ActionRowBuilder().setComponents(
                    new ButtonBuilder({ label: "Yes", style: 3, custom_id: "yes" }),
                    new ButtonBuilder({ label: "No", style: 4, custom_id: "no" })
                )
                const reply = await button.reply({ content: await client.lang('badwords.reset', interaction.guild.id), fetchReply: true, components: [buttonsYesOrNo] })
                const response = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 600000
                });
                if (response.customId === "yes") {
                    badwords = [];
                    update()
                } else {
                    update()
                }
            }
            function msgCollector() {
                return interaction.channel.createMessageCollector({
                    filter: (m) => m.author.id === interaction.user.id,
                    max: 1,
                    time: 60000
                })
            }
            function error(response, content) {
                response.reply(content).then((m) => setTimeout(() => (m.delete(), response.delete(), button.deleteReply()), 3000))
            }
            function update(response) {
                interaction.editReply({ embeds: [embed()] })
                response?.delete().catch((e) => { })
                button.deleteReply().catch((e) => { })
                badwordsConfig.words = badwords;
                guildData.set("badwordsConfig", badwordsConfig).save()
            }
        })
        function embed() {
            return {
                title: "Badwords",
                color: process.env.COLOR,
                description: `\`\`\`js\n${badwords.map((c) => `${c}`).join("\n") || "None"}\`\`\``,
            }
        }
    }
}