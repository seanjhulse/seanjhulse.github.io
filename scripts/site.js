window.onload = function() {
  var slider = new Slider({
    element: 'slider',
    slideClass: 'slide'
  });

  slider.listen();

  var hover = new Hover({
    element: 'hover',
    hoverClass: 'hovering'
  })
}