import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LoadableComponent extends Component {
  @service daikin;

  get isLoading() {
    return this.daikin.isLoading;
  }
}
