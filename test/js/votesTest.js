var jq = {
	getJSON: function(a, b) {
		console.debug(a, b);
	}
}

TestCase("votesTest", {
	setUp: function() {
	},
	tearDown: function() {
	},

	"test instance calls getJSON on instantiation": function() {
		var v = new VotesViewModel(jq);
	},
	"test audioUrl is built": function() {
		var v = new Vote({"song":"songname.mp3", "person":""});
		assertEquals(
			"audioUrl=http://test.com/songname.mp3",
			v.audioUrl("http://test.com/")
		);
	},

	"test bgClass is needs-vote when no person is assigned": function() {
		var v = new Vote({"person":""});
		assertEquals(
			"needs-vote",
			v.bgClass()
		);
	},
	"test bgClass is voted-on when a person is assigned": function() {
		var v = new Vote({"person":"anyone"});
		assertEquals(
			"voted-on",
			v.bgClass()
		);
	}

});