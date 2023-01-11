import vars from '../_vars';
const menuEl = document.querySelector(".menu-mob");

const showMenu = () => {
  menuEl.classList.add("menu-mob--active");
  vars.bodyEl.classList.add("overflow-hidden");
}

const closeMenu = () => {
  menuEl.classList.remove("menu-mob--active");
  vars.bodyEl.classList.remove("overflow-hidden");
}

export const menu = (e) => {
  const burger = document.querySelector(".burger");
  const close = document.querySelector(".menu-mob__close");

  burger.addEventListener("click", showMenu);
  close.addEventListener("click", closeMenu);
}
