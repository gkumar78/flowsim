'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.match
 * @description
 * # match
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Match', function(fgConstraints, Ethernet, UInt) {

function MatchField_UI(match, Type){
  this.category = match.category;
  this.field = match.field;
  this.key = match.key;
  this.type = Type;
  var that = this;
  this.mkType = function() {
    var args = [Type, null, null].concat(_(arguments).values());
    var T = _.bind.apply(null, args);
    var t = new T();
    var m = new Match(null, that.key, t._match);
    m.category = that.category;
    m.field = that.field;
    m.value = arguments[0];
    m.mask = arguments[1];
    return m;
  }
}

function Match(match, label, matchObject) {
  if(_.isObject(match)) {
    this.label  = match.label;
    this._match = mkByName(match); //matchObject.clone();
  } else if(label && matchObject) {
    this.label  = label;
    this._match = matchObject;
  } else {
    throw 'Match('+match+', '+label+', '+matchObject+')';
  }
}

Match.prototype.clone = function() {
  return new Match(this);
};

Match.prototype.equal = function(match) {
  return this.label === match.label &&
      this._match.equal(match._match);
};

Match.prototype.summarize = function() {
  return this._match.summarize();
};

function getOptions(matchs) {

}

function mkByValue(match) {
  switch(match.key){
    case 'eth_dst':
    case 'eth_src':
      //return ETHERNET.mkMACMatch;
    case 'eth_type':
      //return ETHERNET.mkTypeMatch;
    default:
      break;
  }
}

function mkByName(match) {
  switch(match.label){
    case 'eth_dst':
    case 'eth_src':
    case 'arp_sha':
    case 'arp_tha':
      //return new ETHERNET.MAC.Match(match._match);
    case 'eth_type':
    case 'internals_port':
      //return new UInt.Match(match._match);
    default:
      break;
  }
}

function Set(set) {
  if(_.isObject(set)) {
    this.matches = _.map(set.matches, function(match) {
      return new Match(match);
    });
  } else {
    this.matches = [];
  }
}

Set.prototype.get = function() {
  return this.matches;
};

Set.prototype.toView = function() {
  console.log('in toView:', this.matches);
  return [];
};

Set.prototype.clone = function() {
  return new Set(this);
};

Set.prototype.push = function(match) {
  this.matches.push(match);
};

Set.prototype.pop = function() {
  if(this.matches.length) {
    this.matches.splice(this.matches.length-1, 1);
  }
};

Set.prototype.match = function(key) {
  // empty match set matches everything .. is default match
  if(this.matches.length === 0) {
    return true;
  }
  return _.every(this.matches, function(match) {
    return _(key).has(match.label) && match._match.match(key[match.label]);
  });
};

Set.prototype.equal = function(set) {
  var idx;
  // can't be equal if different length
  if(this.matches.length !== set.matches.length) {
    return false;
  }
  // empty sets are default match alls
  if(this.matches.length === 0) {
    return true;
  }
  // compare each match individually
  for(idx=0; idx < this.matches.length; ++idx) {
    if(!this.matches[idx].equal(set.matches[idx])) {
      return false;
    }
  }
  return true;
};

Set.prototype.summarize = function() {
  if(this.matches.length === 0) {
    return ['*'];
  }
  return _(_(this.matches).map(function(match) {
    return match.summary;
  })).unique();
};

function createMatch(category, field, key, wildcard, maskable, mask) {
  return {
    category: category,
    field: field,
    key: key,
    enabled: true,
    wildcardable: wildcard,
    maskable: maskable,
    mask: mask
  };
}

function Available(){
  return [{
    category: 'Ethernet',
    fields: [
      createMatch('Ethernet', 'Src', 'eth_src', true, true, '0xffffffffffff'),
      createMatch('Ethernet', 'Dst', 'eth_dst', true, true, '0xffffffffffff'),
      createMatch('Ethernet', 'Type/Len', 'eth_typelen', true, false, '0xffff')
    ]
  }];
}

Match.Profile = function(match){
  if(_.isObject(match)){
    _.extend(this, match);
    this.matches = _.map(match.matches, function(f) {return _.clone(f);});
  } else {
    this.matches = Available();
  }
}

Match.Profile.prototype.clone = function() {
  return new Match.Profile(this);
};

/*
Match.Profile = function(match){
  if(_.isObject(match)){
    _.extend(this, match);
    this.fields = _.map(match.fields, function(f) { return _.clone(f); });
  } else {
    this.fields = [
    createMatch('Internal', 'Ingress Port', 'in_port', true, false, 0),
    createMatch('Internal', 'Physical Port', 'in_phyPort', true, false, 0),
    createMatch('Internal', 'Metadata', 'in_metadata', true, true, 0),
    createMatch('Internal', 'Tunnel', 'in_tunnel', true, true, 0),
    createMatch('Ethernet', 'Src', 'eth_src', true, true, '0xffffffffffff'),
    createMatch('Ethernet', 'Dst', 'eth_dst', true, true, '0xffffffffffff'),
    createMatch('Ethernet', 'Type/Len', 'eth_typelen', true, false, '0xffff'),
    createMatch('ARP', 'Opcode', 'arp_opcode', true, false, 0),
    createMatch('ARP', 'SHA', 'arp_sha', true, false, '0xffffffffffff'),
    createMatch('ARP', 'SPA', 'arp_spa', true, true, '0xffffffff'),
    createMatch('ARP', 'THA', 'arp_tha', true, true, '0xffffffffffff'),
    createMatch('ARP', 'TPA', 'arp_tpa', true, true, '0xffffffff'),
    createMatch('VLAN', 'PCP', 'vlan_pcp', true, true, '0x7'),
    createMatch('VLAN', 'VID', 'vlan_vid', true, true, '0x0fff'),
    createMatch('MPLS', 'Label', 'mpls_label', true, true, '0x0fffff'),
    createMatch('MPLS', 'Traffic Control', 'mpls_tc', true, true, '0x7'),
    createMatch('MPLS', 'BOS', 'mpls_bos', true, true, '0x0fffff'),
    createMatch('IPv4', 'DSCP', 'ipv4_dscp', true, true, '0x3f'),
    createMatch('IPv4', 'ECN', 'ipv4_ecn', true, true, '0x03'),
    createMatch('IPv4', 'Proto', 'ipv4_proto', true, true, '0xff'),
    createMatch('IPv4', 'Src', 'ipv4_src', true, true, '0xffffffff'),
    createMatch('IPv4', 'Dst', 'ipv4_dst', true, true, '0xffffffff'),
    createMatch('IPv6', 'Src', 'ipv6_src', true, true,
      '0xffffffffffffffffffffffffffffffff'),
    createMatch('IPv6', 'Dst', 'ipv6_dst', true, true,
      '0xffffffffffffffffffffffffffffffff'),
    createMatch('IPv6', 'Flow Label', 'ipv6_flabel', true, true,
      '0xfffff'),
    createMatch('ICMPv6', 'Type', 'icmpv6_type', true, true, '0xff'),
    createMatch('ICMPv6', 'Code', 'icmpv6_code', true, true, '0xff'),
    createMatch('ICMPv4', 'Type', 'icmpv4_type', true, true, '0xff'),
    createMatch('ICMPv4', 'Code', 'icmpv4_code', true, true, '0xff'),
    createMatch('TCP', 'Src', 'tcp_src', true, true, '0xffff'),
    createMatch('TCP', 'Dst', 'tcp_dst', true, true, '0xffff'),
    createMatch('UDP', 'Src', 'udp_src', true, true, '0xffff'),
    createMatch('UDP', 'Dst', 'udp_dst', true, true, '0xffff'),
    createMatch('SCTP', 'Src', 'sctp_src', true, true, '0xffff'),
    createMatch('SCTP', 'Dst', 'sctp_dst', true, true, '0xffff'),
    createMatch('IPv6 ND', 'Target', 'nd_target', true, true,
    '0xffffffffffffffffffffffffffffffff'),
    createMatch('IPv6 ND', 'Link-Layer', 'nd_hw', true, true, '0xffffffffffff')
    ];
  }
};
*/
Match.Profile.TIPS ={
  in_port: 'Match on ingress port',
  in_phyPort: 'Match on physical port',
  in_metadata: 'Match on metadata',
  in_tunnel: 'Match on metadata associated with a logical port',
  eth_src: 'Match on Ethernet source address',
  eth_dst: 'Match on Ethernet destination address',
  eth_typelen: 'Match on Ethernet type/length field',
  arp_opcode: 'Match on ARP message type',
  arp_sha: 'Match on Source hardware address',
  arp_spa: 'Match on Source protocol address',
  arp_tha: 'Match on Target hardware address',
  arp_tpa: 'Match on Target protocol address',
  vlan_pcp: 'Match on VLAN priority code',
  vlan_vid: 'Match on VLAN ID',
  mpls_label: 'Match on MPLS label',
  mpls_tc: 'Match on MPLS tc',
  mpls_bos: 'Match on MPLS bos',
  ipv4_dscp: 'Match on IPv4 Differentiated Services Code Type',
  ipv4_ecn: 'Match on Explicit Congestion Notification',
  ipv4_proto: 'Match on Protocol',
  ipv4_src: 'Match on IPv4 source',
  ipv4_dst: 'Match on IPv4 destination',
  ipv6_dst: 'Match on IPv6 destination',
  ipv6_src: 'Match on IPv6 source',
  ipv6_flabel: 'Match on IPv6 Flow Label',
  icmpv4_type: 'Match on ICMPv4 Type',
  icmpv4_code: 'Match on ICMPv4 Code',
  icmpv6_type: 'Match on ICMPv6 Type',
  icmpv6_code: 'Match on ICMPv6 Code',
  tcp_src: 'Match on TCP source',
  tcp_dst: 'Match on TCP destination',
  udp_src: 'Match on UDP source',
  udp_dst: 'Match on UDP destination',
  sctp_src: 'Match on SCTP source',
  sctp_dst: 'Match on SCTP destination',
  nd_target: 'Match on IPv6 Neighbor Discovery target',
  nd_hw: 'Match on IPv6 Neighbor Discovery link-layer address'
};

Match.Profile.TESTS = {
  in_port: fgConstraints.isUInt(0, 0xffffffff),
  in_phyPort: fgConstraints.isUInt(0, 0xffffffff),
  in_metadata: fgConstraints.isUInt(0, 0xffffffffffffffff),
  in_tunnel: fgConstraints.isUInt(0, 0xffffffffffffffff),
  eth_src: fgConstraints.isUInt(0, 0xffffffffffff),
  eth_dst: fgConstraints.isUInt(0, 0xffffffffffff),
  eth_typelen: fgConstraints.isUInt(0, 0xffff),
  arp_opcode: fgConstraints.isUInt(0, 0x1),
  arp_sha: fgConstraints.isUInt(0, 0xffffffffffff),
  arp_spa: fgConstraints.isUInt(0, 0xffffffff),
  arp_tha: fgConstraints.isUInt(0, 0xffffffffffff),
  arp_tpa: fgConstraints.isUInt(0, 0xffffffff),
  vlan_pcp: fgConstraints.isUInt(0, 0x7),
  vlan_dei: fgConstraints.isUInt(0, 0x3),
  vlan_vid: fgConstraints.isUInt(0, 0x0fff),
  vlan_typelen: fgConstraints.isUInt(0, 0xffff),
  mpls_label: fgConstraints.isUInt(0, 0x0fffff),
  mpls_tc: fgConstraints.isUInt(0, 0x7),
  mpls_bos: fgConstraints.isUInt(0, 0x0fffff),
  ipv4_dscp: fgConstraints.isUInt(0, 0x3f),
  ipv4_ecn: fgConstraints.isUInt(0, 0x03),
  ipv4_proto: fgConstraints.isUInt(0, 255),
  ipv4_src: fgConstraints.isUInt(0, 0xffffffff),
  ipv4_dst: fgConstraints.isUInt(0, 0xffffffff),
  icmpv4_type: fgConstraints.isUInt(0, 0xff),
  icmpv4_code: fgConstraints.isUInt(0, 0xff),
  icmpv6_type: fgConstraints.isUInt(0, 0xff),
  icmpv6_code: fgConstraints.isUInt(0, 0xff),
  ipv6_src: fgConstraints.isUInt(0,
    0xffffffffffffffffffffffffffffffff),
  ipv6_dst: fgConstraints.isUInt(0,
    0xffffffffffffffffffffffffffffffff),
  ipv6_flabel: fgConstraints.isUInt(0,0xfffff),
  tcp_src: fgConstraints.isUInt(0, 0xffff),
  tcp_dst: fgConstraints.isUInt(0, 0xffff),
  udp_src: fgConstraints.isUInt(0, 0xffff),
  udp_dst: fgConstraints.isUInt(0, 0xffff),
  sctp_src: fgConstraints.isUInt(0, 0xffff),
  sctp_dst: fgConstraints.isUInt(0, 0xffff),
  nd_target: fgConstraints.isUInt(0,
    0xffffffffffffffffffffffffffffffff),
  nd_hw: fgConstraints.isUInt(0,
    0xffffffffffff)
};

return {
  MatchField_UI: MatchField_UI,
  Match: Match,
  getOptions: getOptions,
  mkByValue: mkByValue,
  mkByName: mkByName,
  Set: Set,
  Profile: Match.Profile
};

});