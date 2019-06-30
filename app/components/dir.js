import Component from '@glimmer/component';

export default class DirComponent extends Component {
  get color() {
    return this.args.color || '#444';
  }

  get dir() {
    return this.args.f_dir;
  }
}
