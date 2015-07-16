/* global TestClient */
(function() {

  var ContainerView, ViewClass, view;

  var template = "hi";

  TestClient.run({
    name: 'GJ baseline',

    setup: function() {
      var App = Ember.Application.create({ rootElement: '#scratch' });

      ViewClass = Ember.View.extend({
        template: this.compile(template)
      });

      return new Ember.RSVP.Promise(function(resolve) {
        App.IndexView = Ember.ContainerView.extend({
          _triggerStart: function() {
            ContainerView = this;
            resolve();
          }.on('didInsertElement')
        });
      });
    },

    reset: function() {
      if (view) { ContainerView.removeObject(view); }

      return new Ember.RSVP.Promise(function(resolve) {
        Ember.run.next(resolve);
      });
    },

    test: function() {
      return new Ember.RSVP.Promise(function(resolve) {
        view = ViewClass.create({ people: TestClient.PEOPLE_JSON });
        view.on('didInsertElement', resolve);
        ContainerView.addObject(view);
      });
    }
  });

})();
