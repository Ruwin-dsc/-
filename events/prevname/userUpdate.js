const axios = require('axios'), ShieldDefender = require('../../structures/ShieldDefender')


module.exports = {
    name: "userUpdate",

    /**
     * @param {ShieldDefender} client
    */

  async run(client, oldUser, newUser) {
    if (oldUser.username !== newUser.username) {
      const old_name = oldUser.username;
      const user_id = oldUser.id;
      try {
        await axios.post('http://' + process.env.PANEL + '/oldnames', { user_id, old_name });
      } catch (error) {
        console.error("Erreur API Aethon : " + error);
      }
    }
  }
}