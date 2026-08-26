document.querySelectorAll(".project-slideshow").forEach((slideshow) => {
  slideshow.dataset.slideIndex = "1";
  showSlide(1, slideshow);
});

function changeSlide(step, trigger) {
  const slideshow = trigger
    ? trigger.closest(".project-slideshow")
    : document.querySelector(".project-slideshow");

  if (!slideshow) return;

  const currentIndex = Number(slideshow.dataset.slideIndex || 1);
  showSlide(currentIndex + step, slideshow);
}

function showSlide(index, slideshow) {
  const slides = slideshow.querySelectorAll(".slide");
  if (slides.length === 0) return;

  let nextIndex = index;
  if (nextIndex > slides.length) nextIndex = 1;
  if (nextIndex < 1) nextIndex = slides.length;
  slideshow.dataset.slideIndex = String(nextIndex);

  slides.forEach((slide, slidePosition) => {
    slide.style.display = slidePosition + 1 === nextIndex ? "block" : "none";
    const numberLabel = slide.querySelector(".slide-number");
    if (numberLabel) {
      numberLabel.textContent = `${slidePosition + 1} / ${slides.length}`;
    }
  });
}
