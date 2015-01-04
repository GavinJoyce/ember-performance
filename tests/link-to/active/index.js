/* global TestClient */

/*
 *
 * this is a placeholder test, the current path is extremely fast, as the setup:
 *
 * - has only 1 route
 * - the route is currently not active
 * - no query params
 * - only one link-to
 * = the route name is simple foo.bar.baz would be considered complex
 *
 * future work should flesh out with more variations on the above points
 *
 */

MicroTestClient.run({
  name: 'link-to get(\'active\')',

  setup: function() {
    var Router = Ember.Router.extend();

    Router.map(function() {
      this.route('foo');
    });

    var router = Router.create();

    var link = Ember.LinkView.create({
      router: router,
      params: ['foo','bar', 'baz']
    });

    window.link = link; // hack until the profileRunner is fixed
  },

  test: function() {
    link.get('active');
  }
});