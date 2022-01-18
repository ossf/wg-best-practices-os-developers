/**
 * jquery-dlmenu
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;(function($, window, undefined) {
  'use strict'

  // global
  var Modernizr = window.Modernizr
  var $window = $(window)

  $.DLMenu = function(options, element) {
    this.$el = $(element)
    this._init(options)
  }

  // the options
  $.DLMenu.defaults = {
    // callback: click a link that has a sub menu
    // el is the link element (li); name is the level name
    onLevelClick: function(el, name) {
      return false
    },
    // callback: click a link that does not have a sub menu
    // el is the link element (li); ev is the event obj
    onLinkClick: function(el, ev) {
      return false
    },
    backLabel: 'Back',
    // Change to "true" to use the active item as back link label.
    useActiveItemAsBackLabel: false,
    // Change to "true" to add a navigable link to the active item to its child
    // menu.
    useActiveItemAsLink: false,
    // On close reset the menu to root
    resetOnClose: true,
    scrollBodyToClose: true,
    clickOutsideToClose: true,
  }

  $.DLMenu.prototype = {
    _init: function(options) {
      // options
      this.options = $.extend(true, {}, $.DLMenu.defaults, options)
      // cache some elements and initialize some variables
      this._config()

      var animEndEventNames = {
          WebkitAnimation: 'webkitAnimationEnd',
          OAnimation: 'oAnimationEnd',
          msAnimation: 'MSAnimationEnd',
          animation: 'animationend',
        },
        transEndEventNames = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd',
          msTransition: 'MSTransitionEnd',
          transition: 'transitionend',
        }
      // animation end event name
      this.animEndEventName =
        animEndEventNames[Modernizr.prefixed('animation')] + '.dlmenu'
      // transition end event name
      this.transEndEventName =
        transEndEventNames[Modernizr.prefixed('transition')] + '.dlmenu'
      // support for css animations and css transitions
      this.supportAnimations = Modernizr.cssanimations
      this.supportTransitions = Modernizr.csstransitions

      this._initEvents()
    },
    _config: function() {
      this.open = false

      var SEL = this.options.selectors
      this.$menu = this.$el.find(SEL.menu || '> ul.dl-menu')
      this.$menuItems = this.$menu.find(SEL.menuItem || 'li:not(.dl-back)')
      this.$trigger = this.$el.find(SEL.trigger || '> .dl-trigger')

      var $back = $('<li class="dl-back">').append(
        '<a href="#">' + this.options.backLabel + '</a>'
      )
      this.$submenus = this.$el.find(SEL.submenu || 'ul.dl-submenu')
      this.$backs = this.$submenus.map(function() {
        return $back
          .clone()
          .prependTo(this)
          .get(0)
      })

      // Set the label text for the back link.
      if (this.options.useActiveItemAsBackLabel) {
        this.$backs.each(function() {
          var $this = $(this)
          var parentText = $this
            .parents('li:first')
            .find('a:first')
            .text()
          $this.find('a:first').html(parentText)
        })
      }
      // If the active item should also be a clickable link, create one and put
      // it at the top of our menu.
      if (this.options.useActiveItemAsLink) {
        this.$submenus.prepend(function() {
          var $activeItem = $(this)
            .parents('li:not(.dl-back):first')
            .find('a:first')

          var href = $activeItem.attr('href')
          var text = $activeItem.text()
          return $('<li class="dl-parent">').append(
            '<a href="' + href + '">' + text + '</a>'
          )
        })
      }
    },
    _initEvents: function() {
      var self = this

      var triggerEvent = this.options.triggerOn || 'click'
      this.$trigger.on(triggerEvent + '.dlmenu', function() {
        if (self.open) {
          self._closeMenu()
        } else {
          self._openMenu()
        }
        return false
      })

      var animatedClasses = this.options.animatedClasses
      this.$menuItems.on('click.dlmenu', function(event) {
        event.stopPropagation()

        var $item = $(this),
          $submenu = $item.children('ul.dl-submenu')

        // Only go to the next menu level if one exists AND the link isn't the
        // one we added specifically for navigating to parent item pages.
        if (
          $submenu.length > 0 &&
          !$(event.currentTarget).hasClass('dl-subviewopen')
        ) {
          var $flyin = $submenu
              .clone()
              .css('opacity', 0)
              .insertAfter(self.$menu),
            onAnimationEndFn = function() {
              self.$menu
                .off(self.animEndEventName)
                .removeClass(animatedClasses && animatedClasses.classout)
                .addClass('dl-subview')
              $item
                .addClass('dl-subviewopen')
                .parents('.dl-subviewopen:first')
                .removeClass('dl-subviewopen')
                .addClass('dl-subview')
              $flyin.remove()
            }

          setTimeout(function() {
            if (animatedClasses) {
              $flyin.addClass(animatedClasses.classin)
              self.$menu.addClass(animatedClasses.classout)
            }
            if (self.supportAnimations) {
              self.$menu.on(self.animEndEventName, onAnimationEndFn)
            } else {
              onAnimationEndFn.call()
            }

            self.options.onLevelClick($item, event)
          })

          return false
        } else {
          self.options.onLinkClick($item, event)
        }
      })
      this.$backs.on('click.dlmenu', function(event) {
        var $this = $(this),
          $submenu = $this.parents('ul.dl-submenu:first'),
          $item = $submenu.parent(),
          $flyin = $submenu.clone().insertAfter(self.$menu)

        var onAnimationEndFn = function() {
          self.$menu
            .off(self.animEndEventName)
            .removeClass(animatedClasses && animatedClasses.classin)
          $flyin.remove()
        }

        setTimeout(function() {
          if (animatedClasses) {
            $flyin.addClass(animatedClasses.classout)
            self.$menu.addClass(animatedClasses.classin)
          }
          if (self.supportAnimations) {
            self.$menu.on(self.animEndEventName, onAnimationEndFn)
          } else {
            onAnimationEndFn.call()
          }

          $item.removeClass('dl-subviewopen')

          var $subview = $this.parents('.dl-subview:first')
          if ($subview.is('li')) {
            $subview.addClass('dl-subviewopen')
          }
          $subview.removeClass('dl-subview')
        })

        return false
      })
    },
    closeMenu: function(callback) {
      if (this.open) {
        this._closeMenu(callback)
      }
    },
    _closeMenu: function(callback) {
      var self = this,
        onTransitionEndFn = function() {
          self.$menu.off(self.transEndEventName)
          if (self.options.resetOnClose) {
            self._resetMenu()
          }
          callback && callback()
        }

      // Remove the close listeners.
      $window.off('click.dlmenu scroll.dlmenu')

      this.$menu.removeClass('dl-menuopen')
      this.$menu.addClass('dl-menu-toggle')
      this.$trigger.removeClass('dl-active')

      if (this.supportTransitions) {
        this.$menu.on(this.transEndEventName, onTransitionEndFn)
      } else {
        onTransitionEndFn.call()
      }

      this.open = false
    },
    openMenu: function() {
      if (!this.open) {
        this._openMenu()
      }
    },
    _openMenu: function() {
      var self = this
      if (this.options.scrollBodyToClose) {
        $window.one('scroll.dlmenu', function() {
          self._closeMenu()
        })
      }
      if (this.options.clickOutsideToClose) {
        $window.one('click.dlmenu', function(event) {
          var el = self.$el.get(0)
          el.contains(event.target) || self._closeMenu()
        })
      }
      this.$menu
        .addClass('dl-menuopen dl-menu-toggle')
        .on(this.transEndEventName, function() {
          $(this).removeClass('dl-menu-toggle')
        })
      this.$trigger.addClass('dl-active')
      this.open = true
    },
    // resets the menu to its original state (first level of options)
    _resetMenu: function() {
      this.$menu.removeClass('dl-subview')
      this.$menuItems.removeClass('dl-subview dl-subviewopen')
    },
    destroy: function() {
      this.closeMenu(function() {
        // Remove event listeners
        var triggerEvent = this.options.triggerOn || 'click'
        this.$trigger.off(triggerEvent + '.dlmenu')
        this.$menuItems.off('click.dlmenu')
        this.$backs.off('click.dlmenu')
        this.$menu.off(this.animEndEventName).off(this.transEndEventName)

        // Remove DLMenu instance
        this.$el.removeData('dlmenu')
      })
    },
  }

  var logError = function(message) {
    if (window.console) {
      window.console.error(message)
    }
  }

  $.fn.dlmenu = function(options) {
    if (typeof options === 'string') {
      var args = Array.prototype.slice.call(arguments, 1)
      this.each(function() {
        var instance = $.data(this, 'dlmenu')
        if (!instance) {
          logError(
            'cannot call methods on dlmenu prior to initialization; ' +
              "attempted to call method '" +
              options +
              "'"
          )
          return
        }
        if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
          logError("no such method '" + options + "' for dlmenu instance")
          return
        }
        instance[options].apply(instance, args)
      })
    } else {
      this.each(function() {
        var instance = $.data(this, 'dlmenu')
        if (instance) {
          instance._init()
        } else {
          instance = $.data(this, 'dlmenu', new $.DLMenu(options, this))
        }
      })
    }
    return this
  }
})(jQuery, window)
