const requireNode = window.requireNode;
import Service from '@ember/service';
const { remote } = requireNode('electron');
const currentWindow = remote.getCurrentWindow();
import { hash } from 'rsvp';
import { tracked } from '@glimmer/tracking';

const DELAY = 20; // s

class Data {
  @tracked basicInfos = {};
  @tracked sensorInfos = {};
  @tracked controlInfos = {};
}

export default class DaikinService extends Service {
  daikin = currentWindow.daikin;

  data = new Data();

  historics = [];

  @tracked isLoading = false;

  @tracked error = null;

  _timeout = null;

  async startSynchro() {
    this.stopSynchro();
    return await this.synchro();
  }

  stopSynchro() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  async update() {
    this.isLoading = true;
    try {
      await this.getAll();
    } catch(e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
    
    return this.data;
  }

  async synchro() {
    await this.update();
    this.stopSynchro();
    this._timeout = setTimeout(this.synchro.bind(this), DELAY*1000);
    return this.data;
  }

  async _getBasicInfo() {
    this.data.basicInfos = await this.daikin.getBasicInfo();
    return this.data.basicInfos;
  }

  async _getSensorInfo() {
    this.data.sensorInfos = await this.daikin.getSensorInfo();
    return this.data.sensorInfos;
  }

  async _getControlInfo() {
    this.data.controlInfos = await this.daikin.getControlInfo();
    return this.data.controlInfos;
  }

  async _setControlInfo(roomName, controls) {
    return await this.daikin.setControlInfo(roomName, controls);
  }

  controlInfoToSet(info) {
    var controls = {};
    var minimals = ['pow', 'mode', 'stemp', 'shum', 'f_rate', 'f_dir'];
    minimals.forEach(key => {
      controls[key] = info[key];
    });
    return controls;
  }

  async getAll() {
    var data = await hash({
      basicInfos: this._getBasicInfo(),
      sensorInfos: this._getSensorInfo(),
      controlInfos: this._getControlInfo()
    });
    this.historize(data);
    return data;
  }

  historize(data) {
    this.historics.push({ dt: new Date(), data });
    const max = 24*60*60 / DELAY;
    while(this.historics.length > max) {
      this.historics.pop();
    }
  }

  async setControlInfo(roomName, controls) {
    await this.daikin.setControlInfo(roomName, controls);
    return this.getAll();
  }
}
