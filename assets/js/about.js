const aboutBtn = document.querySelector(".about-btn");
const closeBtn = document.querySelector(".close-btn");
const aboutContainer = document.querySelector(".about-container");

aboutBtn.addEventListener("click", () => {
  aboutContainer.style.opacity = "1";
  aboutContainer.style.maxHeight = "250px";
});

closeBtn.addEventListener("click", () => {
  aboutContainer.style.opacity = "0";
  aboutContainer.style.maxHeight = "0px";
});
