import Router from "next/router";

export async function logout() {
  localStorage.removeItem("token");
  // Router.push("/");
}
