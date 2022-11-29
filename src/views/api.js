async function get(endpoint, params = "") {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`GET 요청: ${apiUrl} `);
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;
    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

async function post(endpoint, data) {
  const apiUrl = endpoint;
  const bodyData = JSON.stringify(data);
  console.log(`POST 요청: ${apiUrl}`);
  console.log(`POST 요청 데이터: ${bodyData}`);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;
    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

async function patch(endpoint, params = "", data) {
  const apiUrl = `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);
  console.log(`PATCH 요청: ${apiUrl}`);
  console.log(`PATCH 요청 데이터: ${bodyData}`);
  const res = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;
    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

async function del(endpoint, params = "", data = {}) {
  const apiUrl = `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);
  console.log(`DELETE 요청: ${apiUrl}`);
  console.log(`DELETE 요청 데이터: ${bodyData}`);
  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;
    throw new Error(reason);
  }
  const result = await res.json();
  return result;
}

export { get, post, patch, del as delete };
