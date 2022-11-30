import { addImageToS3 } from "../../aws-s3.js";
import * as Api from "../../api.js";
import { checkLogin, createNavbar } from "../../useful-functions.js";

const titleInput = document.querySelector("#titleInput");
const descriptionInput = document.querySelector("#descriptionInput");
// const themeSelectBox = document.querySelector("#themeSelectBox");
const imageInput = document.querySelector("#imageInput");
const fileNameSpan = document.querySelector("#fileNameSpan");
const submitButton = document.querySelector("#addCategoryButton");
const registerCategoryForm = document.querySelector("#registerCategoryForm");

checkLogin();
addAllElements();
addAllEvents();

async function addAllElements() {
  createNavbar();
}

function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
  // themeSelectBox.addEventListener("change", handleColorChange);
  imageInput.addEventListener("change", handleImageUpload);
}

async function handleSubmit(e) {
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;
  // const themeClass = themeSelectBox.value;
  const image = imageInput.files[0];

  if (!title || !description) {
    return alert("빈 칸이 없어야 합니다.");
  }

  // if (!themeClass) {
  //   return alert("테마를 선택해 주세요.");
  // }

  if (image.size > 3e6) {
    return alert("사진은 최대 2.5MB 크기까지 가능합니다.");
  }

  try {
    const imageKey = await addImageToS3(imageInput, "category");
    const data = { title, description, imageKey };

    await Api.post("/api/category", data);

    alert(`정상적으로 ${title} 카테고리가 등록되었습니다.`);

    registerCategoryForm.reset();
    fileNameSpan.innerText = "";
    // themeSelectBox.style.backgroundColor = "white";
    // themeSelectBox.style.color = "black";
  } catch (err) {
    alert(`문제가 발생했습니다. 확인 후 다시 시도해주세요: ${err.message}`);
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

// function handleColorChange() {
//   const index = themeSelectBox.selectedIndex;

//   themeSelectBox.style.color = themeSelectBox[index].style.color;
//   themeSelectBox.style.backgroundColor =
//     themeSelectBox[index].style.backgroundColor;
// }
