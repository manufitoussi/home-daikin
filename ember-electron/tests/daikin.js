const daikin = require('../data-layer/daikin');
daikin.getControlInfo('elina').then(data => {
  console.log('data:', data.elina);
  var controls = daikin.controlInfoToSet(data.elina);
  controls.pow = 0;
  // controls.stemp = 25;
  // console.log('controls:', controls);
  // daikin.setControlInfo('elina', controls).then(data => {
  //   console.log(data);
  // });
});

