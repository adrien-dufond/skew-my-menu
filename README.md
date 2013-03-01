SKEW MY MENU
============

What it does
------------

"Skew my menu" provides a menu that is animated (open/close) with the skew css property.
The block is skewed but not his inside content, that's the trick.

What you need
-------------

- jQuery (>= version 1.5)
- transit <http://ricostacruz.com/jquery.transit/> (helps to animate the skew property)
- hotkeys <https://github.com/jeresig/jquery.hotkeys> (optional - open/close is triggered by the space bar)

How it works
------------

Load the skewBlock.js file in the head of your html document

     <script src="js/skewBlock.js"></script>

Set the html...

     <div id="sk">
     <div class="line"></div>
     <div class="line" id="sk_nav"><div id="sk_openclose"><span>&#8250;</span></div></div>
     <div class="line"><a href="#"><h2>Title</h2> - more text</a></div>
     <div class="line"><a href="#"><h2>Title</h2> - more text</a></div>
     <div class="line"><a href="#"><h2>Title</h2> - more text</a></div>
     <div class="line"><a href="#"><h2>Title</h2> - more text</a></div>
     </div>

...And apply skewBlock.js to the #sk div :

     // Arguments are : line width, line height, line padding, skew angle
     $('#sk').skewBlock('init', 300, 30, 0, 25); 
