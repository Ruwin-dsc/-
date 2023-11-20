const { CommandInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "lock",
    description: "Lock a channel",
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
        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages: false}).then(async() => {
            await  interaction.reply({content: await client.lang('lock.succes', interaction.guild.id)})
        }).catch(async(e) => {
            await interaction.reply({content: await client.lang('lock.erreur', interaction.guild.id), ephemeral: true})
        })
    }
}