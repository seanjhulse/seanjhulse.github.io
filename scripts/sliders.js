class Slider {

  constructor(options) {
    // collection of sliders
    this.sliders = document.getElementsByClassName(options.element);
    this.slideClass = options.slideClass;

    // vanilla JS window width and height
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0];
    this.x = w.innerWidth||e.clientWidth||g.clientWidth;
    this.y = w.innerHeight||e.clientHeight||g.clientHeight;

    // listens for scroll events
    var listen = this.listen.bind(this);
    window.addEventListener('scroll', function(e) {
      listen();
    });
  }

  isScrolledIntoView(elem) {

    var elemBounds = elem.getBoundingClientRect();
    var elemY = elemBounds.y;

    if (this.y > elemY && elemY > -500) {
      elem.classList.add(this.slideClass);
    } else {
      elem.classList.remove(this.slideClass);      
    }
  }


  listen() {
    for(var i = 0; i < this.sliders.length; i++) {
      this.isScrolledIntoView(this.sliders[i]);
    }
  }

};