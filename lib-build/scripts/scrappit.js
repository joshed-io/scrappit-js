
/*
 scrappit.js
 http://scrappit.org
 Available via the MIT License
 Author: Josh Dzielak, Copyright (c) 2011
*/
(function(context, global, document) {

  var version = "0.1.1",

      //scrappit's global namespace
      nsScrappit = 'scrappit',

      guidCt = 0,

      //optimize minification
      undef = undefined,
      strUndef = '' + undef,
      toString = Object.prototype.toString,
      console = global.console,

      //existing scrappit in scope or in context
      ctxScrappit = context[nsScrappit];

  //common helper functions
  function isFunction(obj) {
    return toString.call(obj) === '[object Function]';
  }

  function isArray(obj) {
    return toString.call(obj) === '[object Array]';
  }

  function isObject(obj) {
    return toString.call(obj) === '[object Object]';
  }

  function clone(obj) {
    var newObj = (isArray(obj)) ? [] : {};
    for (i in obj) {
      if (obj[i] && isObject(obj[i])) {
        newObj[i] = clone(obj[i]);
      } else newObj[i] = obj[i]
    } return newObj;
  }

  function guid() {
    return ((++guidCt) + new Date().getTime().toString().slice(5));
  }

  //add publish/subscribe methods any object
  //inspired by pubsubjs - Morgan Roderick http://roderick.dk
  var addPubSub = (function() {

    var _nextToken = -1;

    function nextToken() {
      return (++_nextToken).toString();
    }

    function publish(messages, message, data, sync) {
      if (!messages.hasOwnProperty(message)) {
        return false;
      }
      var publishFunc = function() {
        var subscribers = clone(messages[message]); //avoid concurrent mod errors
        for (var i = 0, j = subscribers.length; i < j; i++) {
          var subscriber = subscribers[i];
          if (subscriber) {
            subscriber.func(data);
          }
        }
      };
      if (sync === true) {
        publishFunc();
      } else {
        setTimeout(publishFunc, 0);
      }
      return true;
    }

    function subscribe(messages, message, func) {
      if (!messages.hasOwnProperty(message)) {
        messages[message] = [];
      }
      var token = nextToken();
      messages[message].push({ token : token, func : func });
      return token;
    }

    function unsubscribe(messages, token) {
      for (var m in messages) {
        if (messages.hasOwnProperty(m)) {
          for (var i = 0, j = messages[m].length; i < j; i++) {
            if (messages[m][i].token === token) {
              messages[m].splice(i, 1);
              return true;
            }
          }
        }
      }
      return false;
    }

    return function(obj) {
      var messages = obj.messages = {}; //export for debugging
      obj.publish = function(message, data) {
        return publish(messages, message, data, false);
      };
      obj.publishSync = function(message, data) {
        return publish(messages, message, data, true);
      };
      obj.subscribe = function(message, func) {
        return subscribe(messages, message, func);
      };
      obj.unsubscribe = function(token) {
        return unsubscribe(messages, token);
      };
    }
  })();

  //this is wrapped because it might not need to be executed
  //if scrappit is already present as a function (see below)
  var scrappitFactory = function() {

    //setup internal scrappit
    var scrappit = function(scrapp) {
      return runScrapp(scrapp);
    };

    //exported as scrappit - this function takes a scrapp and runs it
    //a scrapp is an object that has at minimum a launch property
    function runScrapp(scrapp) {
      //mixin some framework to the provided scrapp object
      extendScrapp(scrapp);

      //let plugins act on scrapps before launch
      //avoid async here, might not apply in time
      scrappit.publishSync('beforeLaunch.scrapp', scrapp);

      provideAndLaunch(scrapp);
    }

    function extendScrapp(scrapp) {
      scrapp._uid = scrapp._uid || scrapp.id || guid();
      scrapp._deps_context = nsScrappit + '/' + scrapp._uid + '/deps';

      addPubSub(scrapp);

      //setup a requireDeps method that'll have a unique context applied,
      //such that requires by this scrapp dont interfere with scrappit or other contexts
      scrapp.requireDeps = function(cfg, deps, callback) {
        if (typeof define === 'function' && define.amd) {
          var depsContext = scrapp._deps_context;
          if (isObject(cfg)) {
            cfg.context = depsContext;
          } else {
            callback = deps, deps = cfg, cfg = {};
          }
          cfg.context = depsContext;

          require(cfg, deps, callback);
        }
      };

      scrapp.applyArgsAndLaunch = function() {
        //the default callback from module loading
        //is to apply args to the launch function and
        //then run onDependenciesReady
        var args = arguments;
        var oldScrappLaunch = scrapp.launch;
        scrapp.launch = function() {
          oldScrappLaunch.apply(scrapp, args);
        };
        scrapp.onDependenciesReady();
      };

      //wrapper for when dependencies are ready
      scrapp.onDependenciesReady = function() {
        launchScrapp(scrapp);
      };

      //closing a scrapp publishes a close message
      scrapp.close = function() {
        scrapp.publish('close');
      };

      var scrappCloseToken, scrappitCloseToken;

      function unsubscribeTokens() {
        scrapp.unsubscribe(scrappCloseToken);
        scrappit.unsubscribe(scrappitCloseToken);
      }

      //when the scrapp closes, tell scrappit
      scrappCloseToken = scrapp.subscribe('close', function() {
        unsubscribeTokens();
        scrappit.publish('close.scrapp', scrapp);
      });

      //when scrappit closes, tell the scrapp
      scrappitCloseToken = scrappit.subscribe('close', function(scrappit) {
        unsubscribeTokens();
        scrapp.close();
      });
    }

    //inspects the scrapp's require property and attempts to resolve
    //dependencies before launching the scrapp
    //require can be an array of full URL's or a configuration object
    //containing paths, deps, baseUrl, etc.
    //if a dependency supports AMD and registers via a define call,
    //the result of the define will be curried to the launch method
    function provideAndLaunch(scrapp) {
      var requireObj = scrapp.require;
      if (requireObj) {
        var cfg = {}, deps,
            defaultCallback = scrapp.applyArgsAndLaunch;

        //if a require js config object is used
        if (isObject(requireObj)) {
          cfg = requireObj;

          //shortcut - don't supply a callback, and the
          //default behavior of applying launch with the
          //loaded modules will happen
          //if you do supply a callback, make sure to
          //eventually call onDependenciesReady to launch the scrapp
          if (!cfg.callback) {
            cfg.callback = defaultCallback;
          }
        } else {
          //will be passed as array arg to require js
          deps = requireObj;
        }

        //call the scrapps require deps
        scrapp.requireDeps(cfg, deps, defaultCallback);
      } else {
        //no dependencies, launch
        scrapp.onDependenciesReady();
      }
      return scrapp;
    }

    //launches the scrapp
    function launchScrapp(scrapp) {
      try {
        //fire the actual method defined in the scrapp
        //arguments may have been bound already due to deps
        scrapp.launch();

        //typically, bind to scrapp.launch if you're interested in when scrapps
        //launch, e.g. notify the user that a scrapp launched
        scrappit.publish('launch.scrapp', scrapp);

      } catch (e) {
        //scrapp launch failed, likely due to bad code in the launch
        //method of the scrapp. exception is not thrown as it may
        //interfere with scrapps that are ok. exception is logged if possible.
        if (console && console.error) {
          console.error('The launch method of this scrapp threw an exception:');
          console.error(scrapp);
          console.error(e);
        }
      }
    }

    function init() {

      //assign a uid
      scrappit._uid = guid();

      //add publish and subscribe
      addPubSub(scrappit);

      //call to close scrappit and remove it,
      //also closing anything listening on the close event
      scrappit.close = function() {
        //publish sync so global is available but also pass reference
        //in case its not
        scrappit.publish('close', scrappit);
        //need to come after, cant share event handler
        context[nsScrappit] = undef;
      }

      scrappit.noConflict = function() {
        context[nsScrappit] = ctxScrappit;
        return scrappit;
      }
    }

    init();

    return scrappit;
  }

  function init() {
    var scrappit = scrappitFactory();

    if (typeof define === 'function' && define.amd) {
      define('scrappit',[],function() {
        return scrappit;
      });
    } else {
      context[nsScrappit] = scrappit;
    }
  }

  init();

})(this, window, document);
