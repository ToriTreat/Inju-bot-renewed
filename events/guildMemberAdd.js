const User = require('../database/models/User');
const config = require('../config/bot');
const logger = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (member.user.bot) return;

    try {
      const user = await User.findOne({ discordId: member.id, verified: true });
      if (user && config.memberRoleId) {
        const role = member.guild.roles.cache.get(config.memberRoleId);
        if (role) {
          await member.roles.add(role);
          logger.info(`Auto-restored role for ${member.user.tag}`);
        }
      }
    } catch (err) {
      logger.error(`guildMemberAdd error: ${err.message}`);
    }
  },
};
