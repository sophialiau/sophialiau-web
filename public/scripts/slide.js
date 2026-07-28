let slideIndex = 1;
  showSlide(slideIndex);

  function changeSlide(n) { 
    showSlide(slideIndex += n);
  }

  function showSlide(n) {
    const slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    slides.forEach((slide, i) => {
      slide.style.display = i + 1 === slideIndex ? "block" : "none";
      const numberLabel = slide.querySelector(".slide-number");
      if (numberLabel) {
        numberLabel.textContent = `${i + 1} / ${slides.length}`;
      }
    });
  }