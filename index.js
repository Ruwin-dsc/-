require("dotenv").config();
const ShieldDefender = require("./structures/ShieldDefender");
new ShieldDefender()
process.on("uncaughtException", (e) => {
 /*  if (e.code === 50013) return;
    if (e.code === 50001) return;
    if (e.code === 50035) return;
    if (e.code === 10062) return console.log('erreur interaction')
  */
    console.log(e)
})