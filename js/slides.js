// get elements
let presentation = document.querySelector(".presentation");
let slides = document.querySelectorAll(".slide");
let currentSlide = document.querySelector(".slide.show");

var slideNumber = document.querySelector(".counter");
var toLeftBtn = document.querySelector("#left-btn");
var toRightBtn = document.querySelector("#right-btn");

let presentationController = document.querySelector("#presentation-area");
var toFullScreenBtn = document.querySelector("#full-screen");
var toSmallScreenBtn = document.querySelector("#small-screen");

// status
var screenStatus = 0;
var currentSlideNo = 1;
var totalSlides = slides.length;


function loadFile(input) {
  let file = input.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    const md = reader.result.split(/\n\n *-{3,} *\n\n/);
    for (let slide of md) {
      const fragment = markdown2html(slide);
      console.log(fragment + '\n-----------\n') ;
      presentation.insertAdjacentHTML('beforeend', fragment);
    }
    slides = document.querySelectorAll(".slide");
    totalSlides = slides.length;
    init();
    hljs.highlightAll();
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
}


function init() {
  setSlideNo();
  toggleNavButtons();
}

// handle clicks on left and right icons
toLeftBtn.addEventListener("click", moveToLeftSlide);
toRightBtn.addEventListener("click", moveToRightSlide);

// handle full screen and small screen modes
toFullScreenBtn.addEventListener("click", fullScreenMode);
toSmallScreenBtn.addEventListener("click", smallScreenMode);

function toggleNavButtons() {
  if (currentSlideNo == 1) {
    toLeftBtn.classList.remove("show");
  } else {
    toLeftBtn.classList.add("show");
  }
  if (currentSlideNo >= totalSlides) {
    toRightBtn.classList.remove("show");
  } else {
    toRightBtn.classList.add("show");
  }
}

// moves to left slide
function moveToLeftSlide() {
  var tempSlide = currentSlide;
  currentSlide = currentSlide.previousElementSibling;
  tempSlide.classList.remove("show");
  currentSlide.classList.add("show");
  currentSlideNo--;
  setSlideNo();
  toggleNavButtons();
}

// moves to right slide
function moveToRightSlide() {
  var tempSlide = currentSlide;
  currentSlide = currentSlide.nextElementSibling;
  tempSlide.classList.remove("show");
  currentSlide.classList.add("show");
  currentSlideNo++;
  setSlideNo();
  toggleNavButtons();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

// go full screen
function fullScreenMode() {
  presentationController.classList.add("full-screen");
  toFullScreenBtn.classList.remove("show");
  toSmallScreenBtn.classList.add("show");
  toggleFullScreen();
  screenStatus = 1;
}

// switch to small screen
function smallScreenMode() {
  presentationController.classList.remove("full-screen");
  toFullScreenBtn.classList.add("show");
  toSmallScreenBtn.classList.remove("show");
  toggleFullScreen();
  screenStatus = 0;
}

// update counter
function setSlideNo() {
  slideNumber.innerText = `${currentSlideNo} / ${totalSlides}`;
}