import * as Api from "../api.js";
import {
  blockIfLogin,
  getUrlParams,
  validateEmail,
  createNavbar,
} from "../useful-functions.js";

const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const submitButton = document.querySelector("#submitButton");

blockIfLogin();
addAllElements();
addAllEvents();

async function addAllElements() {
  createNavbar();
}

function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert(
      "비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요."
    );
  }

  try {
    const data = { email, password };

    const result = await Api.post("/api/login", data);
    const { token, isAdmin } = result;

    sessionStorage.setItem("token", token);

    alert(`정상적으로 로그인되었습니다.`);

    if (isAdmin) {
      sessionStorage.setItem("admin", "admin");
    }

    const { previouspage } = getUrlParams();

    if (previouspage) {
      window.location.href = previouspage;

      return;
    }

    window.location.href = "/";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
