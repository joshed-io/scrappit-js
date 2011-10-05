scrappit.js (1.2K)
==================

> A boilerplate for interface customization

scrappit.js is a lifecycle manager, dependency manager and runtime environment for scrapps.

Scrapps are self-contained JavaScript programs that execute within existing JavaScript environments (i.e. web pages). Often, they are used to create or modify user interfaces. Check out [http://scrappit.org](http://scrappit.org) for an example.

In this way, scrapps are similar to userscripts, bookmarklets, and extensions. If you like those things, you'll love this scrapp thing.

Let's Jump In
-------------
**What you need to know about scrappit.js:**

*   scrappit.js is 100% vanilla JavaScript, just like Mom used to make. It works everywhere. It doesn't depend on browser or extension-specific API's.
*   scrappit.js is an on-page application runtime, and scrapps are the apps. Any number of scrapps can run simultaneously - with awareness and without conflict.
*   Communication with scrappit.js is event based (read: *easy*). Write plugins and subscribe to events like so:

        scrappit.subscribe('launch.scrapp', function(scrapp) {
          console.debug("The " + scrapp.name + " scrapp has launched!");
        }

**Here's what scrapps are like:**

*   Scrapps themselves are just plain old JavaScript objects. Scrapps express metadata and behaviors via their properties.

        var myScrapp = { name: "Unicorn List Bullets", launch : function() { ... } }

*   Scrapps have a lifecycle. It starts with a call to `myScrapp.launch()`. It ends when scrappit.js publishes a `close` event to the scrapp. The scrapp, having subscribed to this event, should gracefully remove its impact from the page when it receives it.

        var myScrapp = { ..., launch : function($) {
            $("ul").ULnicorn();
            this.subscribe("close", function() { $("ul").kThxBye(tears[0]) })
          }
        }

*   Like scrappit.js, scrapps use a simple publish and subscribe model to interact with scrappit.js, other scrapps, and scrappit.js plugins.

*   scrappit.js loads dependencies for each scrapp using the AMD (asynchronous module definition) pattern. Declare dependencies as a simple array or config object, and receive them as simple function arguments.

        var myScrapp = {
          require : ["http://scrappit.org/app-build/scripts/libs/jquery-amd.js"],
          launch : function($) {
            $("h1").html("wuz my jqueries");
          }
         }

    \(Note that the file you're requiring must define itself as a module for this to work. [scrappit.org/code](http://scrappit.org/code) maintains a collection of AMD-compatible libraries and ports.\)

*   Here's another example scrapp for some extra credit. This scrapp exposes each external link on a page in just a few lines of code.

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
**With AMD support provided by require.js**

*   **build/scrappit-amd.min.js** - 6.7K min+gzip - includes scrappit.js and require.js, all namespaced onto `scrappit` (predictable, no global scope impact). Any dependencies you load must register via `scrappit.define(...)` as follows:

        scrappit.define({ my : 'module'});
        scrappit.require(['module'], function(module) { ... }); //the code that requires it

**Standalone**

*   **build/scrappit.js** - Uncompressed version of scrappit.js with lots of comments and no bundled AMD. Add it to your project's AMD-compatible build.
*   **build/scrappit.min.js** - 1.2K min+gzip - Production standalone version


Because the use and meaning of `define` and `require` across the web is not universal, it's
a much safer to use the bundled version if you're going to run scrappit.js on pages you don't control.
This places the `define` and `require` AMD methods onto the `scrappit` namespace and prevents conflicts with existing global variables.

The standalone version is appropriate if you already have require.js or another AMD loader in your project. Note that
the `define` calls in the standalone version are anonymous, meaning that scrappit.js is ready to include into
your build (e.g. the require.js optimizer), or to `require` onto your page. (This also means you should
**not** include it as a script tag after your require.js script tag. This will cause a require.js error - Anonymous module definition.)

Tests
-----
See `/tests`. The main file, `test.html` contains tests and illustrations of scrappit.js usage.

Also included are tests for scrappit's AMD support in `amd_test.html` and `namespaced_amd_test.html` (which tests the bundled version).

More Information
----------------
Check out the scrappit project at [http://scrappit.org](http://scrappit.org).

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