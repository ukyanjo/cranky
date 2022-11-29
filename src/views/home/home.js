import * as Api from "../api.js";
import { getImageUrl } from "../aws-s3.js";
import { navigate, createNavbar } from "../useful-functions.js";

const sliderDiv = document.querySelector("#slider");
const sliderArrowLeft = document.querySelector("#sliderArrowLeft");
const sliderArrowRight = document.querySelector("#sliderArrowRight");

addAllElements();
addAllEvents();

async function addAllElements() {
  createNavbar();
  await addImageCardsToSlider();
  attachSlider();
}

function addAllEvents() {}

async function addImageCardsToSlider() {
  const categorys = await Api.get("/api/categorylist");

  for (const category of categorys) {
    const { _id, title, description, themeClass, imageKey } = category;
    const imageUrl = await getImageUrl(imageKey);

    sliderDiv.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card" id="category-${_id}">
        <div class="notification ${themeClass}">
          <p class="title is-3 is-spaced">${title}</p>
          <p class="subtitle is-6">${description}</p>
        </div>
        <div class="card-image">
          <figure class="image is-3by2">
            <img
              src="${imageUrl}"
              alt="카테고리 이미지"
            />
          </figure>
        </div>
      </div>
    `
    );

    const card = document.querySelector(`#category-${_id}`);

    card.addEventListener("click", navigate(`/product/list?category=${title}`));
  }
}

function attachSlider() {
  const imageSlider = bulmaCarousel.attach("#slider", {
    autoplay: true,
    autoplaySpeed: 6000,
    infinite: true,
    duration: 500,
    pauseOnHover: false,
    navigation: false,
  });

  sliderArrowLeft.addEventListener("click", () => {
    imageSlider[0].previous();
  });

  sliderArrowRight.addEventListener("click", () => {
    imageSlider[0].next();
  });
}
