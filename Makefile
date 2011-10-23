all: build
  
build: clean
	node r.js -o lib/scripts/app.build.js
	rm -rf lib-build/scripts/app.build.js lib-build/build.txt
	uglifyjs -o lib-build/scripts/scrappit.min.js lib-build/scripts/scrappit.js
	
test: clean_test
	cp lib/scripts/scrappit.js test/lib/scripts/
	node r.js -o test/lib/scripts/amd.build.js
	node r.js -o test/lib/scripts/namespaced-amd.build.js

clean_test:
	mkdir -p test/lib-amd-build; rm -rf test/lib-amd-build/*
	mkdir -p test/lib-namespaced-amd-build; rm -rf test/lib-namespaced-amd-build/*

clean:
	mkdir -p lib-build; rm -rf lib-build/*

update_requirejs:
	cp ../requirejs/require.js scripts/lib/
	cp ../r.js/r.js ./
