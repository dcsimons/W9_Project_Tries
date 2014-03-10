window.App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},  
  initialize: function() {
    this.router = new this.Routers.Main();
    Backbone.history.start({pushState: true});

    App.autocompleter = new Autocompleter();
    var ws = new WebSocket('ws://' + window.location.host + window.location.pathname);
    ws.onmessage = function(m) { 
      App.autocompleter.add(m.data); 
    };

  }
};

App.Routers.Main = Backbone.Router.extend({

  routes: {
    "": "main"
  },

  initialize: function() {
    this.view = new App.Views.Index();
    $("#main").html(this.view.render().$el);
  }

  // main: function() {
  //   var view = new App.Views.Index();
  //   $("#main").html(view.render().$el);
  // }

});

App.Views.Index = Backbone.View.extend({

  template: function() {
    return "<form id='searchBox'><input id='searchWords' type='text' placeholder='Enter Search Words' autofocus autocomplete='off'></form>";
  },

  events: {
    "keyup #searchWords": "search"
  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  search: function(event) {
    var characters = $("#searchWords").val();
    if (characters === "") {
      $("#results").empty();
    }
    else {
      $("#results").empty();
      var complete_char = App.autocompleter.complete(characters);
      // var searchView = new App.Views.CompleteSearch(complete_char);
      _.each(complete_char, function(word) {
        $("#results").append("<h3>"+word+"</h3>");
      });
    }
  }

});

$(document).ready(function(){
  App.initialize();
});

