all: build
  
build: clean
	cp lib/scripts/scrappit.js lib-build/
	uglifyjs -o lib-build/scrappit.min.js lib-build/scrappit.js
	
test: clean_test
	cp lib/scripts/scrappit.js test/lib/scripts/
	node r.js -o test/lib/scripts/amd.build.js
	node r.js -o test/lib/scripts/namespaced-amd.build.js

run_test:
	open test/all.html

clean_test:
	mkdir -p test/lib-amd-build; rm -rf test/lib-amd-build/*
	mkdir -p test/lib-namespaced-amd-build; rm -rf test/lib-namespaced-amd-build/*

clean:
	mkdir -p lib-build; rm -rf lib-build/*

update_requirejs:
	cp ../requirejs/require.js test/lib/scripts
	cp ../r.js/dist/r-1.0.0.js r.js
