const Discord = require("discord.js");

module.exports = {
    name: "pic",
    description: "Affiche la photo de profil d'un utilisateur",
    options: [
        {
            name: "user",
            description: "Utilisateur",
            type: 6, 
            required: true,
        },
    ],

    async run(client, interaction, guildData) {
        const user = interaction.options.getUser("user");
        const avatarUrl = user.avatarURL({ format: "png", size: 1024 });

        if (!avatarUrl)
            return interaction.reply({
                content: "L'utilisateur n'a pas de photo de profil.",
                ephemeral: true,
            });

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setTitle('Utilisateur')
            .setDescription(`[\`${user.username}\`](https://discord.com/users/${user.id}) | \`${user.id}\` `)
            .setImage(avatarUrl)
            .setColor(client.color)
            .setFooter({text: await client.lang('footer', interaction.guild.id), icon_ur: client.user.displayAvatarURL()})
       

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            (
                new Discord.ButtonBuilder()
                .setLabel('Avatar')
                .setStyle(Discord.ButtonStyle.Link)
                .setURL(avatarUrl)
            )
        )
       await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    },
};
