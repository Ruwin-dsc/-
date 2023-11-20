const { CommandInteraction } = require('discord.js'),
    ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "about",
    description: "About the bot",

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const djs = require("discord.js").version;
        const node = process.version;
        const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        let embed = {
            title: await client.lang('about.title', interaction.guild.id),
            fields: [
                { name: `${client.botemojis.owner} ${await client.lang('about.dev', interaction.guild.id)}`, value: `<@648236998657835047> & <@382820461760872448> `, inline: true },
                { name: `${client.botemojis.djs} Discord.js`, value: `\`${djs}\``, inline: true },
                { name: `${client.botemojis.node} Node.js`, value: `\`${node}\``, inline: true },
                { name: `${client.botemojis.stats} ${await client.lang('about.serveur', interaction.guild.id)}`, value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: `${client.botemojis.user} ${await client.lang('about.users', interaction.guild.id)}`, value: `\`${users}\``, inline: true },
                { name: `${client.botemojis.ping} Ping`, value: `\`${client.ws.ping}ms\``, inline: true },
                { name: `${client.botemojis.support} Support`, value: `[Click here](${process.env.SUPPORT})`, inline: true },
            ],
            color: process.env.COLOR,
            url: process.env.SUPPORT,
            image: {
                url: "https://media.discordapp.net/attachments/1070003848103612556/1080191951124570212/image_2023-01-26_205852116.jpg"
            },
            footer: { iconURL: client.user.avatarURL(), text: await client.lang('footer', interaction.guild.id) }
        }
        interaction.reply({ embeds: [embed], content: process.env.SUPPORT, ephemeral: false })

    }
}