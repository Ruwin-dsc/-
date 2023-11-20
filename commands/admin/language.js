const { CommandInteraction } = require('discord.js');
const ShieldDefender = require('../../structures/ShieldDefender');

module.exports = {
    name: "language",
    description: "Change the bot's language",
    userPermissions: ["Administrator"],
    options: [
        {
            name: "lang",
            description: "The language to set",
            type: 3,
            required: true,
            choices: [
                { name: "English", value: "en" },
                { name: "Français", value: "fr" },
                { name: "Arabie", value: "arabie" },
                { name: "Espanol", value: "espanol" },
                { name: "Ruse", value: "ru" }
            ]
        }
    ],

    /**
     * @param {ShieldDefender} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const langCode = interaction.options.getString('lang');
        
        if (await isCurrentLanguage(client, interaction, langCode)) {
            const response = (await client.lang('language.allready', interaction.guild.id)).replace("{langCode}", `\`${langCode}\``)
            await interaction.reply({content: response}).catch(() => { })
        }
        
        if (!await isValidLanguage(client, interaction, langCode)) {
            return interaction.reply({content: await client.lang('language.invalide', interaction.guild.id)}).catch(() => { })
        }
        else { 
        const response = (await client.lang('language.set', interaction.guild.id)).replace("{langCode}", `\`${langCode}\``);
        await interaction.reply({content: response}).catch(() => { })
        }
    }
};

async function isValidLanguage(client, interaction, langCode) {
    const guildId = interaction.guild.id;
    const guildConfig = await client.database.models.guild.findOne({
        where: { id: guildId }
    });

    if (guildConfig) {
        guildConfig.langue = langCode;
        await guildConfig.save();
        return true;
    } else {
        return false;
    }
}

async function isCurrentLanguage(client, interaction, langCode) {
    const guildId = interaction.guild.id;
    const guildConfig = await client.database.models.guild.findOne({
        where: { id: guildId }
    });

    return guildConfig && guildConfig.langue === langCode;
}
