import { checkLogin, createNavbar } from "../../useful-functions.js";
import * as Api from "../../api.js";

const securityTitle = document.querySelector("#securityTitle");
const fullNameInput = document.querySelector("#fullNameInput");
const fullNameToggle = document.querySelector("#fullNameToggle");
const passwordInput = document.querySelector("#passwordInput");
const passwordToggle = document.querySelector("#passwordToggle");
const passwordConfirmInput = document.querySelector("#passwordConfirmInput");
const postalCodeInput = document.querySelector("#postalCodeInput");
const searchAddressButton = document.querySelector("#searchAddressButton");
const addressToggle = document.querySelector("#addressToggle");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
const phoneNumberInput = document.querySelector("#phoneNumberInput");
const phoneNumberToggle = document.querySelector("#phoneNumberToggle");
const saveButton = document.querySelector("#saveButton");
const modal = document.querySelector("#modal");
const modalBackground = document.querySelector("#modalBackground");
const modalCloseButton = document.querySelector("#modalCloseButton");
const currentPasswordInput = document.querySelector("#currentPasswordInput");
const saveCompleteButton = document.querySelector("#saveCompleteButton");

checkLogin();
addAllElements();
addAllEvents();

function addAllElements() {
  createNavbar();
  insertUserData();
}

function addAllEvents() {
  fullNameToggle.addEventListener("change", toggleTargets);
  passwordToggle.addEventListener("change", toggleTargets);
  addressToggle.addEventListener("change", toggleTargets);
  phoneNumberToggle.addEventListener("change", toggleTargets);
  searchAddressButton.addEventListener("click", searchAddress);
  saveButton.addEventListener("click", openModal);
  modalBackground.addEventListener("click", closeModal);
  modalCloseButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", keyDownCloseModal);
  saveCompleteButton.addEventListener("click", saveUserData);
}

function toggleTargets(e) {
  const toggleId = e.target.id;
  const isChecked = e.target.checked;

  let targets;

  if (toggleId.includes("fullName")) {
    targets = [fullNameInput];
  }
  if (toggleId.includes("password")) {
    targets = [passwordInput, passwordConfirmInput];
  }
  if (toggleId.includes("address")) {
    targets = [
      postalCodeInput,
      address1Input,
      address2Input,
      searchAddressButton,
    ];
  }
  if (toggleId.includes("phoneNumber")) {
    targets = [phoneNumberInput];
  }

  let isFocused;

  for (const target of targets) {
    if (isChecked) {
      target.removeAttribute("disabled");

      !isFocused && target.focus();
      isFocused = true;

      continue;
    }
  }

  if (isChecked) {
    return;
  }

  for (const target of targets) {
    target.setAttribute("disabled", "");
  }
}

let userData;
async function insertUserData() {
  userData = await Api.get("/api/user");

  const { fullName, email, address, phoneNumber } = userData;

  userData.password = "";

  securityTitle.innerText = `회원정보 관리 (${email})`;
  fullNameInput.value = fullName;

  if (address) {
    const { postalCode, address1, address2 } = address;

    postalCodeInput.value = postalCode;
    address1Input.value = address1;
    address2Input.value = address2;
  } else {
    userData.address = { postalCode: "", address1: "", address2: "" };
  }

  if (phoneNumber) {
    phoneNumberInput.value = phoneNumber;
  }

  passwordInput.value = "";

  disableForm();
}

function disableForm() {
  fullNameInput.setAttribute("disabled", "");
  fullNameToggle.checked = false;
  passwordInput.setAttribute("disabled", "");
  passwordToggle.checked = false;
  passwordConfirmInput.setAttribute("disabled", "");
  postalCodeInput.setAttribute("disabled", "");
  addressToggle.checked = false;
  searchAddressButton.setAttribute("disabled", "");
  address1Input.setAttribute("disabled", "");
  address2Input.setAttribute("disabled", "");
  phoneNumberToggle.checked = false;
  phoneNumberInput.setAttribute("disabled", "");
}

function searchAddress(e) {
  e.preventDefault();

  new daum.Postcode({
    oncomplete: function (data) {
      let addr = "";
      let extraAddr = "";

      if (data.userSelectedType === "R") {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === "R") {
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
      } else {
      }

      postalCodeInput.value = data.zonecode;
      address1Input.value = `${addr} ${extraAddr}`;
      address2Input.placeholder = "상세 주소를 입력해 주세요.";
      address2Input.focus();
    },
  }).open();
}

async function saveUserData(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const phoneNumber = phoneNumberInput.value;
  const currentPassword = currentPasswordInput.value;

  const isPasswordLong = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPostalCodeChanged =
    postalCode !== (userData.address?.postalCode || "");
  const isAddress2Changed = address2 !== (userData.address?.address2 || "");
  const isAddressChanged = isPostalCodeChanged || isAddress2Changed;

  if (password && !isPasswordLong) {
    closeModal();
    return alert("비밀번호는 4글자 이상이어야 합니다.");
  }
  if (password && !isPasswordSame) {
    closeModal();
    return alert("비밀번호와 비밀번호확인이 일치하지 않습니다.");
  }

  const data = { currentPassword };

  if (fullName !== userData.fullName) {
    data.fullName = fullName;
  }

  if (password !== userData.password) {
    data.password = password;
  }

  if (isAddressChanged && !address2) {
    closeModal();
    return alert("주소를 모두 입력해 주세요.");
  }

  if (isAddressChanged) {
    data.address = {
      postalCode,
      address1,
      address2,
    };
  }

  if (phoneNumber && phoneNumber !== userData.phoneNumber) {
    data.phoneNumber = phoneNumber;
  }

  const toUpdate = Object.keys(data);
  if (toUpdate.length === 1) {
    disableForm();
    closeModal();
    return alert("업데이트된 정보가 없습니다");
  }

  try {
    const { _id } = userData;
    await Api.patch("/api/users", _id, data);

    alert("회원정보가 안전하게 저장되었습니다.");
    disableForm();
    closeModal();
  } catch (err) {
    alert(`회원정보 저장 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

function openModal(e) {
  e.preventDefault();

  modal.classList.add("is-active");
  currentPasswordInput.focus();
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
