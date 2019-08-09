import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class RoomComponent extends Component {

  @service daikin;

  @tracked roomName = '';

  @tracked isDialogShown = false;
  @tracked isTempDialogShown = false;
  @tracked isAirDialogShown = false;
  @tracked isDirDialogShown = false;

  title = '';

  @tracked tempConsign = 0;
  @tracked airConsign = 'B';
  @tracked dirConsign = '0';

  get isOn() {
    return  this.controlInfo.pow === '1';
  }

  get isLoading() {
    return this.daikin.isLoading;
  }

  get sensorInfo() {
    return this.daikin.data.sensorInfos[this.args.roomName];
  }

  get controlInfo() {
    return this.daikin.data.controlInfos[this.args.roomName];
  }

  get basicInfo() {
    return this.controls.pow.data.basicInfos[this.args.roomName];
  }

  @action
  toggleOnOff() {
    var controls = this.daikin.controlInfoToSet(this.controlInfo);
    controls.pow = controls.pow === "1" ? "0" : "1";
    this.controlInfo.pow = controls.pow;
    this.daikin.setControlInfo(this.args.roomName, controls);
  }

  @action
  showDialog(param) {
    this.tempConsign = parseFloat(this.controlInfo.stemp);
    this.airConsign = this.controlInfo.f_rate;
    this.dirConsign = this.controlInfo.f_dir;
    this.isDialogShown = true;
    this.isTempDialogShown = param === 'temp';
    this.isAirDialogShown = param === 'air';
    this.isDirDialogShown = param === 'dir';
  }

  @action
  hideDialog(param) {
    this.isDialogShown = false;
    if(param == 'ok') {
      var controls = this.daikin.controlInfoToSet(this.controlInfo);
      controls.stemp = this.tempConsign;
      controls.f_rate = this.airConsign;
      controls.f_dir = this.dirConsign;
      this.daikin.setControlInfo(this.args.roomName, controls);
    }
  }

}
