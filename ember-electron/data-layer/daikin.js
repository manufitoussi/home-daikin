const fetch = require('node-fetch');
const { hash, resolve } = require('rsvp');
const parseResponse = txt => {
  const keyValueTexts = txt.split(',');

  if (keyValueTexts.length === 0) return null;

  const obj = {};
  keyValueTexts.forEach(keyValueTxt => {
    const keyValueArr = keyValueTxt.split('=');
    obj[keyValueArr[0]] = keyValueArr[1];
  });
  return obj;
};

const parseBasicInfo = txt => {
  var obj = parseResponse(txt);
  if (!obj) return null;
  if (!obj.name) return null;
  if (!obj.mac) return null;
  if (!obj.name) return null;
  if (!obj.rev) return null;
  if (!obj.grp_name) return null;
  obj.name = decodeURI(obj.name);
  obj.mac = decodeURI(obj.mac);
  obj.rev = decodeURI(obj.rev);
  obj.grp_name = decodeURI(obj.grp_name);
  return obj;
};

const _parseDefault = txt => {
  var obj = parseResponse(txt);
  if (!obj) return null;
  return obj;
};

const parseSensorInfo = txt => {
  return _parseDefault(txt);
};

const parseControlInfo = txt => {
  var obj = parseResponse(txt);
  if (!obj) return null;
  return obj;
};

const DEVICES = {
  salon: '192.168.1.29',
  elina: '192.168.1.23',
  parents: '192.168.1.41',
  jeanne: '192.168.1.37'
};

const getBasicInfo = name => {
  return fetch(`http://${DEVICES[name]}/common/basic_info`)
    .then(result => result.text())
    .then(parseBasicInfo);
}

const getSensorInfo = name => {
  return fetch(`http://${DEVICES[name]}/aircon/get_sensor_info`)
    .then(result => result.text())
    .then(parseSensorInfo);
}

const getControlInfo = name => {
  return fetch(`http://${DEVICES[name]}/aircon/get_control_info`)
    .then(result => result.text())
    .then(parseControlInfo);
}

const setControlInfo = (name, request) => {
  console.log('request:', request);
  return fetch(`http://${DEVICES[name]}/aircon/set_control_info?${request}`)
    .then(result => result.text())
    .then(parseControlInfo);
}

module.exports = {
  getBasicInfo() {
    if (names.length === 0) {
      names = Object.keys(DEVICES);
    }

    var requests = {};
    names.forEach(name => requests[name] = getBasicInfo(name));

    return hash(requests);
  },

  getSensorInfo(...names) {
    if (names.length === 0) {
      names = Object.keys(DEVICES);
    }

    var requests = {};
    names.forEach(name => requests[name] = getSensorInfo(name));

    return hash(requests);
  },

  getControlInfo(...names) {
    if (names.length === 0) {
      names = Object.keys(DEVICES);
    }

    var requests = {};
    names.forEach(name => requests[name] = getControlInfo(name));

    return hash(requests);
  },

  setControlInfo(name, controls) {
    var instructions = Object.keys(controls).map(key => `${key}=${controls[key]}`);
    if (instructions.length === 0) return resolve({});
    const request = instructions.join('&');
    return setControlInfo(name, request);
  },

  controlInfoToSet(info) {
    var controls = {};
    var minimals = ['pow', 'mode', 'stemp', 'shum', 'f_rate', 'f_dir'];
    minimals.forEach(key => {
      controls[key] = info[key];
    });
    return controls;
  }
};