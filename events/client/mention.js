module.exports = {
    name: "messageCreate",

    async run(client, message) {
        if (message.author.bot) return;
        if (message.content.trim() === `<@${client.user.id}>`) {
            let prefix = await client.lang('prefix', message.guild.id)
            message.reply({
                content: "***" + prefix + "***",
            });
        }
    },
};
