import { getImageUrl } from "../../aws-s3.js";
import * as Api from "../../api.js";
import {
  getUrlParams,
  addCommas,
  checkUrlParams,
  createNavbar,
} from "../../useful-functions.js";
import { addToDb, putToDb } from "../../indexed-db.js";

const productImageTag = document.querySelector("#productImageTag");
const manufacturerTag = document.querySelector("#manufacturerTag");
const titleTag = document.querySelector("#titleTag");
const detailDescriptionTag = document.querySelector("#detailDescriptionTag");
const addToCartButton = document.querySelector("#addToCartButton");
const purchaseButton = document.querySelector("#purchaseButton");

checkUrlParams("id");
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  insertProductData();
}

function addAllEvents() {}

async function insertProductData() {
  const { id } = getUrlParams();
  const product = await Api.get(`/api/products/${id}`);

  const {
    title,
    detailDescription,
    manufacturer,
    imageKey,
    isRecommended,
    price,
  } = product;
  const imageUrl = await getImageUrl(imageKey);

  productImageTag.src = imageUrl;
  titleTag.innerText = title;
  detailDescriptionTag.innerText = detailDescription;
  manufacturerTag.innerText = manufacturer;
  priceTag.innerText = `${addCommas(price)}원`;

  if (isRecommended) {
    titleTag.insertAdjacentHTML(
      "beforeend",
      '<span class="tag is-success is-rounded">추천</span>'
    );
  }

  addToCartButton.addEventListener("click", async () => {
    try {
      await insertDb(product);

      alert("장바구니에 추가되었습니다.");
    } catch (err) {
      if (err.message.includes("Key")) {
        alert("이미 장바구니에 추가되어 있습니다.");
      }

      console.log(err);
    }
  });

  purchaseButton.addEventListener("click", async () => {
    try {
      await insertDb(product);

      window.location.href = "/order";
    } catch (err) {
      console.log(err);

      window.location.href = "/order";
    }
  });
}

async function insertDb(product) {
  const { _id: id, price } = product;

  await addToDb("cart", { ...product, quantity: 1 }, id);

  await putToDb("order", "summary", (data) => {
    const count = data.productsCount;
    const total = data.productsTotal;
    const ids = data.ids;
    const selectedIds = data.selectedIds;

    data.productsCount = count ? count + 1 : 1;

    data.productsTotal = total ? total + price : price;

    data.ids = ids ? [...ids, id] : [id];

    data.selectedIds = selectedIds ? [...selectedIds, id] : [id];
  });
}
