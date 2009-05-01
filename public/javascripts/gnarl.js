
(function($) {
  Gnarl = function() {};

  $.extend(Gnarl, {
    Panel : {},
    View  : {},

    initialize : function(config) {
      this.duration = config.duration || 5000;
      this.limit    = config.limit    || 5;
      this.panel    = Disco.build(Gnarl.Panel);

      $('body').append(this.panel);
    },

    show: function(options) {
      var view = Disco.build(Gnarl.View, options);
      this.panel.append(view);
    }
  });

  $.extend(Gnarl.Panel, {
    content: function(builder) {
      with(builder) {
        div({ 'class': 'gnarl' });
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
        var self = this;

        this.sections = this.children('div');

        this.find('ul')
          .append('<li class="icon"><!-- TODO --></li>')
          .append('<li class="title">'   + this.title   + '</li>')
          .append('<li class="message">' + this.message + '</li>');

        this.click    (function() { self.on_click();     });
        this.mouseover(function() { self.on_mouseover(); });
        this.mouseout (function() { self.on_mouseout();  });

        this.fadeIn(1500, function() {
          self.timer = setTimeout(function() { self.destroy(1500); }, Gnarl.duration);
        });
      },

      on_click: function() {
        this.destroy('fast');
      },

      on_mouseover: function() {
        clearTimeout(this.timer);

        this.sections.stop();
        this.sections.css({ 'opacity': '1.0' });
      },

      on_mouseout: function() {
        var self = this;
        this.timer = setTimeout(function() { self.destroy(1500); }, Gnarl.duration);
      },

      destroy: function() {
        var self = this;
        this.sections.fadeOut((arguments[0]), function() {
          self.slideUp('fast', function() { self.remove(); });
        });
      }
    }
  });
})(jQuery);

