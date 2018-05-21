const CommandHandler = require('./cmd-handler.js').CommandHandler;

const HELP_MESSAGE = `\`\`\`
stat-g is a discord bot that can post PUBG statistics in your discord channel!

# Commands

* \`!statg register [pubg player name]\` 
  Links your PUBG player name to your Discord account. Enables you to fetch your stats.
* \`!statg stats\`
  Shows your current season stats (if you have registered yourself).
  **arguments**
  * \`solo\` Stats from third-person solo matches only.
  * \`solo-fpp\` Stats from first-person solo matches only.
  * \`duo\` Stats from third-person duo matches only.
  * \`duo-fpp\` Stats from first-person duo matches only.
  * \`squad\` Stats from third-person squad matches only.
  * \`squad-fpp\` Stats from first-person squad matches only.
* \`!statg match\`
  Shows your and your squads latest match info (all game modes combined).
* \`!statg help\`
  Displays help about commands.
* \`!statg version\`
  Displays version of the stat-g bot.
* \`!statg status\`
  Displays the current status of the PUBG api.
* \`!statg ping\`
  Pong!\`\`\``

/**
 * Handler for the "help" command
 */
class HelpCommandHandler extends CommandHandler {

    constructor() {
        super();
    }

    handle(cmd, bot, db, pubg) {

        bot.sendMessage({
            to: cmd.discordUser.channelId,
            message: HELP_MESSAGE
        });
    }
}

exports.getHandler = function() {
    return new HelpCommandHandler();
}