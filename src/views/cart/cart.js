import { getImageUrl } from "../aws-s3.js";
import {
  addCommas,
  convertToNumber,
  navigate,
  compressString,
  createNavbar,
} from "../useful-functions.js";
import { deleteFromDb, getFromDb, putToDb } from "../indexed-db.js";

const cartProductsContainer = document.querySelector("#cartProductsContainer");
const allSelectCheckbox = document.querySelector("#allSelectCheckbox");
const partialDeleteLabel = document.querySelector("#partialDeleteLabel");
const productsCountElem = document.querySelector("#productsCount");
const productsTotalElem = document.querySelector("#productsTotal");
const deliveryFeeElem = document.querySelector("#deliveryFee");
const orderTotalElem = document.querySelector("#orderTotal");
const purchaseButton = document.querySelector("#purchaseButton");

addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  insertProductsfromCart();
  insertOrderSummary();
  updateAllSelectCheckbox();
}

function addAllEvents() {
  allSelectCheckbox.addEventListener("change", toggleAll);
  partialDeleteLabel.addEventListener("click", deleteSelectedItems);
  purchaseButton.addEventListener("click", navigate("/order"));
}

async function insertProductsfromCart() {
  const products = await getFromDb("cart");
  const { selectedIds } = await getFromDb("order", "summary");

  products.forEach(async (product) => {
    const { _id, title, quantity, imageKey, price } = product;
    const imageUrl = await getImageUrl(imageKey);

    const isSelected = selectedIds.includes(_id);

    cartProductsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="cart-product-item" id="productItem-${_id}">
          <label class="checkbox">
            <input type="checkbox" id="checkbox-${_id}" ${
        isSelected ? "checked" : ""
      } />
          </label>
          <button class="delete-button" id="delete-${_id}">
            <span class="icon">
              <i class="fas fa-trash-can"></i>
            </span>
          </button>
          <figure class="image is-96x96">
            <img
              id="image-${_id}"
              src="${imageUrl}"
              alt="product-image"
            />
          </figure>
          <div class="content">
            <p id="title-${_id}">${compressString(title)}</p>
            <div class="quantity">
              <button 
                class="button is-rounded" 
                id="minus-${_id}" 
                ${quantity <= 1 ? "disabled" : ""}
                ${isSelected ? "" : "disabled"}
              >
                <span class="icon is-small">
                  <i class="fas fa-thin fa-minus"></i>
                </span>
              </button>
              <input
                class="input"
                id="quantityInput-${_id}"
                type="number"
                min="1"
                max="99"
                value="${quantity}"
                ${isSelected ? "" : "disabled"}
              />
              <button 
                class="button is-rounded" 
                id="plus-${_id}"
                ${quantity >= 99 ? "disabled" : ""}
                ${isSelected ? "" : "disabled"}
              >
                <span class="icon">
                  <i class="fas fa-lg fa-plus"></i>
                </span>
              </button>
            </div>
          </div>
          <div class="calculation">
            <p id="unitPrice-${_id}">${addCommas(price)}원</p>
            <p>
              <span class="icon">
                <i class="fas fa-thin fa-xmark"></i>
              </span>
            </p>
            <p id="quantity-${_id}">${quantity}</p>
            <p>
              <span class="icon">
                <i class="fas fa-thin fa-equals"></i>
              </span>
            </p>
            <p id="total-${_id}">${addCommas(quantity * price)}원</p>
          </div>
        </div>
      `
    );

    document
      .querySelector(`#delete-${_id}`)
      .addEventListener("click", () => deleteItem(_id));

    document
      .querySelector(`#checkbox-${_id}`)
      .addEventListener("change", () => toggleItem(_id));

    document
      .querySelector(`#image-${_id}`)
      .addEventListener("click", navigate(`/product/detail?id=${_id}`));

    document
      .querySelector(`#title-${_id}`)
      .addEventListener("click", navigate(`/product/detail?id=${_id}`));

    document
      .querySelector(`#plus-${_id}`)
      .addEventListener("click", () => increaseItemQuantity(_id));

    document
      .querySelector(`#minus-${_id}`)
      .addEventListener("click", () => decreaseItemQuantity(_id));

    document
      .querySelector(`#quantityInput-${_id}`)
      .addEventListener("change", () => handleQuantityInput(_id));
  });
}

async function toggleItem(id) {
  const itemCheckbox = document.querySelector(`#checkbox-${id}`);
  const isChecked = itemCheckbox.checked;

  if (isChecked) {
    await updateOrderSummary(id, "add-checkbox");
    setQuantityBox(id, "able");
  } else {
    await updateOrderSummary(id, "removeTemp-checkbox");
    setQuantityBox(id, "disable");
  }
}

async function toggleAll(e) {
  const isCheckAll = e.target.checked;
  const { ids } = await getFromDb("order", "summary");

  ids.forEach(async (id) => {
    const itemCheckbox = document.querySelector(`#checkbox-${id}`);
    const isItemCurrentlyChecked = itemCheckbox.checked;

    itemCheckbox.checked = isCheckAll;

    const isAddRequired = isCheckAll && !isItemCurrentlyChecked;
    const isRemoveRequired = !isCheckAll && isItemCurrentlyChecked;

    if (isAddRequired) {
      updateOrderSummary(id, "add-checkbox");
      setQuantityBox(id, "able");
    }

    if (isRemoveRequired) {
      updateOrderSummary(id, "removeTemp-checkbox");
      setQuantityBox(id, "disable");
    }
  });
}

async function increaseItemQuantity(id) {
  await updateOrderSummary(id, "add-plusButton");

  await updateProductItem(id, "increase");

  await putToDb("cart", id, (data) => {
    data.quantity = data.quantity + 1;
  });

  setQuantityBox(id, "plus");
}

async function decreaseItemQuantity(id) {
  await updateOrderSummary(id, "minusButton");

  await updateProductItem(id, "decrease");

  await putToDb("cart", id, (data) => {
    data.quantity = data.quantity - 1;
  });

  setQuantityBox(id, "minus");
}

async function handleQuantityInput(id) {
  const inputElem = document.querySelector(`#quantityInput-${id}`);
  const quantity = parseInt(inputElem.value);

  if (quantity < 1 || quantity > 99) {
    return alert("수량은 1~99 사이가 가능합니다.");
  }

  await updateOrderSummary(id, "add-input");

  await updateProductItem(id, "input");

  await putToDb("cart", id, (data) => {
    data.quantity = quantity;
  });

  setQuantityBox(id, "input");
}

function setQuantityBox(id, type) {
  const isPlus = type.includes("plus");
  const isMinus = type.includes("minus");
  const isInput = type.includes("input");
  const isDisableAll = type.includes("disable");

  const minusButton = document.querySelector(`#minus-${id}`);
  const quantityInput = document.querySelector(`#quantityInput-${id}`);
  const plusButton = document.querySelector(`#plus-${id}`);

  minusButton.removeAttribute("disabled");
  quantityInput.removeAttribute("disabled");
  plusButton.removeAttribute("disabled");

  if (isDisableAll) {
    minusButton.setAttribute("disabled", "");
    quantityInput.setAttribute("disabled", "");
    plusButton.setAttribute("disabled", "");
    return;
  }

  let quantityUpdate;
  if (isPlus) {
    quantityUpdate = +1;
  } else if (isMinus) {
    quantityUpdate = -1;
  } else if (isInput) {
    quantityUpdate = 0;
  } else {
    quantityUpdate = 0;
  }

  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = currentQuantity + quantityUpdate;
  quantityInput.value = newQuantity;

  const isMin = newQuantity === 1;
  const isMax = newQuantity === 99;

  if (isMin) {
    minusButton.setAttribute("disabled", "");
  }

  if (isMax) {
    plusButton.setAttribute("disabled", "");
  }
}

async function deleteSelectedItems() {
  const { selectedIds } = await getFromDb("order", "summary");

  selectedIds.forEach((id) => deleteItem(id));
}

async function updateAllSelectCheckbox() {
  const { ids, selectedIds } = await getFromDb("order", "summary");

  const isOrderEmpty = ids.length === 0;
  const isAllItemSelected = ids.length === selectedIds.length;

  if (!isOrderEmpty && isAllItemSelected) {
    allSelectCheckbox.checked = true;
  } else {
    allSelectCheckbox.checked = false;
  }
}

async function deleteItem(id) {
  await deleteFromDb("cart", id);

  await updateOrderSummary(id, "removePermanent-deleteButton");

  document.querySelector(`#productItem-${id}`).remove();

  updateAllSelectCheckbox();
}

async function updateOrderSummary(id, type) {
  const isCheckbox = type.includes("checkbox");
  const isInput = type.includes("input");
  const isDeleteButton = type.includes("deleteButton");
  const isMinusButton = type.includes("minusButton");
  const isPlusButton = type.includes("plusButton");
  const isAdd = type.includes("add");
  const isRemoveTemp = type.includes("removeTemp");
  const isRemovePermanent = type.includes("removePermanent");
  const isRemove = isRemoveTemp || isRemovePermanent;
  const isItemChecked = document.querySelector(`#checkbox-${id}`).checked;
  const isDeleteWithoutChecked = isDeleteButton && !isItemChecked;

  let price;
  let quantity;

  if (isCheckbox || isDeleteButton) {
    const priceElem = document.querySelector(`#total-${id}`);
    price = convertToNumber(priceElem.innerText);

    quantity = 1;
  }

  if (isMinusButton || isPlusButton) {
    const unitPriceElem = document.querySelector(`#unitPrice-${id}`);
    price = convertToNumber(unitPriceElem.innerText);

    quantity = 0;
  }

  if (isInput) {
    const unitPriceElem = document.querySelector(`#unitPrice-${id}`);
    const unitPrice = convertToNumber(unitPriceElem.innerText);

    const inputElem = document.querySelector(`#quantityInput-${id}`);
    const inputQuantity = convertToNumber(inputElem.value);

    const quantityElem = document.querySelector(`#quantity-${id}`);
    const currentQuantity = convertToNumber(quantityElem.innerText);

    price = unitPrice * (inputQuantity - currentQuantity);

    quantity = 0;
  }

  const priceUpdate = isAdd ? +price : -price;
  const countUpdate = isAdd ? +quantity : -quantity;

  const currentCount = convertToNumber(productsCountElem.innerText);
  const currentProductsTotal = convertToNumber(productsTotalElem.innerText);
  const currentFee = convertToNumber(deliveryFeeElem.innerText);
  const currentOrderTotal = convertToNumber(orderTotalElem.innerText);

  if (!isDeleteWithoutChecked) {
    productsCountElem.innerText = `${currentCount + countUpdate}개`;
    productsTotalElem.innerText = `${addCommas(
      currentProductsTotal + priceUpdate
    )}원`;
  }

  const isFeeAddRequired = isAdd && currentFee === 0;

  if (isFeeAddRequired) {
    deliveryFeeElem.innerText = `3000원`;
    orderTotalElem.innerText = `${addCommas(
      currentOrderTotal + priceUpdate + 3000
    )}원`;
  }

  if (!isFeeAddRequired && !isDeleteWithoutChecked) {
    orderTotalElem.innerText = `${addCommas(
      currentOrderTotal + priceUpdate
    )}원`;
  }

  const isCartNowEmpty = currentCount === 1 && isRemove;

  if (!isDeleteWithoutChecked && isCartNowEmpty) {
    deliveryFeeElem.innerText = `0원`;

    const currentOrderTotal = convertToNumber(orderTotalElem.innerText);
    orderTotalElem.innerText = `${addCommas(currentOrderTotal - 3000)}원`;

    updateAllSelectCheckbox();
  }

  await putToDb("order", "summary", (data) => {
    const hasId = data.selectedIds.includes(id);

    if (isAdd && !hasId) {
      data.selectedIds.push(id);
    }

    if (isRemoveTemp) {
      data.selectedIds = data.selectedIds.filter((_id) => _id !== id);
    }

    if (isRemovePermanent) {
      data.ids = data.ids.filter((_id) => _id !== id);
      data.selectedIds = data.selectedIds.filter((_id) => _id !== id);
    }

    if (!isDeleteWithoutChecked) {
      data.productsCount += countUpdate;
      data.productsTotal += priceUpdate;
    }
  });

  updateAllSelectCheckbox();
}

async function updateProductItem(id, type) {
  const isInput = type.includes("input");
  const isIncrease = type.includes("increase");

  const unitPriceElem = document.querySelector(`#unitPrice-${id}`);
  const unitPrice = convertToNumber(unitPriceElem.innerText);

  const quantityElem = document.querySelector(`#quantity-${id}`);
  const currentQuantity = convertToNumber(quantityElem.innerText);

  const totalElem = document.querySelector(`#total-${id}`);
  const currentTotal = convertToNumber(totalElem.innerText);

  const inputElem = document.querySelector(`#quantityInput-${id}`);
  const inputQuantity = convertToNumber(inputElem.value);

  if (isInput) {
    quantityElem.innerText = `${inputQuantity}개`;
    totalElem.innerText = `${addCommas(unitPrice * inputQuantity)}원`;
    return;
  }

  const quantityUpdate = isIncrease ? +1 : -1;
  const priceUpdate = isIncrease ? +unitPrice : -unitPrice;

  quantityElem.innerText = `${currentQuantity + quantityUpdate}개`;
  totalElem.innerText = `${addCommas(currentTotal + priceUpdate)}원`;
}

async function insertOrderSummary() {
  const { productsCount, productsTotal } = await getFromDb("order", "summary");

  const hasItems = productsCount !== 0;

  productsCountElem.innerText = `${productsCount}개`;
  productsTotalElem.innerText = `${addCommas(productsTotal)}원`;

  if (hasItems) {
    deliveryFeeElem.innerText = `3,000원`;
    orderTotalElem.innerText = `${addCommas(productsTotal + 3000)}원`;
  } else {
    deliveryFeeElem.innerText = `0원`;
    orderTotalElem.innerText = `0원`;
  }
}
