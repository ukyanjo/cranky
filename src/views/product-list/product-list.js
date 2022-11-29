import { getImageUrl } from "../../aws-s3.js";
import * as Api from "../../api.js";
import {
  randomId,
  getUrlParams,
  addCommas,
  navigate,
  checkUrlParams,
  createNavbar,
} from "../../useful-functions.js";

const productItemContainer = document.querySelector("#producItemContainer");

checkUrlParams("category");
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  addProductItemsToContainer();
}

function addAllEvents() {}

async function addProductItemsToContainer() {
  const { category } = getUrlParams();
  const products = await Api.get(`/api/productlist/category/${category}`);

  products.forEach(async (product) => {
    const { _id, title, shortDescription, imageKey, isRecommended, price } =
      product;
    const imageUrl = await getImageUrl(imageKey);
    const random = randomId();

    productItemContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="message media product-item" id="a${random}">
        <div class="media-left">
          <figure class="image">
            <img
              src="${imageUrl}"
              alt="제품 이미지"
            />
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p class="title">
              ${title}
              ${
                isRecommended
                  ? '<span class="tag is-success is-rounded">추천</span>'
                  : ""
              }
            </p>
            <p class="description">${shortDescription}</p>
            <p class="price">${addCommas(price)}원</p>
          </div>
        </div>
      </div>
      `
    );

    const productItem = document.querySelector(`#a${random}`);
    productItem.addEventListener(
      "click",
      navigate(`/product/detail?id=${_id}`)
    );
  });
}
