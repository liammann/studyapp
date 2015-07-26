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

require(['libs/text!header.html', 'libs/text!home.html', 'libs/text!footer.html', 'libs/text!Task.html', 'libs/text!sidebar.html'], function (headerTpl, homeTpl, footerTpl, TaskTpl, sidebarTpl) {
	
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "tasks",
			// "*actions": "home",
 			":id": "unit"
		},
		initialize: function() {
			this.headerView = new HeaderView();
			this.headerView.render();
			this.footerView = new FooterView();
			this.footerView.render();
		},
		unit: function() {
			this.sidebarView = new SidebarView();
			this.sidebarView.render();

			this.unitView = new UnitView();
			this.unitView.render();
		},
		// task: function(id) {
 
		// 	this.taskView = new TasksView();
		// 	this.taskView.render(id);

		// },
		tasks: function() {
 			this.sidebarView = new SidebarView();
			this.sidebarView.render();
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

	var UnitModel = Backbone.Model.extend({
	  defaults: {
	    name: 'unit 1',
	    colour: 0
	  }
	});
	UnitsCollection = Backbone.Collection.extend({
    	model: UnitModel, // Generally best practise to bring down a Model/Schema for your collection
    	url: '/test/Units'
	 });

	SidebarView = Backbone.View.extend({
		el: "#sidebar",
		template: sidebarTpl,
		render: function() {
			// $(this.el).html(_.template(this.template));
 			var that = this;
      		var units = new UnitsCollection();
      		units.fetch({
				error: function(collection, response, options) {
      				console.log('membersview fetch onerrorhandler');
      				alert(response.responseText);
  				},
      			success: function(units) {

      		    	$(that.el).html(_.template(that.template, {units: units.models, _:_}));
    			}
	      	});
		}
	});
	
	var TaskModel = Backbone.Model.extend({
	    urlRoot: '/test/Tasks',

	  	completed: function(attributes) {
      		this.save(attributes, {patch: true});
    	}
	});
	
	TasksCollection = Backbone.Collection.extend({
    	model: TaskModel, // Generally best practise to bring down a Model/Schema for your collection
    	url: '/test/Tasks',
	});
	var taskModel = new TaskModel();
    var tasks = new TasksCollection({model: taskModel});

	UnitView = Backbone.View.extend({
		el: "#content",
		template: sidebarTpl,
		render: function() {
			// $(this.el).html(_.template(this.template));
			var that = this;

			tasks.fetch({
				error: function(collection, response, options) {
					console.log('membersview fetch onerrorhandler');
					alert(response.responseText);
  				},
				success: function(units) {
					var unitsss = units.where({unit: "22"});
					console.log(unitsss);

					$(that.el).html(_.template(that.template, {units: unitsss.models, _:_}));
    			}
			});
		}
	});

	TasksView = Backbone.View.extend({
		el: "#content",
		model: taskModel,

		// template: "Task.html",
		template: TaskTpl,

		initialize: function() {
			this.first = [];
			this.currentTarget = [];
			this.model.bind("change", this.render);
		},
		events: {
  			'click .notes-btn':'slideDown',
  			'click .sub-btn':'slideDown',
  			'click .hours-btn':'slideDown',
  			'click .completed':'completed'
		},
		completed: function(evt) {
			console.log(evt.target.parentNode.parentNode.attributes[0].value);
        	var model = tasks.get(evt.target.parentNode.parentNode.attributes[0].value);
        	model.completed({
        	    open: false,
        	});
    	},
		slideDown: function(evt){

			var id = evt.target.parentNode.parentNode.attributes[0].value;

			if (this.currentTarget[id] ===  evt.target && !this.first[id]){
				$("#"+evt.currentTarget.attributes[0].value).slideUp();
				$(this.currentTarget[id]).removeClass("active");
				$(this.currentTarget[id].parentNode).removeClass("open");
				this.first[id] = true;
			} else {
	    		if ($(evt.target.parentNode).hasClass("open")) {
					$("#"+this.currentTarget[id].attributes[0].value).slideUp();
					$(this.currentTarget[id]).removeClass("active");
					$("#"+evt.currentTarget.attributes[0].value).slideDown();
					$(evt.target).addClass("active");
				}else{
					$(evt.target.parentNode).addClass("open");
					$("#"+evt.currentTarget.attributes[0].value).slideDown();
					$(evt.target).addClass("active");
				}
				this.currentTarget[id] = evt.target;
				this.first[id] = false;
			}

		},
		render: function() {
 			var that = this;
 			// $(that.el).html(_.template(that.template, {tasks: tasks.models, _:_}));
 
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