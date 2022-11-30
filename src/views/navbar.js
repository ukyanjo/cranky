export const createNavbar = () => {
  const pathname = window.location.pathname;

  switch (pathname) {
    case "/":
      addNavElements("admin register login account logout");
      break;
    case "/account/orders/":
      addNavElements("admin account logout");
      break;
    case "/account/security/":
      addNavElements("admin account logout");
      break;
    case "/account/signout/":
      addNavElements("admin account logout");
      break;
    case "/account/":
      addNavElements("admin logout");
      break;
    case "/admin/orders/":
      addNavElements("admin account logout");
      break;
    case "/admin/users/":
      addNavElements("admin account logout");
      break;
    case "/admin/":
      addNavElements("account logout");
      break;
    case "/cart/":
      addNavElements("admin register login account logout");
      break;
    case "/category/add/":
      addNavElements("admin account productAdd logout");
      break;
    case "/login/":
      addNavElements("register");
      break;
    case "/order/complete/":
      addNavElements("admin account logout");
      break;
    case "/order/":
      addNavElements("admin account logout");
      break;
    case "/product/add/":
      addNavElements("admin account logout");
      break;
    case "/product/detail/":
      addNavElements("admin register login account logout");
      break;
    case "/product/list/":
      addNavElements("admin register login account logout");
      break;
    case "/register/":
      addNavElements("login");
      break;

    default:
  }
};

const addNavElements = (keyString) => {
  const keys = keyString.split(" ");

  const container = document.querySelector("#navbar");
  const isLogin = sessionStorage.getItem("token") ? true : false;
  const isAdmin = sessionStorage.getItem("admin") ? true : false;

  const itemsBeforeLogin = {
    register: '<li><a href="/register">회원가입</a></li>',
    login: '<li><a href="/login">로그인</a></li>',
  };

  const itemsAfterLogin = {
    account: '<li><a href="/account">마이 페이지</a></li>',
    logout: '<li><a href="#" id="logout">로그아웃</a></li>',
    productAdd: '<li><a href="/product/add">제품 등록</a></li>',
    categoryAdd: '<li><a href="/category/add">카테고리 등록</a></li>',
  };

  const itemsForAdmin = {
    admin: '<li><a href="/admin">페이지 관리</a></li>',
  };

  const logoutScript = document.createElement("script");
  logoutScript.innerText = `
      const logoutElem = document.querySelector('#logout');

      if (logoutElem) {
        logoutElem.addEventListener('click', () => {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('admin');

          window.location.href = '/';
        });
      }
  `;

  let items = "";
  for (const key of keys) {
    if (isAdmin) {
      items += itemsForAdmin[key] ?? "";
    }
    if (isLogin) {
      items += itemsAfterLogin[key] ?? "";
    } else {
      items += itemsBeforeLogin[key] ?? "";
    }
  }

  container.insertAdjacentHTML("afterbegin", items);

  container.after(logoutScript);
};
