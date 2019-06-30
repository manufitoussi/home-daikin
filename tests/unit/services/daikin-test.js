import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | daikin', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('service is accessible', function(assert) {
    let service = this.owner.lookup('service:daikin');
    assert.ok(service);
  });
});
