import { checkLogin, navigate, createNavbar } from "../../useful-functions.js";

const orderDetailButton = document.querySelector("#orderDetailButton");
const shoppingButton = document.querySelector("#shoppingButton");

checkLogin();
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
}

function addAllEvents() {
  orderDetailButton.addEventListener("click", navigate("/account/orders"));
  shoppingButton.addEventListener("click", navigate("/"));
}
