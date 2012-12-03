/*jshint curly:false*/

/**
 * Lazy loading.
 *
 * @version 0.1.0
 *
 * @author João Henriques
 * @contact joao@iknowaghost.com
 */
(function (root, factory) {

    if (typeof define === 'function' && define.amd) define(['jquery'], factory);
    else factory(jQuery, window);

}(this, function ($, window, undefined) {

    // Create the defaults
    var name = 'lazyLodr',
        document = window.document,
        defaults = {
            range: 400,
            container: window
        };

    /**
     * Lazy loader plugin.
     *
     * @param {Element} element   The container to lazy load
     * @param {Object}  [options] The options
     */
    function LazyLodr(element, options) {

        // Merge the default options with the user options
        options = $.extend({}, defaults, options);

        var container = $(options.container);

        /**
         * Initialize the plugin.
         *
         */
        function initialize() {

            container.scroll($.proxy(render, this));
            container.resize($.proxy(render, this));

            viewportCalculus();
        }

        /**
         * Calculate the viewport.
         *
         */
        function viewportCalculus() {

            $(document).ready($.proxy(function () {
                window.setTimeout($.proxy(function () {
                    render();
                }, this), 500);
            }, this));
        }

        /**
         * Loads the image.
         * Change the src attribute by the data-src.
         *
         * @param  {Element} element The element to be loaded
         */
        function loadImage(element) {

            var realSource = element.getAttribute('data-src');
            element.setAttribute('src', realSource);
        }

        /**
         * Render the images.
         *
         */
        function render() {

            var that   = this,
                cs     = container.height(),     // Container size
                ct     = container.scrollTop(),  // Container top
                cb     = ct + cs,                // Container bottom
                images = $(element).find('img');

            images.filter(function () {
                var et = $(this).offset().top;   // Element top

                if (et >= ct - options.range && et <= cb + options.range) {
                    if (this.getAttribute('data-src') !== this.getAttribute('src')) {
                        loadImage(this);
                    }
                }
            });
        }

        // Initialize the plugin
        initialize();

    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[name] = function (options) {

        return this.each(function () {
            if (!$.data(this, 'plugin_' + name)) {
                $.data(this, 'plugin_' + name, new LazyLodr(this, options));
            }
        });
    };

}));