import vars from '../_vars';
const searchEl = document.querySelector(".search");

const showSearchInput = () => {
  searchEl.classList.add("search--open");
}

const closeSearchInput = () => {
  searchEl.classList.remove("search--open");
}

export const search = (e) => {
  const searchBtn = document.querySelector(".search__btn");
  const searchBtnClose = document.querySelector(".search__btn-close");

  searchBtn.addEventListener("click", showSearchInput);
  searchBtnClose.addEventListener("click", closeSearchInput);

  vars.bodyEl.addEventListener("click", e => {
    const target = e.target;

    if(!target.closest(".search")) {
      closeSearchInput();
    }
  });
}
