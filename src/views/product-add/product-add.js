import { addImageToS3 } from "../../aws-s3.js";
import * as Api from "../../api.js";
import { checkLogin, randomId, createNavbar } from "../../useful-functions.js";

const titleInput = document.querySelector("#titleInput");
const categorySelectBox = document.querySelector("#categorySelectBox");
const manufacturerInput = document.querySelector("#manufacturerInput");
const shortDescriptionInput = document.querySelector("#shortDescriptionInput");
const detailDescriptionInput = document.querySelector(
  "#detailDescriptionInput"
);
const imageInput = document.querySelector("#imageInput");
const inventoryInput = document.querySelector("#inventoryInput");
const priceInput = document.querySelector("#priceInput");
const searchKeywordInput = document.querySelector("#searchKeywordInput");
const addKeywordButton = document.querySelector("#addKeywordButton");
const keywordsContainer = document.querySelector("#keywordContainer");
const submitButton = document.querySelector("#submitButton");
const registerProductForm = document.querySelector("#registerProductForm");

checkLogin();
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  addOptionsToSelectBox();
}

function addAllEvents() {
  imageInput.addEventListener("change", handleImageUpload);
  submitButton.addEventListener("click", handleSubmit);
  categorySelectBox.addEventListener("change", handleCategoryChange);
  addKeywordButton.addEventListener("click", handleKeywordAdd);
}

async function handleSubmit(e) {
  e.preventDefault();

  const title = titleInput.value;
  const categoryId = categorySelectBox.value;
  const manufacturer = manufacturerInput.value;
  const shortDescription = shortDescriptionInput.value;
  const detailDescription = detailDescriptionInput.value;
  const image = imageInput.files[0];
  const inventory = parseInt(inventoryInput.value);
  const price = parseInt(priceInput.value);

  if (
    !title ||
    !categoryId ||
    !manufacturer ||
    !shortDescription ||
    !detailDescription ||
    !inventory ||
    !price
  ) {
    return alert("빈 칸 및 0이 없어야 합니다.");
  }

  if (image.size > 3e6) {
    return alert("사진은 최대 2.5MB 크기까지 가능합니다.");
  }

  const index = categorySelectBox.selectedIndex;
  const categoryName = categorySelectBox[index].text;

  try {
    const imageKey = await addImageToS3(imageInput, categoryName);
    const data = {
      title,
      categoryId,
      manufacturer,
      shortDescription,
      detailDescription,
      imageKey,
      inventory,
      price,
      searchKeywords,
    };

    await Api.post("/api/product", data);

    alert(`정상적으로 ${title} 제품이 등록되었습니다.`);

    registerProductForm.reset();
    fileNameSpan.innerText = "";
    keywordsContainer.innerHTML = "";
    categorySelectBox.style.color = "black";
    categorySelectBox.style.backgroundColor = "white";
    searchKeywords = [];
  } catch (err) {
    console.log(err.stack);

    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

function handleImageUpload() {
  const file = imageInput.files[0];
  if (file) {
    fileNameSpan.innerText = file.name;
  } else {
    fileNameSpan.innerText = "";
  }
}

async function addOptionsToSelectBox() {
  const categorys = await Api.get("/api/categorylist");
  categorys.forEach((category) => {
    const { _id, title, themeClass } = category;

    categorySelectBox.insertAdjacentHTML(
      "beforeend",
      `
      <option value=${_id} class="notification ${themeClass}"> ${title} </option>`
    );
  });
}

function handleCategoryChange() {
  const index = categorySelectBox.selectedIndex;

  categorySelectBox.className = categorySelectBox[index].className;
}

let searchKeywords = [];
function handleKeywordAdd(e) {
  e.preventDefault();

  const newKeyword = searchKeywordInput.value;

  if (!newKeyword) {
    return;
  }

  if (searchKeywords.includes(newKeyword)) {
    return alert("이미 추가한 검색어입니다.");
  }

  searchKeywords.push(newKeyword);

  const random = randomId();

  keywordsContainer.insertAdjacentHTML(
    "beforeend",
    `
    <div class="control" id="a${random}">
      <div class="tags has-addons">
        <span class="tag is-link is-light">${newKeyword}</span>
        <a class="tag is-link is-light is-delete"></a>
      </div>
    </div>
  `
  );

  keywordsContainer
    .querySelector(`#a${random} .is-delete`)
    .addEventListener("click", handleKeywordDelete);

  searchKeywordInput.value = "";
  searchKeywordInput.focus();
}

function handleKeywordDelete(e) {
  const keywordToDelete = e.target.previousElementSibling.innerText;

  const index = searchKeywords.indexOf(keywordToDelete);
  searchKeywords.splice(index, 1);

  e.target.parentElement.parentElement.remove();
}
