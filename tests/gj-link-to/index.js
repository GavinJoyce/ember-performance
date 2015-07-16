/* global TestClient */
(function() {

  var ContainerView, ViewClass, view;

  var template =
    "{{#link-to 'index'}}Home{{/link-to}}" +
    "{{#link-to 'about'}}About{{/link-to}}" +
    "{{#link-to 'contact-us'}}Contact Us{{/link-to}}" +
    "{{#link-to 'index' (query-params a='aaa' b='bbb' c='ccc')}}Home with query params{{/link-to}}" +
    "{{#link-to 'parent.child1'}}Parent Child 1{{/link-to}}" +
    "{{#link-to 'parent.child2'}}Parent Child 2{{/link-to}}" +
    "{{#link-to 'parent.child3'}}Parent Child 3{{/link-to}}" +
    "{{#link-to 'contacts.contact.details' view.contact1}}Contact 1{{/link-to}}" +
    "{{#link-to 'contacts.contact.details' view.contact2}}Contact 2{{/link-to}}" +
    "{{#link-to 'contacts.contact.details' view.contact3}}Contact 3{{/link-to}}";

  TestClient.run({
    name: 'GJ link-to',

    setup: function() {
      var App = Ember.Application.create({ rootElement: '#scratch' });

      App.Router.map(function() {
        this.route('about', { path: '/about' });
        this.route('favorites', { path: '/favs' });
        this.route('contact-us', { path: '/contact-us' });
        this.route('parent', function() {
          this.route('child1');
          this.route('child2');
          this.route('child3');
        });
        this.route('contacts', function() {
          this.route('contact', { path: ':contact_id' }, function() {
            this.route('details');
          });
        })
      });

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
        view = ViewClass.create({
          contact1: { id: 1 },
          contact2: { id: 2 },
          contact3: { id: 3 }
        });
        view.on('didInsertElement', resolve);
        ContainerView.addObject(view);
      });
    }
  });

})();
