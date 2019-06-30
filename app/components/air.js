import Component from '@glimmer/component';

export default class AirComponent extends Component {

  get color() {
    return this.args.color || '#444';
  }

  get rate() {
    return this.args.f_rate;
  }

  get force() {
    var rate = parseFloat(this.rate);
    if (isNaN(rate)) return 0;
    return rate - 2;
  }

}
