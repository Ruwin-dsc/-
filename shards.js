const { ShardingManager, WebhookClient } = require('discord.js');
const webhookStart = new WebhookClient({ id: "1126884903838036069", token: "F5N-aFADjJFjkG25GoJX8aHhYmpwZtzGQeICBmP7ra7GgpdUvZ9TM6f3zjuKFN2EnT2O" })
new ShardingManager('./index.js', {
    shardList : [0, 1],
    totalShards : 2,
    mode: 'process',
    respawn: true,
    token: ""
}).on('shardCreate', shardCreateID => {
    shardCreateID
        .on('ready', () => webhookStart.send(`La shard \`n°${shardCreateID.id}\` est prêt.`))
        .on('reconnecting', () => webhookStart.send(`La shard \`n°${shardCreateID.id}\` se reconnecte.`))
        .on('death', () => webhookStart.send(`La shard \`n°${shardCreateID.id}\` est mort.`))
        .on('disconnect', () => webhookStart.send(`La shard \`n°${shardCreateID.id}\` s'est déconnecté.`));
    return webhookStart.send(`La shard \`n°${shardCreateID.id}\` est entrain de démarrer.`)
}).spawn({
    delay: 10000
});