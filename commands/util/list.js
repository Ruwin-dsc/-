const { ShieldDefender } = require("../../structures/ShieldDefender"),
    { CommandInteraction } = require("discord.js")

module.exports = {
    name: "list",
    description: "List command",
    userPermissions: ["Administrator"],
    options: [
        { name: "admins", description: "Allows to list the admin of the server", type: 1 },
        { name: "bots", description: "Allows to list the bots of the server", type: 1 },
        { name: "boosters", description: "Allows to list the boosters of the server", type: 1 }
    ],
    /**
     * @param {ShieldDefender} client 
     * @param {CommandInteraction} interaction 
     */
    async run(client, interaction, guildData) {
        const cmd = interaction.options.getSubcommand();
        if (cmd === "admins") {
            const admins = await interaction.guild.members.fetch().then((m) => m.filter(_m => _m.permissions.has("Administrator")))
            let embed = {
                title: await client.lang('list.admin.title', interaction.guild.id),
                color: process.env.COLOR,
                description: admins.map((m) => m).join("\n"),
            }
            interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (cmd === "bots") {
            const bots = await interaction.guild.members.fetch().then((m) => m.filter((_m) => _m.user.bot))
            let embed = {
                color: process.env.COLOR,
                title: await client.lang('list.bot.title', interaction.guild.id),
                description: bots.map((m) => m).join("\n"),
            }
            interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (cmd === "boosters") {
            const boosters = await interaction.guild.members.fetch().then((m) => m.filter((_m) => _m.premiumSinceTimestamp));
            let embed = {
                color: process.env.COLOR,
                title: "List of boosters",
                description: boosters.map((m) => m).join("\n"),
            }
            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}