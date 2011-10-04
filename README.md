scrappit.js (1.2K)
==================

> A simple container and lifecycle manager for scrapps.

Scrapps are self-contained JavaScript programs that execute within existing web pages (or any JS runtime for that matter). They are used to build and modify interfaces - including the interface at [http://scrappit.org](http://scrappit.org).

In this way, scrapps are kinda like userscripts, bookmarklets, or extensions. And sometimes the goal is similar - to customize user interfaces.

**However, there are a few key differences between scrappit.js and existing technologies:**

*   scrappit.js does not depend on any browser or extension-specific API's - it's 100% vanilla JavaScript.
*   scrappit.js orchestrates the running of many scrapps on a page at a time, keeping containment and stability.
*   Scrapps are plain old JavaScript objects. Scrapps express metadata and behaviors via their properties.

        var myScrapp = { name: "Unicorn List Bullets", launch : function() { ... } }

*   Scrapps have a lifecycle. It starts with a call to `myScrapp.launch()`. It ends when scrappit.js publishes a `close` event to the scrapp. The scrapp, having subscribed to this event, should gracefully remove its impact from the page when it receives it.

        var myScrapp = { ..., launch : function($) {
            $("ul").ULnicorn();
            this.subscribe("close", function() { $("ul").kThxBye(tears[0]) })
          }
        }

*   Each scrapp is equipped with publish and subscribe methods. This lets them interact predictably with scrappit.js, other scrapps, and scrappit.js plugins in a loosely coupled manner.


*   scrappit.js itself is event based - this makes writing event-based plugins easy:

        scrappit.subscribe('launch.scrapp', function(scrapp) {
          console.debug("The " + scrapp.name + " scrapp has launched!");
        }

*   Scrapps help you load conflict-free dependencies using the AMD (asynchronous module definition) pattern.

        var myScrapp = {
          require : ["http://scrappit.org/app-build/scripts/libs/jquery-amd.js"],
          launch : function($) {
            $("h1").html("i haz a jqueris!");
          }
         }

    Note that the file you're requiring must define itself as a module for this to work.

*   Here's another example for extra credit:

        var myScrapp = {
          require : {
            baseUrl : "http://scrappit.org/app-build/scripts/libs",
            deps: ["jquery-amd.js", "sideburn.js", "mustache.js"]
          },
          launch : function($, sideburn, mustache) {
            //strip attributes from non-relative links and color them orange
            $.each($("a[href^=http]"), function(index, item) {
              item.html(
                mustache.to_html(
                  sideburn(item[0]), "<a href='{{href}}' style='color: orange;'>{{text}}</a>"))
            });
          }
        }

Downloads
---------
**Bundled and namespaced with require.js**

*   **build/scrappit-amd.min.js** - 18K min+gzip - includes scrappit.js and require.js, all namespaced onto `scrappit` (predictable, no global scope impact). Use this bundle's AMD methods like this:

        scrappit.define({ my : 'module'});
        scrappit.require(['module'], function(module) { ... });

**Standalone**

*   **build/scrappit.min.js** - 1.2K min+gzip - Production standalone version
*   **build/scrappit.js** - Uncompressed version of scrappit.js with lots of comments


Because the use and meaning of `define` and `require` across the web is not universal, it's
a much safer to use the bundled version if you're going to run scrappit.js on pages you don't control.
This places the `define` and `require` AMD methods onto the `scrappit` namespace and prevents global leakage.

The standalone versions are great if you already have require.js or another AMD loader in your project. Note that
the `define` calls in the standalone version are anonymous, meaning that scrappit.js is ready to include into
your build (e.g. the require.js optimizer), or to `require` onto your page. (And it also means you should
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