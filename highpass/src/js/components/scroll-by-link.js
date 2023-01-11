import vars from '../_vars';

const scrollToBlock = (id) => {

  const el = document.querySelector(`#${id}`);
  const elemRect = el.getBoundingClientRect();
  window.scrollBy({
    top: elemRect.top - 90,
    behavior: 'smooth'
  });
}

export const scrollByLink = () => {

  vars.bodyEl.addEventListener("click", e => {
    const target = e.target;
    let element = null;

    if(element = target.closest(`a[href*="#"]`)) {
      e.preventDefault();
      const id = element.getAttribute("href").substring(1);

      if(id && id.length) {
        scrollToBlock(id);
      }
    }
  });
}
