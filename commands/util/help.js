const { CommandInteraction, chatInputApplicationCommandMention } = require("discord.js"),
    ShieldDefender = require("../../structures/ShieldDefender");

module.exports = {
    name: "help",
    description: "This is the help command",
    options: [
        { name: "command", description: "Information about an command", type: 3 },
    ],
    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const cmdstr = interaction.options
            .getString("command")
            ?.trim()
            ?.toLowerCase();
        if (cmdstr) {
            const command =
                client.commands.get(cmdstr) ||
                client.commands.find((cmd) => cmd.name.includes(cmdstr));
            if (!command)
                return interaction.reply({
                    content: `${await client.lang('help.cmdhelp.nocmd', interaction.guild.id)} \`${cmdstr}\``,
                });
            const embed = {
                title: `${await client.lang('help.cmdhelp.title', interaction.guild.id)} ${command.name}`,
                fields: [
                    { name: `${await client.lang('help.cmdhelp.name', interaction.guild.id)}`, value: `> \`${command.name}\`` },
                    {
                        name: `${await client.lang('help.cmdhelp.about', interaction.guild.id)} :`,
                        value: `> \`${command.description}\``,
                    },
                ],
                footer: { text: await client.lang('footer', interaction.guild.id), icon_ur: client.user.displayAvatarURL() },
                color: process.env.COLOR,
                image: {
                    url: "https://cdn.discordapp.com/attachments/1123529983139266580/1123529991007768607/On1.png"
                }
            };
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const commands = await client.application.commands.fetch();
            function findByName(name) {
                return commands.find(command => command.name === name)
            }

            let embeds = [
                {
                    title: await client.lang('help.title', interaction.guild.id),
                    description: await client.lang('help.description', interaction.guild.id),
                    fields: [
                        { name: `${client.botemojis.owner}  ${await client.lang('help.admin', interaction.guild.id)}`, value: `${chatInputApplicationCommandMention("antiraid", findByName("antiraid").id)}, ${chatInputApplicationCommandMention("automod", findByName("automod").id)}, ${chatInputApplicationCommandMention("captcha", findByName("captcha").id)}, ${chatInputApplicationCommandMention("autorole", findByName("autorole").id)}, ${chatInputApplicationCommandMention("crown", findByName("crown").id)}` },
                        { name:  `${client.botemojis.mod}  ${await client.lang('help.mod', interaction.guild.id)}`, value: `${chatInputApplicationCommandMention("ban", findByName("ban").id)}, ${chatInputApplicationCommandMention("kick", findByName("kick").id)}, ${chatInputApplicationCommandMention("lock", findByName("lock").id)}, ${chatInputApplicationCommandMention("unlock", findByName("unlock").id)}, ${chatInputApplicationCommandMention("clear", findByName("clear").id)}` },
                        { name:  `${client.botemojis.user} ${await client.lang('help.other', interaction.guild.id)}`, value: `${chatInputApplicationCommandMention("help", findByName("help").id)}, ${chatInputApplicationCommandMention("banner", findByName("banner").id)}, ${chatInputApplicationCommandMention("pic", findByName("pic").id)} ,${chatInputApplicationCommandMention("about", findByName("about").id)}` },
                    ],
                    color: process.env.COLOR,
                    footer: { text: await client.lang('footer', interaction.guild.id), icon_ur: client.user.displayAvatarURL() },
                    image: {
                        url: "https://media.discordapp.net/attachments/1070003848103612556/1080191951124570212/image_2023-01-26_205852116.jpg"
                    }
                },
                {
                    title: await client.lang('help.title', interaction.guild.id),
                    description: await client.lang('help.embed', interaction.guild.id),
                    color: process.env.COLOR,
                    image: {
                        url: "https://media.discordapp.net/attachments/1070003848103612556/1080191951124570212/image_2023-01-26_205852116.jpg"
                    }
                }
            ]
            client.util.embedPage(interaction, embeds, false)
        }
    }
}