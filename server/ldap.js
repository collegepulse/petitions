var assert, ldap, Future, LDAP;

ldap = Meteor.require('ldapjs');
assert = Npm.require('assert');
Future = Npm.require('fibers/future');

LDAP = {};
LDAP.searchOu = 'ou=People,dc=rit,dc=edu';
LDAP.searchQuery = function(user){
  return {
    filter: "(uid=" + user + ")",
    scope: 'sub'
  };
};

LDAP.checkAccount = function(options) {
  var dn, future;
  LDAP.client = ldap.createClient({
    url: process.env.LDAP_URL,
    maxConnections: 2,
    bindDN:          'uid=' + options.username + ',ou=People,dc=rit,dc=edu',
    bindCredentials: options.password
  });
  options = options || {};
  dn = [];
  future = new Future();
  if (options.password.length === 0 || options.username.length === 0) {
    future['return'](void 8);
    return;
  }
  LDAP.client.search(LDAP.searchOu, LDAP.searchQuery(options.username), function(err, search) {
    if (err) {
      future['return'](false);
      return false;
    } else {
      search.on('searchEntry', function(entry) {
        dn.push(entry.objectName);
        LDAP.displayName = entry.object.displayName;
        LDAP.givenName = entry.object.givenName;
        LDAP.initials = entry.object.initials;
        LDAP.sn = entry.object.sn;
        LDAP.ou = entry.object.ou;
        return LDAP.displayName = entry.object.displayName;
      });
      search.on('error', function(err){
        throw new Meteor.Error(500, "LDAP server error");
      });
      return search.on('end', function() {
        if (dn.length === 0) {
          future['return'](false);
          return false;
        }
        return LDAP.client.bind(dn[0], options.password, function(err) {
          if (err) {
            future['return'](false);
            return false;
          }
          return LDAP.client.unbind(function(err) {
            assert.ifError(err);
            return future['return'](!err);
          });
        });
      });
    }
  });
  return future.wait();
};

Accounts.registerLoginHandler('ldap', function(loginRequest) {
  var user, userId;
  if (LDAP.checkAccount(loginRequest)) {
    user = Meteor.users.findOne({
      username: loginRequest.username.trim().toLowerCase()
    });
    if (user) {
      userId = user._id;
    } else {
      var name = (LDAP.givenName && LDAP.sn) ? LDAP.givenName + " " + LDAP.sn : null;
      userId = Meteor.users.insert({
        username: loginRequest.username.trim().toLowerCase(),
        notify: {
          updates: false,
          response: true
        },
        profile: {
          displayName: LDAP.displayName || null,
          givenName: LDAP.givenName || null,
          initials: LDAP.initials || null,
          sn: LDAP.sn || null,
          name: name
        }
      });
    }
    return {
      userId: userId
    };
  }
});