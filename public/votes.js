// represents 1 row in the list.
function Vote(data) {
  var self = this;
  this.song = ko.observable(data.song);
  this.person = ko.observable(data.person);

  this.audioUrl = function(baseUrl) {
    return 'audioUrl='+baseUrl+encodeURIComponent(self.song());
  }
  this.bgClass = function() {
    return self.person() == '' ? 'needs-vote' : 'voted-on' ;
  }
}

// represents the view as a whole
function VotesViewModel(jq) {
	this.jq = jq;
  var self = this;

  this.saveMessage = ko.observable("Make your choices and save when done.");
  this.listName = ko.observable();
  // are we waiting for a 'load' click or a 'save' click?
  this.dataLoaded = ko.observable(false);

  this.people = ko.observableArray([]);
  this.votes = ko.observableArray([]);

  this.loadData = function() {
    self.jq.getJSON("/list/"+self.listName(), function(allData) {
      // when we get new data, build a Vote from each item.
      var mappedVotes = self.jq.map(allData, function(item) { return new Vote(item) });
      // set the list of votes
      self.votes(mappedVotes);
      self.dataLoaded(true);
    });
  }

  this.saveData = function() {
    self.jq.post("/list/"+self.listName(), {"songs":ko.toJS(self.votes)}, function(data, textStatus, jqXHR) {
      self.saveMessage('Saved! You can edit later by re-entering this list name.');
    });
  }

  // this runs when the viewmodel is created.
  self.jq.getJSON("/people", function(allData) {
    self.people(allData);
  });
}