const { CommandInteraction, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "clear",
    description: "Clear a message",
    userPermissions: ["ManageMessages"],
    options: [
        { name: "messages", description: "Number", type: 10, minValue: 1, maxValue: 99, required: true }
    ],

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const messages = interaction.options.getNumber("messages");
        interaction.channel.bulkDelete(messages).then(async() => {
            interaction.reply({ content: `${messages} ${await client.lang('clear.succes', interaction.guild.id)}` })
        }).catch(async(e) => {
            interaction.reply({ content:  await client.lang('clear.erreur', interaction.guild.id), ephemeral: true })
        })
    }
}