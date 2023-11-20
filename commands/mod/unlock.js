const { CommandInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "unlock",
    description: "Unlock a channel",
    userPermissions: ["ManageChannels"],
    options: [
        {name: "channel", required: false, description: "Channel", type: 7}
    ],

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages: true}).then(async() => {
             interaction.reply({content: await client.lang('unlock.succes', interaction.guild.id)})
        }).catch(async(e) => {
             interaction.reply({content: await client.lang('unlock.erreur', interaction.guild.id), ephemeral: true})
        })
    }
}