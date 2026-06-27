const config = require('./bot');

const ROLES = {
  FOUNDER:          config.founderRoleId || '1493282797983629494',
  DEVELOPER:        config.developerRoleId || '1498328916874629252',
  HEAD_MANAGER:     config.headManagerRoleId || '1506342621696626728',
  LEAD_ADMIN:       config.leadAdminRoleId || '1493297714157322344',
  EXECUTIVE_ADMIN:  config.executiveAdminRoleId || '1493282842514428028',
  HEAD_SUPPORT:     config.headSupportRoleId || '1493282864739909823',
  SUPPORT:          config.supportRoleId || '1493282887364251769',
  CONTENT_CREATOR:  config.contentCreatorRoleId || '1509119762439868506',
  HITTER_1:         config.hitter1RoleId || '1493282909820555284',
  HITTER_2:         config.hitter2RoleId || '1493282931890978927',
  HITTER_3:         config.hitter3RoleId || '1498329326586691715',
  BOT:              config.botRoleId || '1493282775954886886',
  BOOSTER:          config.boosterRoleId || '1489594671549120523',
  MEMBER:           config.memberRoleId || '1493282954129051838',
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
