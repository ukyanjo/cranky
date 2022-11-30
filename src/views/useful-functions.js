export const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getUrlParams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const result = {};

  for (const [key, value] of urlParams) {
    result[key] = value;
  }

  return result;
};

export const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const checkLogin = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    const pathname = window.location.pathname;
    const search = window.location.search;

    window.location.replace(`/login?previouspage=${pathname + search}`);
  }
};

export const checkAdmin = async () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    const pathname = window.location.pathname;
    const search = window.location.search;

    window.location.replace(`/login?previouspage=${pathname + search}`);
  }

  const res = await fetch("/api/admin/check", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { result } = await res.json();

  if (result === "success") {
    window.document.body.style.display = "block";

    return;
  } else {
    alert("관리자 전용 페이지입니다.");

    window.location.replace("/");
  }
};

export const blockIfLogin = () => {
  const token = sessionStorage.getItem("token");

  if (token) {
    alert("로그인 상태에서는 접근할 수 없는 페이지입니다.");
    window.location.replace("/");
  }
};

export const navigate = (pathname) => {
  return function () {
    window.location.href = pathname;
  };
};

export const convertToNumber = (string) => {
  return parseInt(string.replace(/(,|개|원)/g, ""));
};

export const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

export const compressString = (string) => {
  if (string.length > 10) {
    return string.substring(0, 9) + "..";
  }
  return string;
};

export const checkUrlParams = (key) => {
  const { [key]: params } = getUrlParams();

  if (!params) {
    window.location.replace("/page-not-found");
  }
};

export const randomPick = (items) => {
  const isArray = Array.isArray(items);

  if (isArray) {
    const randomIndex = [Math.floor(Math.random() * items.length)];

    return items[randomIndex];
  }

  const keys = Object.keys(items);
  const randomIndex = [Math.floor(Math.random() * keys.length)];
  const randomKey = keys[randomIndex];

  return items[randomKey];
};

export { createNavbar } from "./navbar.js";
