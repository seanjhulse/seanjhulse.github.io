class Hover {

  constructor(options) {
    // collection of sliders
    this.hoverers = document.getElementsByClassName(options.element);
    this.hoverClass = options.hoverClass;

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
    
    if (this.y > elemY + elem.offsetHeight && elemY > 0) {
      var translateY = 'translateY(' + (-(elemY/this.y)*40).toString() + 'px)';
      console.log(translateY);
      elem.style.transform = translateY;
    } else {
    }
  }


  listen() {
    for(var i = 0; i < this.hoverers.length; i++) {
      this.isScrolledIntoView(this.hoverers[i]);
    }
  }

};