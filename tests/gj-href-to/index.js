/* global TestClient */
(function() {

  var application;

  function getApplication() {
    var apps = Ember.Namespace.NAMESPACES.filter(function(namespace) {
      return namespace instanceof Ember.Application;
    });

    return apps[0];
  }

  function containerLookup(key) {
    if(application === undefined || application.testing) {
      application = getApplication();
    }

    return application.__container__.lookup(key);
  }

  function getRouter() {
    return containerLookup('router:main');
  }

  var appNeedsClickHandler = true;

  function setupClickHandler() {
    Ember.$(document.body).on('click', 'a', function(e) {
      var $target = Em.$(e.currentTarget);
      var handleClick = (e.which === 1 && !e.ctrlKey && !e.metaKey);

      if(handleClick && !$target.hasClass('ember-view') && Ember.isNone($target.attr('data-ember-action'))) {
        var router = getRouter();

        var url = $target.attr('href');
        var rootUrlLength = router.rootURL.length;
        if(rootUrlLength > 1) {
          url = url.substr(rootUrlLength);
        }

        if(router.router.recognizer.recognize(url)) {
          router.handleURL(url);
          router.router.updateURL(url);
          return false;
        }
      }
      return true;
    });
  }

  function hrefTo(params) {
    if(appNeedsClickHandler) {
      setupClickHandler();
      appNeedsClickHandler = false;
    }

    var lastParam = params[params.length - 1];

    var queryParams = {};
    if (lastParam && lastParam.isQueryParams) {
      queryParams = params.pop();
    }

    var targetRouteName = params.shift();

    var args = [targetRouteName];
    args.push.apply(args, params);
    args.push({ queryParams: queryParams.values });

    var router = getRouter();
    return router.generate.apply(router, args);
  }

  var ContainerView, ViewClass, view;

  var template =
    "<a href=\"{{href-to 'index'}}\">Home</a>" +
    "<a href=\"{{href-to 'about'}}\">About</a>" +
    "<a href=\"{{href-to 'contact-us'}}\">Contact Us</a>" +
    "<a href=\"{{href-to 'index' (query-params a='aaa' b='bbb' c='ccc')}}\">Home with query params</a>" +
    "<a href=\"{{href-to 'parent.child1'}}\">Parent Child 1</a>" +
    "<a href=\"{{href-to 'parent.child2'}}\">Parent Child 2</a>" +
    "<a href=\"{{href-to 'parent.child3'}}\">Parent Child 3</a>" +
    "<a href=\"{{href-to 'contacts.contact.details' view.contact1}}\">Contact 1</a>" +
    "<a href=\"{{href-to 'contacts.contact.details' view.contact2}}\">Contact 2</a>" +
    "<a href=\"{{href-to 'contacts.contact.details' view.contact3}}\">Contact 3</a>";

  TestClient.run({
    name: 'GJ href-to',

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

      Ember.HTMLBars._registerHelper('href-to', hrefTo);


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
