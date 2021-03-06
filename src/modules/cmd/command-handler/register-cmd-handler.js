const { CommandHandler } = require('./cmd-handler.js');
const regionHelper = require('../region-helper');

/**
 * Command handler for !statg register command. Links discord account
 * with PUBG name and region to enable fetching stats from the
 * PUBG API.
 * @extends CommandHandler
 */
class RegisterCommandHandler extends CommandHandler {
  handle(cmd, bot, db, pubg) {
    let playerName = '';
    let pubgPlayerData = {};
    let regionId = '';
    let regionName = '';

    if (cmd.arguments.length === 1) {
      [playerName] = cmd.arguments;

      return db.getRegions({ is_global_region: true })

        .then((rows) => {
          if (rows.length !== 1) {
            return Promise.reject(new Error('Something really weird happened.'));
          }

          regionId = rows[0].id;
          regionName = rows[0].region_name;

          return pubg.player({
            name: playerName,
            region: regionName,
          });
        })

        .then((data) => {
          [pubgPlayerData] = data.data;
          return db.getRegisteredPlayers({ discord_id: cmd.discordUser.id });
        })

        .then((rows) => {
          if (rows.length === 0) {
            this.logger.debug('Adding new player...');
            return db.insertRegisteredPlayer({
              discord_id: cmd.discordUser.id,
              discord_name: cmd.discordUser.name,
              pubg_id: pubgPlayerData.id,
              pubg_name: pubgPlayerData.attributes.name,
              region_id: regionId,
            });
          }

          return Promise.reject(new Error('There already is a player name registered for your discord user. Try using unregister command first.'));
        })

        .then(() => {
          this.onSuccess(bot, cmd, `Player "${pubgPlayerData.attributes.name}" successfully registered for region "${regionName}"!`);
        })

        .catch((error) => {
          this.onError(bot, cmd, error);
        });
    } else if (cmd.arguments.length === 2) {
      // check whether the second argument is a valid region
      if (!regionHelper.REGIONS.includes(cmd.arguments[1])) {
        this.onError(bot, cmd, new Error(`unknown region "${cmd.arguments[1]}"`));
        return Promise.resolve();
      }

      [playerName, regionName] = cmd.arguments;

      return db.getRegions({ region_name: regionName })

        .then((rows) => {
          if (rows.length !== 1) {
            return Promise.reject(new Error('Something really weird happened.'));
          }

          regionId = rows[0].id;

          return pubg.player({
            name: playerName,
            region: regionName,
          });
        })

        .then((data) => {
          [pubgPlayerData] = data.data;
          return db.getRegisteredPlayers({ discord_id: cmd.discordUser.id });
        })

        .then((rows) => {
          if (rows.length === 0) {
            this.logger.debug('Adding new player...');
            return db.insertRegisteredPlayer({
              discord_id: cmd.discordUser.id,
              discord_name: cmd.discordUser.name,
              pubg_id: pubgPlayerData.id,
              pubg_name: pubgPlayerData.attributes.name,
              region_id: regionId,
            });
          }
          return Promise.reject(new Error('There already is a player name registered for your discord user. Try using unregister command first.'));
        })

        .then(() => {
          this.onSuccess(bot, cmd, `Player "${pubgPlayerData.attributes.name}" successfully registered for region "${regionName}"!`);
        })

        .catch((error) => {
          this.onError(bot, cmd, error);
        });
    }
    this.onError(bot, cmd, new Error('invalid amount of arguments'));
    return Promise.resolve();
  }
}

exports.getHandler = function getHandler() {
  return new RegisterCommandHandler();
};
