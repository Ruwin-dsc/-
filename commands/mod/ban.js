const { CommandInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "ban",
    description: "Ban a member",
    userPermissions: ["BanMembers"],
    options: [
        { name: "member", description: "Member", required: true, type: 6 },
        { name: "reason", description: "Reason", required: false, type: 3 },
    ],

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const target = interaction.options.getMember("member");
        if (!target) return interaction.reply({ content: await client.lang('ban.erreur', interaction.guild.id), ephemeral: true });
        const reason = interaction.options.getString("reason") || await client.lang('ban.reason', interaction.guild.id);
        if(target.id === client.user.id) return interaction.reply({ content: await client.lang('ban.banclient', interaction.guild.id), ephemeral: true})
        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: await client.lang('ban.impossible', interaction.guild.id), ephemeral: true })
        target.ban({ reason: reason }).then(async () => {
            interaction.reply({ content: `${target.user} ${await client.lang('ban.succes', interaction.guild.id)} **${reason}**` })
        }).catch((e) => {
            console.log(e)
            interaction.reply({ content: "error", ephemeral: true })
        })
    }
}