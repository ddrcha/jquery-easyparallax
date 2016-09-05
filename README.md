# jQuery.easyParallax 

About
=====

A lightweight, easy-to-use, jQuery plugin for adding a simple vertical parallax background


Compatibility
====

Tested successfully with jQuery versions and browsers listed below : 
- jQuery v1.7.0 to v1.12.4
- jQuery v2.0.0 to v2.2.4
- jQuery v3.0.0 and v3.1.0

Windows
- Google Chrome (v52)
- Mozilla Firefox (v48)
- Microsoft Edge (v38)
- Opera (v39)


Licence
====

Plugin licensed under the CC BY-ND 2.0 license


Installation
====

EasyParallax requires only jQuery main library to work.

```
<script src="/path/to/js/files/jquery.js"></script>
<script src="/path/to/js/files/jquery.easyparallax-1.0.0.js"></script>
```


Simple usage
====

To add a parallax background behind a container, you have to add only a "data-bg" attribute (including the path to the image to display) and active the plugin using a class or an id attribute.
```
<div class="container" data-bg="/url/to/bg/image">
	Your content
</div>

<script>
	$('.container').easyParallax();
</script>
```


To go even farther 
====

##Options

EasyParallax plugin offers several options to customize it. Theses options must be passed when the plugin is instancied. 

| Option name | Values availables | Default value | Description |
| --- | --- | --- |  --- |
| `debug` | true, false | false | Display some debug informations in browser console |
| `alignment` | 'left', 'center', 'right' | 'center' | Set the horizontal alignment of the bg compared to the width browser value. Active only if the background width value is bigger than the browser width value |
| `effectAmount` | [numeric] | 400 | Set the minimal height value (in pixels) used for executing the parallax effect |
| `effectThreshold` | [numeric] | 0 | Set the minimal value of the width browser where the parallax effect works. The bg image has just covering the container under this value |
| `isReady` | [callback function] |  | Function called when the bg image is completely loaded, placed and when the parallax function is set to on. "this" enable to target the div element including the background image | 


##Responsive

EasyParallax plugin enables you also to set many backgrounds images to a container and to display each following the width browser value :

```
<div class="container" data-bg="/url/to/bg/image1" data-bg500="/url/to/bg/image2" data-bg1000="/url/to/bg/image3"></div>
```
In this example : 
- 'image1' is displayed when the browser width value is under 500px (excluded),
- 'image2' is displayed when the browser width value is between 500px (included) and 1000px (excluded),
- 'image3' is displayed when the browser width value is above 1000px (included). 

You can add 'data-bg[numeric]' attributes as much as you want. Pay just attention to respect the right syntax and not add several times the same attribute (because the last attribute erase the previous one !).


##Full demonstration 

This example include :
- the managment of two background images, a static one for the small devices and a second one when plugin is activated (above 600px),
- a fade-in effect on the background images when ready (thanks to the great Daniel Eden's css library available here : https://daneden.github.io/animate.css/)

```
// in .php  or .html file
<html>
	<head>
		<link rel="stylesheet" type="text/css" rel="/path/to/js/files/animate.css" />
		<style>
			.container {position:relative; width:100%; height:300px;}
			.easyparallax {opacity:0;}
		</style>
	</head>
	<body>
		<div class="container" 
			data-bg="/path/to/img/image1.jpg" 
			data-bg600="/path/to/img/image2.jpg"> 
		</div>
		
		<script src="/path/to/js/files/jquery.js"></script>
		<script src="/path/to/js/files/jquery.easyparallax-1.0.0.js"></script>
	</body>
</html>

// in .js attached file
$('.container').easyParallax({
	alignment : 'right',
	effectAmount : 280,
	effectThreshold : 600,
	isReady : function(){
		this.addClass('animated fadeIn');
	}
});
```
