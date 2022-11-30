import { addCommas, checkAdmin, createNavbar } from "../../useful-functions.js";
import * as Api from "../../api.js";

const usersCount = document.querySelector("#usersCount");
const adminCount = document.querySelector("#adminCount");
const usersContainer = document.querySelector("#usersContainer");
const modal = document.querySelector("#modal");
const modalBackground = document.querySelector("#modalBackground");
const modalCloseButton = document.querySelector("#modalCloseButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
const deleteCancelButton = document.querySelector("#deleteCancelButton");

checkAdmin();
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  insertUsers();
}

function addAllEvents() {
  modalBackground.addEventListener("click", closeModal);
  modalCloseButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", keyDownCloseModal);
  deleteCompleteButton.addEventListener("click", deleteUserData);
  deleteCancelButton.addEventListener("click", cancelDelete);
}

let userIdToDelete;
async function insertUsers() {
  const users = await Api.get("/api/userlist");

  const summary = {
    usersCount: 0,
    adminCount: 0,
  };

  for (const user of users) {
    const { _id, email, fullName, role, createdAt } = user;
    const date = createdAt.split("T")[0];

    summary.usersCount += 1;

    if (role === "admin") {
      summary.adminCount += 1;
    }

    usersContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="columns orders-item" id="user-${_id}">
          <div class="column is-2">${date}</div>
          <div class="column is-2">${email}</div>
          <div class="column is-2">${fullName}</div>
          <div class="column is-2">
            <div class="select" >
              <select id="roleSelectBox-${_id}">
                <option 
                  class="has-background-link-light has-text-link"
                  ${role === "basic-user" ? "selected" : ""} 
                  value="basic-user">
                  일반 사용자
                </option>
                <option 
                  class="has-background-danger-light has-text-danger"
                  ${role === "admin" ? "selected" : ""} 
                  value="admin">
                  관리자
                </option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <button class="button" id="deleteButton-${_id}" >회원정보 삭제</button>
          </div>
        </div>
      `
    );

    const roleSelectBox = document.querySelector(`#roleSelectBox-${_id}`);
    const deleteButton = document.querySelector(`#deleteButton-${_id}`);

    const index = roleSelectBox.selectedIndex;
    roleSelectBox.className = roleSelectBox[index].className;

    roleSelectBox.addEventListener("change", async () => {
      const newRole = roleSelectBox.value;
      const data = { role: newRole };

      const index = roleSelectBox.selectedIndex;
      roleSelectBox.className = roleSelectBox[index].className;

      await Api.patch("/api/users/role", _id, data);
    });

    deleteButton.addEventListener("click", () => {
      userIdToDelete = _id;
      openModal();
    });
  }

  usersCount.innerText = addCommas(summary.usersCount);
  adminCount.innerText = addCommas(summary.adminCount);
}

async function deleteUserData(e) {
  e.preventDefault();

  try {
    await Api.delete("/api/users", userIdToDelete);

    alert("회원 정보가 삭제되었습니다.");

    const deletedItem = document.querySelector(`#user-${userIdToDelete}`);
    deletedItem.remove();

    userIdToDelete = "";

    closeModal();
  } catch (err) {
    alert(`회원정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

function cancelDelete() {
  userIdToDelete = "";
  closeModal();
}

function openModal() {
  modal.classList.add("is-active");
}

function closeModal() {
  modal.classList.remove("is-active");
}

function keyDownCloseModal(e) {
  if (e.keyCode === 27) {
    closeModal();
  }
}
