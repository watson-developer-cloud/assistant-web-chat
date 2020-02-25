/* eslint-disable header/header */
function MySimpleCarousel(event) {
  this.event = event;
  // Because we render Web Chat to Shadow DOM, we should use `style` tags rather than `link` tags to bring in our CSS.
  this.css = '@import "user_defined_templates/carousel.css"';
}

/**
 * Moves the pointer for which is the current active slide.
 *
 * @param direction A number of slides to move pointer from. Usually 1 or -1.
 */
MySimpleCarousel.prototype.navigate = function(direction) {
  // Hide the old current list item
  this.current.classList.remove('carousel_container_current');

  // Calculate th new position
  this.counter = this.counter + direction;

  // If the previous one was chosen and the counter is less than 0 make the counter the last element, thus looping the carousel
  if (direction === -1 && this.counter < 0) {
    this.counter = this.amount - 1;
  }
  // If the next button was clicked and there is no items element, set the counter to 0
  if (direction === 1 && !this.items[this.counter]) {
    this.counter = 0;
  }
  // set new current element and add CSS class
  this.current = this.items[this.counter];
  this.current.classList.add('carousel_container_current');
  if (this.counter === 0) {
    // First slide. Remove "Back".
    this.prev.classList.remove('carousel_container_visible');
    this.next.classList.add('carousel_container_visible');
  } else if (this.counter === this.amount - 1) {
    // Last slide. Remove "Next".
    this.prev.classList.add('carousel_container_visible');
    this.next.classList.remove('carousel_container_visible');
  } else {
    // Show both buttons for all other slides.
    this.prev.classList.add('carousel_container_visible');
    this.next.classList.add('carousel_container_visible');
  }
};

/**
 * Adds HTML and CSS and starts the class.
 */
MySimpleCarousel.prototype.start = function() {
  const self = this;

  // Scaffold.
  this.writeCSS();
  this.writeHTML();

  // Read necessary elements from the DOM once
  this.box = this.event.data.element.querySelector('.carousel_container');
  this.next = this.box.querySelector('.carousel_container_next');
  this.prev = this.box.querySelector('.carousel_container_prev');

  // Define the global counter, the items and the current item.
  this.counter = 0;
  this.items = this.box.querySelectorAll('.carousel_container_content li');
  this.amount = this.items.length;
  this.current = this.items[0];

  // Mark the carousel as started.
  this.box.classList.add('carousel_container_active');

  // Add event handlers to buttons
  this.next.addEventListener('click', function(ev) {
    self.navigate(1);
  });
  this.prev.addEventListener('click', function(ev) {
    self.navigate(-1);
  });

  // Show the first element (when direction is 0 counter doesn't change)
  this.navigate(0);
};

/**
 * Adds CSS.
 */
MySimpleCarousel.prototype.writeCSS = function() {
  const element = document.createElement('style');
  element.setAttribute('type', 'text/css');
  element.innerHTML = this.css;
  this.event.data.element.appendChild(element);
}

/**
 * Adds HTML scaffolding.
 */
MySimpleCarousel.prototype.writeHTML = function() {
  const element = document.createElement('div');
  element.classList.add('carousel_container');
  element.innerHTML =
    '<div class="carousel_container_buttons"><button class="carousel_container_prev"><div class="carousel_container_icon"><img src="user_defined_templates/left.svg" alt="previous" /></div></button><button class="carousel_container_next"><div class="carousel_container_icon"><img src="user_defined_templates/right.svg" alt="next" /></div></button></div><ol class="carousel_container_content"></ol>';
  const content = element.querySelector('.carousel_container_content');
  const message = this.event.data.message;
  message.user_defined.slides.forEach(function(slide) {
    content.innerHTML +=
      '<li><div class="ibm-web-chat-card"><img class="carousel_slide_image" src="' +
      slide.image +
      '"/><div class="carousel_slide_title">' +
      slide.title +
      '</div><div class="carousel_slide_description">' +
      slide.description +
      '</div></div></li>';
  });
  this.event.data.element.appendChild(element);
};

/**
 * Handler for the Carousel template.
 *
 * @param event The event passed from Watson Assistant.
 * @param event.type The type of event, in this case "customResponse".
 * @param event.data.message The original message.
 * @param event.data.element An HTML element that is rendered in Web Chat for you to manipulate. If you have set
 * user_defined.silent to true, no HTML element will be created.
 */
function handleCarouselTemplate(event) {
  const carousel = new MySimpleCarousel(event);
  carousel.start();
}
