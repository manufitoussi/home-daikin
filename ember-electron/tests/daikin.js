const daikin = require('../data-layer/daikin');
daikin.getControlInfo('salon').then(data => {
  console.log('data:', data.salon);
  // var controls = daikin.controlInfoToSet(data.salon);
  // // controls.pow = 1;
  // controls.stemp = 25;
  // console.log('controls:', controls);
  // daikin.setControlInfo('salon', controls).then(data => {
  //   console.log(data);
  // });
});

