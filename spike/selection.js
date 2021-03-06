
var v0 = {
  flow: {
    priority: 4,
    match: [
      'in_port',
      'eth',
      'ipv4',
      'tcp'
    ],
    instructionSet: [{
      name: 'Meter'
    }, {
      name: 'Apply'
    }, {
      name: 'Clear'
    }, {
      name: 'Write'
    }, {
      name: 'Metadata'
    }, {
      name: 'Goto'
    }],
  ctx: {
  table: 9,
  key: {
    base: {
      name: 'Internal',
      attrs: [{
        name: 'in_port',
        value: 4,
      }, {
        name: 'in_phy_port',
       value: 6,
     }, {
       name: 'tunnel',
       value: '0xffffffffffffffff'
     }, {
       name: 'tunnel',
       value: 12435
     }]
   }
   protocols: [{
     name: 'Ethernet',
     attrs: [{
       name: 'Src',
       value: '00:02:03:04:05:06' 
     }, {
       name: 'Dst',
       value: '00:20:30:40:50:60'
     }, {
       name: 'Type',
       value: 'VLAN (0x8100'
     }]
   }]
  }
  }
};
