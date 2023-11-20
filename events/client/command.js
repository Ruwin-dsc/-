const { Interaction } = require("discord.js"),
    ShieldDefender = require("../../structures/ShieldDefender");

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ShieldDefender} client
     * @param {Interaction} interaction
     */

    async run(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            const noperm = await client.lang('noperm', interaction.guild.id)
            if (command.userPermissions && !interaction.member.permissions.has(command.userPermissions)) return interaction.reply({ content: `${client.botemojis.no} | ${noperm}`, ephemeral: true, });
            if (!command) return;
            command.run(client, interaction);
        }
    }
}