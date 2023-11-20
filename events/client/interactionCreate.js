const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async run(client, interaction) {
        if (!interaction.isButton()) {
            return;
        }

        if (interaction.customId === 'button-leave-france-guildcreate') {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('Leave')
                .setDescription(`*Je vient de* **leave** *votre discord*, *car vous avez moin de* \`4\` *membres !*`)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
            const row = new ActionRowBuilder()
                .addComponents(
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.en)
                            .setCustomId("button-leave-en-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.france)
                            .setCustomId("button-leave-france-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setURL(process.env.SUPPORT)
                            .setLabel('Support')
                            .setStyle(ButtonStyle.Link)
                    )
                )
            await interaction.update({ embeds: [embed], components: [row] })
            return;
        }

        if (interaction.customId === 'button-leave-en-guildcreate') {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('Leave')
                .setDescription(`*I've just* **leave** *your discord, because you have* \`4\` *members* !`)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
            const row = new ActionRowBuilder()
                .addComponents(
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.en)
                            .setCustomId("button-leave-en-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.france)
                            .setCustomId("button-leave-france-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setURL(process.env.SUPPORT)
                            .setLabel('Support')
                            .setStyle(ButtonStyle.Link)
                    )
                )
            await interaction.update({ embeds: [embed], components: [row] })
            return;
        }

        if (interaction.customId === 'button-join-en-guildcreate') {
            const row = new ActionRowBuilder()
                .addComponents(
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.en)
                            .setCustomId("button-join-en-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.france)
                            .setCustomId("button-join-france-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setURL(process.env.SUPPORT)
                            .setLabel('Support')
                            .setStyle(ButtonStyle.Link)
                    )
                )
            await interaction.update({ content: `Thank you for adding me to your server, **\`${interaction.user.username}\`** ! If you have any questions or need help, don't hesitate to ask on support, to change the language made \`/language\``, components: [row] })
            return;
        }

        if (interaction.customId === 'button-join-france-guildcreate') {

            const row = new ActionRowBuilder()
                .addComponents(
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.en)
                            .setCustomId("button-join-en-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setEmoji(client.botemojis.france)
                            .setCustomId("button-join-france-guildcreate")
                            .setStyle(ButtonStyle.Primary)
                    ),
                    (
                        new ButtonBuilder()
                            .setURL(process.env.SUPPORT)
                            .setLabel('Support')
                            .setStyle(ButtonStyle.Link)
                    )
                )
            await interaction.update({ content: `Merci de m'ajouter à votre serveur **\`${interaction.user.username}\`** ! Si vous avez des questions ou si vous avez besoin d'aide, n'hésitez pas à demander sur le support, pour changer la langue faite \`/language\``, components: [row] })
            return;
        }
    }
}