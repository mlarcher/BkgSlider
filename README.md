BkgSlider
=========


BkgSlider is a jQuery plugin giving you the opportunity to have a CSS background-image gallery.


Demo
------------

You can check out an example on the [demonstration page](http://www.ringabell.org/wp-content/_custom/bkgslide/).


Usage
------------

There’s nothing simpler than to use BkgSlide : you just have to include the jQery library and the BkgSlider plugin in your page and instanciate the plugin with its options.


    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jquery.bkgslide.js"></script>
    <script type="text/javascript">
        $(document).ready(function(){
            $('#target').bkgSlide({
                images: ['images/img1.jpg', 'images/img2.jpg']
            });
        });
    </script>


Options
------------

### images

An array containing the name of the images to use.

### imagePath

The path where to find the images.

The script automatically adds an ending slash if necessary.

### speed

The duration in milliseconds between two image changes.

**Default** : 7000

If you don’t want autoplay, set this value to 0.

### direction

The direction to go to when changing image.

**Possible values** : ‘random’, ‘next’, ‘prev’

**Default** : ‘random’

### wrap

Defines wheter or not to wrap around when reaching one end of the imges list.

**Default** : true

### nav

Defines the navigation tools.

**Possible values** : true, an option as a string, an array of navigation tools in the order you want to see them

* true / ‘all’ : all the navigation tools
* ‘list’ : list of shortcuts to each image
* ‘prev’ : button to go to the previous image
* ‘next’ : bbutton to go to the next image
* ‘toggle’ : button to start or stop the slideshow

**Default** : ['prev', 'list', 'next', 'toggle']

### stopOnNav

Defines wheter or not to stop the slideshow when the user interacts with one of the navigation tools.

**Default** : false

### width

The width to give to the image containers.

With the ‘auto’ value, the script will use the width of the target element.

**Default** : ‘auto’

### height

The height to give to the image containers.

With the ‘auto’ value, the script will use the height of the target element.

**Default** : ‘auto’

### containersClass

Used to add a custom class to the image containers.

**Default** : null

### effect

The effect to apply when transitioning between two images.

**Possible values** : ‘fadeOut’, ‘slideUp’, ‘hide’

**Default** : ‘fadeOut’

### duration

The transition duration between two images (in milliseconds)

**Default** : 500

### afterInit

A callback function to do something right after the BkgSlider initialization.

This function will have has parameter the target element and its BkgSlider.


Methods
------------

### move

Move within the images list.

**Possible values** : ‘next’, ‘prev’, ‘random’

If no parameter is passed, the direction set in the options is used.

### changeTo

Move to the specified image index.

This method requires the index of the image in the array as a parameter (a number between 0 and the number of images -1).

### play

Begin the slideshow.

This method accepts a number of milliseconds as a parameter, representing the time interval between two image changes.

If no parameter is passed, the speed set in the options will be used.

### stop

Stop the slideshow.
