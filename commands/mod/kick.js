const { CommandInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "kick",
    description: "Kick a member",
    userPermissions: ["KickMembers"],
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
        if (!target) return interaction.reply({ content: "Member not found", ephemeral: true });
        if(target.id === client.user.id) return interaction.reply({ content: await client.lang('kick.kickclient', interaction.guild.id), ephemeral: true})
        const reason = interaction.options.getString("reason") || await client.lang('kick.reason', interaction.guild.id);
        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: await client.lang('kick.impossible', interaction.guild.id), ephemeral: true })
        target.kick({reason : reason}).then(async () => {
            interaction.reply({ content: `${target.user} ${await client.lang('kick.succes', interaction.guild.id)} **${reason}**` })
        }).catch((e) => {
            console.log(e)
            interaction.reply({ content: "error", ephemeral: true })
        })
    }
}