all: optimizer
  
optimizer: clean
	node r.js -o scripts/app.build.js
	rm -rf build/lib build/src build/app.build.js build/build.txt build/requireLib.js
	uglifyjs -o build/scrappit-amd.min.js build/scrappit-amd.js
	
	cp scripts/src/scrappit.js build/scrappit.js
	uglifyjs -o build/scrappit.min.js build/scrappit.js
	
update_requirejs:
	cp ../requirejs/require.js scripts/lib/
	cp ../r.js/r.js ./

clean:
	mkdir -p build; rm -rf build/*
