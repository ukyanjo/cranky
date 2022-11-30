import * as Api from "../../api.js";
import { createNavbar } from "../../useful-functions.js";

const passwordInput = document.querySelector("#passwordInput");
const modal = document.querySelector("#modal");
const modalBackground = document.querySelector("#modalBackground");
const modalCloseButton = document.querySelector("#modalCloseButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
const deleteCancelButton = document.querySelector("#deleteCancelButton");

addAllElements();
addAllEvents();

async function addAllElements() {
  createNavbar();
}

function addAllEvents() {
  submitButton.addEventListener("click", openModal);
  modalBackground.addEventListener("click", closeModal);
  modalCloseButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", keyDownCloseModal);
  deleteCompleteButton.addEventListener("click", deleteUserData);
  deleteCancelButton.addEventListener("click", closeModal);
}

async function deleteUserData(e) {
  e.preventDefault();

  const password = passwordInput.value;
  const data = { password };

  try {
    const userToDelete = await Api.post("/api/user/password/check", data);
    const { _id } = userToDelete;

    await Api.delete("/api/users", _id);

    alert("탈퇴가 정상적으로 처리됐습니다.");

    sessionStorage.removeItem("token");

    window.location.href = "/";
  } catch (err) {
    alert(`오류가 발생했습니다: ${err}`);

    closeModal();
  }
}

function openModal(e) {
  if (e) {
    e.preventDefault();
  }
  modal.classList.add("is-active");
}

function closeModal(e) {
  if (e) {
    e.preventDefault();
  }
  modal.classList.remove("is-active");
}

function keyDownCloseModal(e) {
  if (e.keyCode === 27) {
    closeModal();
  }
}
