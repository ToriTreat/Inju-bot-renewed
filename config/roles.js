const config = require('./bot');

const ROLES = {
  FOUNDER:          config.founderRoleId || '1532203548572385431',
  DEVELOPER:        config.developerRoleId || '1532405583125151884',
  HEAD_MANAGER:     config.headManagerRoleId || '1532405584366669905',
  LEAD_ADMIN:       config.leadAdminRoleId || '1532405585805312173',
  EXECUTIVE_ADMIN:  config.executiveAdminRoleId || '1532405588531609680',
  HEAD_SUPPORT:     config.headSupportRoleId || '1532405589714665613',
  SUPPORT:          config.supportRoleId || '1532405590775566396',
  CONTENT_CREATOR:  config.contentCreatorRoleId || '1532405591622946887',
  HITTER_1:         config.hitter1RoleId || '1532405592809799720',
  HITTER_2:         config.hitter2RoleId || '1532405593871089834',
  HITTER_3:         config.hitter3RoleId || '1532405594991104001',
  BOT:              config.botRoleId || '1532405596836466748',
  BOOSTER:          config.boosterRoleId || '1489594671549120523',
  MEMBER:           config.memberRoleId || '1532405598912778370',
};

const STAFF_ROLES = [
  ROLES.FOUNDER,
  ROLES.DEVELOPER,
  ROLES.HEAD_MANAGER,
  ROLES.LEAD_ADMIN,
  ROLES.EXECUTIVE_ADMIN,
  ROLES.HEAD_SUPPORT,
  ROLES.SUPPORT,
];

const ADMIN_ROLES = [
  ROLES.FOUNDER,
  ROLES.DEVELOPER,
  ROLES.HEAD_MANAGER,
  ROLES.LEAD_ADMIN,
  ROLES.EXECUTIVE_ADMIN,
];

function hasRole(member, roleId) {
  return member.roles?.cache?.has(roleId) ?? false;
}

function hasAnyStaffRole(member) {
  return STAFF_ROLES.some(id => hasRole(member, id));
}

function hasAnyAdminRole(member) {
  return ADMIN_ROLES.some(id => hasRole(member, id));
}

function getHighestStaffRole(member) {
  for (const roleId of ADMIN_ROLES) {
    if (hasRole(member, roleId)) return roleId;
  }
  for (const roleId of [ROLES.HEAD_SUPPORT, ROLES.SUPPORT]) {
    if (hasRole(member, roleId)) return roleId;
  }
  return null;
}

module.exports = {
  ROLES,
  STAFF_ROLES,
  ADMIN_ROLES,
  hasRole,
  hasAnyStaffRole,
  hasAnyAdminRole,
  getHighestStaffRole,
};
