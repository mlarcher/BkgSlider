/**
 * jQuery BkgSlider Plugin
 *
 * Copyright (c) 2011 Matthieu Larcher
 *
 * version: 1.0.4 (03/06/2011)
 * tested with jQuery v1.4.1
 * tested on :
 * PC    : IE 6,7,8, Firefox 3.6, Opera 9,10,11, Safari 3,5, Chrome 9
 * MAC   : Safari 4, Firefox 3.6
 * LINUX : Firefox 3.5
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function ($, window, undefined) {

    var BkgSlider = function(target, options) {
    
        // private properties
        var _target = $(target);
        var _slider = this;
        var _images = [];
        var _currentId = -1;
        var _activeContainer = null;
        var _oldContainer = null;
        var _currentZIndex = -1;
        var _started = false;
        var _interval = null;
        var _container1 = null;
        var _container2 = null;
        var _nav = null;

        // public properties
        this.settings = $.extend({
            images          : [],        // list of images to use
            imagePath       : '',        // path where to find the images
            speed           : 7000,      // time in milliseconds between two image changes, 0 to disable autoplay
            direction       : 'random',  // direction for slideshow ('random' / 'next' / 'prev')
            wrap            : true,      // whether or not to wrap when reaching one end of the images list
            nav             : true,      // whether ot not to setup navigation handlers
                                         // ( true or 'all' for all buttons
                                         // or an array with wanted options in the order you want them :
                                         // [ 'prev', 'list', 'next', 'toggle' ]
                                         // or a string with a single option )
            stopOnNav       : false,     // whether or not to stop autoplay when using the navigation handlers
            width           : 'auto',    // width of the background images containers ('auto' will get it from target)
            height          : 'auto',    // height of the background images containers ('auto' will get it from target)
            containersClass : null,      // class to add to the containers
            effect          : 'fadeOut', // what kind of effect to use for transitions ('fadeOut' / 'slideUp' / 'hide')
            duration        : 500,       // duration of the transition
            afterInit       : {}         // callback function launched after initialization
        }, options || {});

        //this.settings = $.extend({}, {images : []}, options); // other method


        // private methods
        var init = function() {
            // declare variables
            var lastSlash, lastAntiSlash, i, j, l, img, currentBkgImg, width, height, navContent, navPrev, navNext, navPlay, navStop, navList, navItem;


            // check if there is a trailing slash in imagePath and add it if necessary
            if (_slider.settings.imagePath !== '') {
                if (_slider.settings.imagePath.substring(_slider.settings.imagePath.length - 1) !== '/' && _slider.settings.imagePath.substring(_slider.settings.imagePath.length - 1) !== '\\') {
                    //try adding the correct kind of slash
                    lastSlash = _slider.settings.imagePath.lastIndexOf('/');
                    lastAntiSlash = _slider.settings.imagePath.lastIndexOf('\\');
                    _slider.settings.imagePath = (lastSlash >= lastAntiSlash) ? _slider.settings.imagePath + '/' : _slider.settings.imagePath + '\\';
                }
            }

            // set images shortcut
            _images = _slider.settings.images;

            // check for images
            if (_images.length === 0) {
                return;
            }

            // preload images
            for (i = 0, l = _images.length; i < l; i++) {
                img = new Image();
                img.src = _slider.settings.imagePath + _images[i];
            }

            // create containers
            _container1 = $('<div class="bkg-slider-container"></div>');
            _container2 = $('<div class="bkg-slider-container"></div>');

            _target.prepend(_container2);
            _target.prepend(_container1);
            _activeContainer = _container1;

            _container1.css('position', 'absolute');
            _container2.css('position', 'absolute');

            _container1.css('background-color', _target.css('background-color'));
            _container2.css('background-color', _target.css('background-color'));

            width = _slider.settings.width !== 'auto' ? _slider.settings.width : _target.outerWidth();
            _container1.width(width);
            _container2.width(width);

            height = _slider.settings.height !== 'auto' ? _slider.settings.height : _target.outerHeight();
            _container1.height(height);
            _container2.height(height);

            if (_slider.settings.containersClass) {
                _container1.addClass(_slider.settings.containersClass);
                _container2.addClass(_slider.settings.containersClass);
            }

            // update target properties
            _target.css('position', 'relative');
            _target.css('background-image', 'none');
            _target.css('background-color', 'transparent');


            // apply nav
            if (_slider.settings.nav) {

                _nav = $('<div class="bkg-slider-nav"></div>');
                _target.prepend(_nav);

                // define nav contents
                if (_slider.settings.nav === true || _slider.settings.nav === 'all') {
                    navContent = [ 'prev', 'list', 'next', 'toggle' ];
                } else if (typeof _slider.settings.nav === 'string' ) {
                    navContent = [ _slider.settings.nav ];
                } else if (typeof _slider.settings.nav === 'object') {
                    navContent = _slider.settings.nav;
                } else {
                    navContent = [ 'prev', 'list', 'next', 'toggle' ];
                }


                for (i = 0, l = navContent.length; i < l; i++) {

                    // add prev button
                    if (navContent[i] === 'prev') {

                        navPrev = $('<span class="bkg-slider-nav-prev"></span>');
                        _nav.append(navPrev);
                        navPrev.bind('click.bkgSlider', function() {
                            _slider.move('prev');
                            if (_slider.settings.stopOnNav) {
                                _slider.stop();
                            }
                        });
                    }

                    // add list button
                    if (navContent[i] === 'list') {

                        navList = $('<ul class="bkg-slider-nav-list"></ul>');
                        _nav.append(navList);

                        for (j = 0, l = _images.length; j < l; j++) {
                            navItem = $('<li class="bkg-slider-nav-item"></li>');
                            navList.append(navItem);
                            $.data(navItem.get(0), 'bkg-slider-id', j);
                            navItem.bind('click.bkgSlider', function() {
                                _slider.changeTo($.data(this, 'bkg-slider-id'));
                                if (_slider.settings.stopOnNav) {
                                    _slider.stop();
                                }
                            });
                        }
                    }

                    // add next button
                    if (navContent[i] === 'next') {

                        navNext = $('<span class="bkg-slider-nav-next"></span>');
                        _nav.append(navNext);
                        navNext.bind('click.bkgSlider', function() {
                            _slider.move('next');
                            if (_slider.settings.stopOnNav) {
                                _slider.stop();
                            }
                        });
                    }

                    // add toggle button
                    if (navContent[i] === 'toggle') {

                        navPlay = $('<span class="bkg-slider-nav-toggle"></span>');
                        _nav.append(navPlay);
                        navPlay.bind('click.bkgSlider', function() {
                            if (_interval) {
                                _slider.stop();
                            } else {
                                _slider.move(_slider.settings.direction);
                                _slider.play();
                            }

                        });
                    }

                }

                // hide nav if useless
                if (_images.length < 2) {
                    _nav.hide();
                }
            }

            // aply first image
            _slider.move(_slider.settings.direction);
            // apply current img ?
            //currentBkgImg = _target.css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");
            //_container1.css('background-image','url(' + currentBkgImg + ')');

            // start playing
            if (_slider.settings.speed > 0 && _images.length > 1) {
                _slider.play();
            }

            // afterInit callback
            if (_slider.settings.afterInit && typeof _slider.settings.afterInit === 'function') {
                _slider.settings.afterInit(_target, _slider);
            }

        };

        // public methods
        this.move = function(direction) {
            // declare variables
            var randId;

            // set default direction if needed
            if (!direction) {
                direction = _slider.settings.direction;
            }

            // trigger changeTo according to direction
            if (direction === 'random') {
                randId = Math.floor(Math.random() * _images.length);
                while (randId === _currentId) {
                    randId = Math.floor(Math.random() * _images.length);
                }
                this.changeTo(randId);
                return;
            }
            if (direction === 'next') {
                if (_currentId < _images.length - 1) {
                    _slider.changeTo(_currentId + 1);
                } else {
                    if (_slider.settings.wrap) {
                        _slider.changeTo(0);
                    }
                }
                return;
            }
            if (direction === 'prev') {
                if (_currentId > 0) {
                    _slider.changeTo(_currentId - 1);
                } else {
                    if (_slider.settings.wrap) {
                        _slider.changeTo(_images.length - 1);
                    }
                }
            }
        };

        this.changeTo = function(id) {
        
            // don't change if a change is already happening
            if (_started) {
                return;
            }

            // declare vars
            var prevBtn;
            var nextBtn;

            // declare as started
            _started = true;

            // update current Id
            _currentId = id;

            // swap active/old containers
            _oldContainer = _activeContainer;
            _activeContainer = _activeContainer === _container1 ? _container2 : _container1;

            // make sure the new container is always on the background
            _currentZIndex--;

            // set the background image of the new active container
            _activeContainer.css({
                "background-image" : "url(" + _slider.settings.imagePath + _images[id] + ")",
                "display" : "block",
                "z-index" : _currentZIndex
            });


            if (_slider.settings.nav) {

                // update nav items
                _nav.find('.bkg-slider-nav-item').each(function() {
                    if ($.data(this, 'bkg-slider-id') === id) {
                        $(this).addClass('selected');
                    } else {
                        $(this).removeClass('selected');
                    }
                });

                // handle prev/next
                prevBtn = _nav.find('.bkg-slider-nav-prev');
                nextBtn = _nav.find('.bkg-slider-nav-next');

                prevBtn.removeClass('bkg-slider-nav-disabled');
                nextBtn.removeClass('bkg-slider-nav-disabled');

                // update prev button
                if (_slider.settings.wrap === false && _currentId === 0) {
                    prevBtn.addClass('bkg-slider-nav-disabled');
                }

                // update next button
                if (_slider.settings.wrap === false && _currentId === _images.length - 1) {
                    nextBtn.addClass('bkg-slider-nav-disabled');
                }

            }

            // make the old container disappear
            if (_slider.settings.effect === 'fadeOut') {
                _oldContainer.fadeOut(_slider.settings.duration, function() {
                    _started = false;
                });
                return;
            }
            if (_slider.settings.effect === 'slideUp') {
                _oldContainer.slideUp(_slider.settings.duration, function() {
                    _started = false;
                });
                return;
            }
            if (_slider.settings.effect === 'hide') {
                _oldContainer.hide(_slider.settings.duration, function() {
                    _started = false;
                });
            }
        };

        this.play = function(speed) {
        
            // prevent a new interval
            if (_interval) {
                return;
            }

            // set default speed if needed
            if (!speed) {
                speed = _slider.settings.speed;
            }

            // prevent wrong or null speed
            if (!(speed > 0)) {
                return;
            }

            // change toggle button
            _nav.find('.bkg-slider-nav-toggle').addClass('bkg-slider-playing');

            // create interval
            _interval = setTimeout((function(target, speed) {
                return function() {
                stepper(target, speed);
                }
            }(_target, speed)), speed);
            
        };
        var stepper = function(target, speed) {
            var slider = $.data(target.get(0), 'bkgSlider');
            slider.move(slider.settings.direction);
            _interval = setTimeout((function(target, speed) {
                return function() {
                stepper(target, speed);
                }
            }(_target, speed)), speed);
        };
        
        

        this.stop = function() {
            // remove interval
            clearTimeout(_interval);
            // reset values
            _nav.find('.bkg-slider-nav-toggle').removeClass('bkg-slider-playing');
            _interval = null;
        };

        // start the slider
        init();

    };


    $.fn.bkgSlide = function(options) {
    
        return this.each(function() {
            // declare variables
            var target = $(this);

            // return if an instance already exists
            if (target.data('bkgSlider')) {
                return;
            }

            // construct slider
            var slider = new BkgSlider(this, options);

            // store slider on the target
            target.data('bkgSlider', slider);
        });
    };
})(jQuery, window);
