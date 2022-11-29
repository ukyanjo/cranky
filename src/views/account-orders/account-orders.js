import { checkLogin, createNavbar } from "../../useful-functions.js";
import * as Api from "../../api.js";

const ordersContainer = document.querySelector("#ordersContainer");
const modal = document.querySelector("#modal");
const modalBackground = document.querySelector("#modalBackground");
const modalCloseButton = document.querySelector("#modalCloseButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
const deleteCancelButton = document.querySelector("#deleteCancelButton");

checkLogin();
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  insertOrders();
}

function addAllEvents() {
  modalBackground.addEventListener("click", closeModal);
  modalCloseButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", keyDownCloseModal);
  deleteCompleteButton.addEventListener("click", deleteOrderData);
  deleteCancelButton.addEventListener("click", cancelDelete);
}

let orderIdToDelete;
async function insertOrders() {
  const orders = await Api.get("/api/orderlist/user");

  for (const order of orders) {
    const { _id, createdAt, summaryTitle, status } = order;
    const date = createdAt.split("T")[0];

    ordersContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="columns orders-item" id="order-${_id}">
          <div class="column is-2">${date}</div>
          <div class="column is-6 order-summary">${summaryTitle}</div>
          <div class="column is-2">${status}</div>
          <div class="column is-2">
            <button class="button" id="deleteButton-${_id}" >주문 취소</button>
          </div>
        </div>
      `
    );

    const deleteButton = document.querySelector(`#deleteButton-${_id}`);

    deleteButton.addEventListener("click", () => {
      orderIdToDelete = _id;
      openModal();
    });
  }
}

async function deleteOrderData(e) {
  e.preventDefault();

  try {
    await Api.delete("/api/orders", orderIdToDelete);

    alert("주문 정보가 삭제되었습니다.");

    const deletedItem = document.querySelector(`#order-${orderIdToDelete}`);
    deletedItem.remove();

    orderIdToDelete = "";

    closeModal();
  } catch (err) {
    alert(`주문정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

function cancelDelete() {
  orderIdToDelete = "";
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
