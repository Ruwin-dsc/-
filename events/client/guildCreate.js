const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "guildCreate",

    async run(client, guild) {
        if (guild.memberCount < process.env.MEMBER) {
            console.log(`Leaving ${guild.name} (${guild.memberCount} members) as it has less than ${process.env.MEMBER} members.`);
            const members = guild.memberCount;
            const owner = await client.users.fetch(guild.ownerId);
            const leavemsg = await client.lang("leave", guild.id)
            const replacedMsg = leavemsg
            .replace("{guild}", guild.name)
            .replace("{member}", members);
            console.log(leavemsg)
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('Leave')
                .setDescription(replacedMsg)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                .setFooter({text: await client.lang("footer", guild.id), iconURL: client.user.avatarURL()});
                 const row = new ActionRowBuilder()
                  .addComponents(
                (
                    new ButtonBuilder()
                    .setEmoji(client.botemojis.en)
                    .setCustomId("button-leave-en-guildcreate")
                    .setStyle(ButtonStyle.Primary)
                ),
                (
                    new ButtonBuilder()
                    .setEmoji(client.botemojis.france)
                    .setCustomId("button-leave-france-guildcreate")
                    .setStyle(ButtonStyle.Primary)
                ),
                (
                    new ButtonBuilder()
                    .setURL(process.env.SUPPORT)
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link)
                )
            )
            owner.send({ embeds: [embed], components: [row] });
            await guild.leave();
            return;
        }

        console.log(` + ${guild.name} ( ${guild.memberCount} members ) - ${client.guilds.cache.size} servers`)
        let embed = {
            title: `${guild.name}`,
            color: process.env.COLOR,
            description: ` \`${guild.name}\` just added me, I am now on ${client.guilds.cache.size} servers`,
            fields: [
                { name: 'ID', value: `${guild.id}` },
                { name: 'Members', value: `${guild.memberCount} | ${guild.members.cache.filter((m) => m.user.bot).size} bots`, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}> ( ${guild.ownerId})`, inline: true },],
            footer: { iconURL: client.user.avatarURL(), text: "ShieldDefender - Your Security, Our Priority" }
        }
       client.guilds.cache.get("1122783777345773630").channels.cache.get("1122783778000093236").send({ embeds: [embed] })

    const owner = await client.users.fetch(guild.ownerId);
    if (owner) {
        const row = new ActionRowBuilder()
        .addComponents(
      (
          new ButtonBuilder()
          .setEmoji(client.botemojis.en)
          .setCustomId("button-join-en-guildcreate")
          .setStyle(ButtonStyle.Primary)
      ),
      (
          new ButtonBuilder()
          .setEmoji(client.botemojis.france)
          .setCustomId("button-join-france-guildcreate")
          .setStyle(ButtonStyle.Primary)
      ),
      (
          new ButtonBuilder()
          .setURL(process.env.SUPPORT)
          .setLabel('Support')
          .setStyle(ButtonStyle.Link)
      )
  )

      owner.send({content: `Thank you for adding me to your server, ${owner.username} ! If you have any questions or need help, don't hesitate to ask on support, to change the language made /language`, components: [row]});
    }
    }
}