scrappit.js (1.2K)
==================

> A boilerplate for interface customization

scrappit.js is a lifecycle manager, dependency manager and runtime environment for scrapps.

Scrapps are self-contained JavaScript programs that execute within existing JavaScript environments (i.e. web pages). Often, they are used to create or modify user interfaces. Check out [http://scrappit.org](http://scrappit.org) for an example.

In this way, scrapps are similar to userscripts, bookmarklets, and extensions. If you like those things, you'll love this thing.

Usage
-------------
**What you need to know about scrappit.js:**

*   scrappit.js is 100% vanilla JavaScript, just like Mom used to make. It works everywhere. It doesn't depend on browser or extension-specific API's.
*   scrappit.js is an on-page application runtime, and scrapps are the apps. Any number of scrapps can run simultaneously without conflict - even among dependencies (some assembly required).
*   Communication with scrappit.js is event based. Subscribe to events like so:

        scrappit.subscribe('launch.scrapp', function(scrapp) {
          console.debug("The " + scrapp.name + " scrapp has launched!");
        })

**Here's what scrapps are like:**

*   Scrapps are just plain old JavaScript objects. Scrapps express metadata and behaviors via their properties.

        var myScrapp = { name: "Unicorn List Bullets", launch : function() { ... } }

*   Scrapps have a lifecycle. It starts when scrappit.js calls `myScrapp.launch()`. It ends when scrappit.js publishes a `close` event to the scrapp. The scrapp, having subscribed to this event, should gracefully remove its impact from the page when it receives it.

        var myScrapp = { ..., launch : function($) {
            $("ul").ULnicorn();
            this.subscribe("close", function() { $("ul").kThxBye(tears[0]) })
          }
        }

*   Scrapps also use a simple publish and subscribe model to interact with scrappit.js and scrappit.js plugins.

*   scrappit.js loads dependencies for each scrapp using the AMD (asynchronous module definition) pattern. Declare dependencies as a simple array or (require.js compatible) config object, and receive them as simple function arguments.

        var myScrapp = {
          require : ["http://scrappit.org/app-build/scripts/libs/jquery-amd.js"],
          launch : function($) {
            $("h1").html("wuz by jqueries");
          }
         }

    AMD API methods (`require`/`define`) must be available when scrappit is loaded for `require` support to be available.
    The files you require, e.g. jQuery, must also use `define` when available. [scrappit.org/code](http://scrappit.org/code) maintains a collection of AMD-compatible libraries and ports.

*   Here's another example scrapp for some extra credit. This scrapp exposes each external link on a page in just a few lines of code. It illustrates the use of dependencies.

        var myScrapp = {
          require : {
            baseUrl : "//s3.amazonaws.com/o.scrappz.com/app-build/scripts/libs",
            deps: ["jquery-amd", "sideburn", "mustache"]
          },
          launch : function($, sideburn, mustache) {
            $.each($("a[href^=http]"), function(index, item) {
              $(this).html(
                mustache.to_html(
                    "<a href='{{href}}' style='color: orange;'>{{text}}</a>",
                    sideburn(item)));
            });
          }
        }

Downloads
---------
Here's all you need to get started:

*   **lib-build/scrappit.js** Uncompressed version of scrappit.js with lots of comments. Add it to your project's AMD-compatible build process or use it in development.
*   **lib-build/scrappit.min.js** - 1.2K min+gzip - production version. If you're not using a build process, you can use this version to run in your production environment.

Running
-------
Once you have scrappit.js downloaded and copied into your project, here's how to run it:

    require(['scrappit'], function(scrappit) {
      scrappit({
        // ... scrapp methods go here ...
      });
    });

scrappit.js will register via `define` if it's available. If not, it will add itself as to global as `scrappit` and you can use it like this:

    <script type="text/javascript" src="scrappit.js"></script>
    <script type="text/javascript">
      scrappit({ ... });
    </script>

`scrappit` does have a noConflict method should you need to use it. However, I recommend you use the AMD pattern instead to avoid conflict with other scrappits.

Tests
-----
Works with:

*   Chrome
*   Firefox
*   Safari
*   Internet Explorer 6+
*   Opera

The tests are in `/tests` (surprise). `test.html` contains the basic tests and illustrations of scrappit.js usage.

Also included are tests for scrappit's AMD support in `amd-test.html` and `namespaced-amd-test.html`. Make sure to run `make test` before running the tests.

The namespaced-amd-test verifies that scrappit and scrapps use a namespaced AMD build properly. (i.e. that the require js build optimizer renames multiple sections appropriately).

More Information
----------------
scrappit.js is a small piece of a bigger effort to give users more control and choice on the web. For more information, check out the scrappit project at [http://scrappit.org](http://scrappit.org).

Issues and Contributions
------------------------
Very welcome! Please use Github Issues, forks and pull requests.

License
-------
(The MIT License)

Copyright (c) 2011 [Josh Dzielak](http://joshdzielak.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.