requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '/'
    }
});

require(['libs/text!header.html', 'libs/text!home.html', 'libs/text!footer.html', 'libs/text!Task.html'], function (headerTpl, homeTpl, footerTpl, TaskTpl) {
	
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			// "*actions": "home",
			"task/:id": "task",
			"task": "tasks"
		},
		initialize: function() {
			this.headerView = new HeaderView();
			this.headerView.render();
			this.footerView = new FooterView();
			this.footerView.render();
		},
		home: function() {


			this.homeView = new HomeView();
			this.homeView.render();
		},
		task: function(id) {
 
			this.taskView = new TasksView();
			this.taskView.render(id);

		},
		tasks: function() {
 
			this.taskView = new TasksView();
			this.taskView.render();

		}
	});


	HeaderView = Backbone.View.extend({
		el: "#header",
		templateFileName: "header.html",
		template: headerTpl,

		initialize: function() {
			// $.get(this.templateFileName, function(data){console.log(data);this.template=data});		
		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});

	FooterView = Backbone.View.extend({
		el: "#footer",
		template: footerTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	});
	HomeView = Backbone.View.extend({
		el: "#content",
		// template: "home.html",
		template: homeTpl,
		initialize: function() {

		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});


	var TaskModel = Backbone.Model.extend({
	  defaults: {
	    name: 'topic 1',
	    due: 0,
	    child: ''
	  },
	  initialize: function(){
	  }
	});
	TasksCollection = Backbone.Collection.extend({
    	model: TaskModel, // Generally best practise to bring down a Model/Schema for your collection
    	url: '/test/Tasks'
	 });

	TasksView = Backbone.View.extend({
		el: "#content",
		// template: "Task.html",
		template: TaskTpl,
		initialize: function() {
		},
		render: function(id) {
			// $(this.el).html(_.template(this.template));

 			var that = this;
      		var tasks = new TasksCollection({id: id});
			console.log(tasks);
      		tasks.fetch({
      			success: function(tasks) {
      		    $(that.el).html(_.template(that.template, {tasks: tasks.models, _:_}));
        	}
      	});


		}
	});
	

	TasksView = Backbone.View.extend({
		el: "#content",
		// template: "Task.html",
		template: TaskTpl,
		initialize: function() {
		},
		render: function(id) {
			// $(this.el).html(_.template(this.template));

 			var that = this;
      		var tasks = new TasksCollection({id: id});
			console.log(tasks);
      		tasks.fetch({
      			success: function(tasks) {
      		    $(that.el).html(_.template(that.template, {tasks: tasks.models, _:_}));
        	}
      	});
		}
	});
	
	app = new ApplicationRouter();
	Backbone.history.start({ pushState: true, root: '/'});
});


$(document).on("click", "a", function(e)
{

    var href = $(e.currentTarget).attr('href');

    var res = Backbone.history.navigate(href,true);
    //if we have an internal route don't call the server
    if(res)
        e.preventDefault();

});