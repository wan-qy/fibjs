var test = require("test");
test.setup();

var http = require("http");
var gui = require("gui");
var coroutine = require("coroutine");
var os = require('os');

var base_port = coroutine.vmid * 10000;

describe("gui", function() {
	it("webview", function() {
		var check = false;
		var closed = false;
		var svr = new http.Server(8899 + base_port, function(r) {
			check = true;
		});
		svr.asyncRun();

		var win = gui.open("http://127.0.0.1:" + (8899 + base_port) + "/");

		for (var i = 0; i < 100 && !check; i++)
			coroutine.sleep(10);

		assert.ok(check);

		win.onclose(function() {
			closed = true;
		});

		GC();
		var no1 = os.memoryUsage().nativeObjects.objects;
		win.close();
		win = undefined;

		for (var i = 0; i < 100 && !closed; i++)
			coroutine.sleep(10);

		coroutine.sleep(100);

		GC();
		assert.equal(no1 - 1, os.memoryUsage().nativeObjects.objects);
	});
});

// test.run(console.DEBUG);