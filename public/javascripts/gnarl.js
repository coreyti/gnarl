(function($) {
  function Gnarl() {};

  $.extend(Gnarl, {
    queue : [],
    Panel : {},
    View  : {},

    initialize : function(config) {
      this.duration = config.duration || 5000;
      this.limit    = config.limit    || 5;
      this.panel    = Disco.build(Gnarl.Panel);

      $('body').append(this.panel);
    },

    display: function(options) {
      var view    = Disco.build(Gnarl.View, options);

      if(this.panel.count() < this.limit) {
        this.append(view);
      }
      else {
        this.queue.push(view);
      }
    },

    append: function(view) {
      var self = this;
      this.panel.append(view);

      view.fadeIn(1500, function() {
        view.timer = setTimeout(function() { self.remove(view); }, Gnarl.duration);
      });
    },

    remove: function(view, speed) {
      var self = this;
      var next = this.queue.shift();

      view.sections.fadeOut((speed || 1500), function() {
        view.slideUp('fast', function() {
          view.remove();
          window.clearTimeout(view.timer);

          (next && self.append(next));
        });
      });
    }
  });

  $.extend(Gnarl.Panel, {
    content: function(builder) {
      with(builder) {
        div({ 'class': 'gnarl' });
      }
    },

    methods: {
      count: function() {
        return this.children('div.message').length;
      }
    }
  });

  $.extend(Gnarl.View, {
    content: function(builder) {
      with(builder) {
        div({ 'class': 'message' }, function() {
          div({ 'class': 'top' });
          div({ 'class': 'mid' }, function() {
            ul();
          });
          div({ 'class': 'btm' });
        });
      }
    },

    methods: {
      after_initialize: function() {
        var self     = this;
        var content  = this.find('div.mid > ul');

        this.icon    && content.append($('<li class="icon"></li>').css('background-image', 'url(' + this.icon + ')'));
        this.title   && content.append('<li class="title">' + this.title + '</li>');
        this.message && content.append('<li class="message">' + this.message + '</li>');

        this.click    (function() { self.on_click(); });
        this.mouseover(function() { self.on_mouseover(); });
        this.mouseout (function() { self.on_mouseout();  });

        this.sections = this.children('div');
      },

      on_click: function() {
        Gnarl.remove(this, 'fast');;
      },

      on_mouseover: function() {
        clearTimeout(this.timer);

        this.sections.stop();
        this.sections.css({ 'opacity': '1.0' });
      },

      on_mouseout: function() {
        var self = this;
      }
    }
  });

  $.Gnarl = Gnarl;
})(jQuery);
