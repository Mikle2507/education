const popupGallery = document.querySelector('.gallery-popup'),
    body = document.body;

const heroSwiper = new Swiper('.hero__swiper', {
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 2000
  },
  allowTouchMove: false
});

var gallerySwiper1 = new Swiper(".gallery__swiper-1", {
  loop: false,
  speed: 800,

  pagination: {
    el: ".gallery__swiper-button-pagination-1",
    type: "fraction",
  },
  navigation: {
    nextEl: ".gallery__swiper-button-next-1",
    prevEl: ".gallery__swiper-button-prev-1",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 0,
      grid: {
        rows: 1,
      },
    },
    350: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 15,
      grid: {
        rows: 1,
      },
    },
    650: {
      spaceBetween: 34,
      slidesPerView: 2,
      slidesPerGroup: 2,
      grid: {
        rows: 2,
      },
    },
    1200: {
      spaceBetween: 50,
      slidesPerView: 3,
      slidesPerGroup: 6,
      grid: {
        rows: 2,
      },
    },
  },
});



var projectsSwiper = new Swiper(".projects__swiper", {
  loop: true,

  navigation: {
    nextEl: ".projects__swiper-button-next",
    prevEl: ".projects__swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    500: {
      slidesPerView: 2,
      spaceBetween: 34,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 50,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
});


const WIDTH_BREAK_EVENTS = 650,
      WIDTH_BREAK_PUBLICATIONS = 330;

let publicationsSwiper;
const publicationSlider = document.querySelector('.publications__swiper');


function mobileSliderPublication() {

  if (window.innerWidth <= WIDTH_BREAK_PUBLICATIONS) {

    publicationSlider.dataset.mobile = 'false';

    if (publicationSlider.classList.contains('swiper-initialized'))
      publicationsSwiper.destroy();
  }

  if (window.innerWidth >= WIDTH_BREAK_PUBLICATIONS && publicationSlider.dataset.mobile == 'false' ) {

    publicationsSwiper = new Swiper(publicationSlider, {
      loop: true,
      speed: 800,
      pagination: {
        el: ".publications__swiper-button-pagination",
        type: "fraction",
      },
      navigation: {
        nextEl: ".publications__swiper-button-next",
        prevEl: ".publications__swiper-button-prev",
      },
      breakpoints: {
        330: {
          spaceBetween: 34,
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        1024: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 50,
        },
        1200: {
          spaceBetween: 50,
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
      },
    });

    publicationSlider.dataset.mobile = 'true';
  }
}


let eventSwiper;

const eventSlider = document.querySelector('.events__swiper');


function mobileSliderEvents() {

	if (window.innerWidth < WIDTH_BREAK_EVENTS && (eventSlider.dataset.mobile == 'false')) {

    eventSwiper = new Swiper(eventSlider, {
      loop: true,
      pagination: {
        el: '.events__pagination',
        clickable: true,
        bulletActiveClass: 'events__pagination-bullet-active',
        bulletClass: 'events__pagination-bullet'
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 15,
          autoHeight: false,
        },
        420: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 15,
          autoHeight: false,
        },
      }
    });

    eventSlider.dataset.mobile = 'true';
	}

	if (window.innerWidth >= WIDTH_BREAK_EVENTS) {

		eventSlider.dataset.mobile = 'false';
		if (eventSlider.classList.contains('swiper-initialized'))
			eventSwiper.destroy();

	}
}

mobileSliderEvents();
mobileSliderPublication();

window.addEventListener('resize', () => {
	mobileSliderEvents();
  mobileSliderPublication();
});



const filter = document.querySelector(".filter");
const choices = new Choices(filter, {
  searchEnabled: false,
  shouldSort: false,
  itemSelectText: '',
  classNames: {
    containerOuter: 'filter__choices choices',
    containerInner: 'filter__choices-inner choices__inner',
    itemChoice: 'filter__choices-item--choice choices__item--choice',
    listSingle: 'filter__choices-list--single choices__list--single',
  },
});


$( ".catalog__accordion" ).accordion({
  heightStyle: "content"
});

tippy('.tooltip', {
  // hideOnClick: false,
  trigger: 'click'
});

ymaps.ready(init);

function init(){

  let center = [55.75915464391231,37.60954256481995];

    if (window.innerWidth < 800)
      center = [55.75846806898367,37.60108849999989]

    var myMap = new ymaps.Map("map", {
        center: center,
        zoom: 15,
        controls: []
    });

    var zoomControl = new ymaps.control.ZoomControl({
      options: {
          size: "small",
      }
    });

    myMap.controls.add(zoomControl);

    var geolocationControl = new ymaps.control.GeolocationControl();

    myMap.controls.add(geolocationControl);

    var myPlacemark = new ymaps.Placemark([55.758468,37.601088], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/placemark.png',
      iconImageSize: [20, 20],
      iconImageOffset: [-5, -5]
    });

    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable('scrollZoom');
}


var selector = document.querySelector(".form__input-phone");
var im = new Inputmask("+7 (999)-999-99-99");
im.mask(selector);

new JustValidate('.form', {
  rules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 15
    },
    tel: {
      required: true,
      function: (name, value)=>{
        const phone = selector.inputmask.unmaskedvalue();
        return Number(phone) && phone.length === 10
      }
    },
  },
  messages: {

    name: {
      required: 'Как вас зовут?',
      minLength: 'Имя слишком короткое',
      maxLength: 'Имя слишком длинное',
      function: 'Недопустимый формат'
    },

    tel: {
      required: 'Укажите ваш телефон',
      function: 'Укажите телефон полностью'
    },
  },
});

eventsBtn = document.querySelector('.events__btn');
eventsBtn.addEventListener('click', function(event){
  document.querySelectorAll('.event').forEach(function(eventCol){
    eventCol.classList.remove('event-hidden');
    eventCol.classList.remove('event-hidden-sm');
  });
  eventsBtn.classList.add('events__btn-hidden');
});

document.querySelectorAll('.catalog__tab').forEach(function(tabsBtn){
  tabsBtn.addEventListener('click', function(event){
    const path = event.currentTarget.dataset.path;

    document.querySelectorAll('.catalog__tab').forEach(function(tabContent){
      tabContent.classList.remove('catalog__tab-active');
    });

    event.currentTarget.classList.add('catalog__tab-active');

    document.querySelectorAll('.catalog__content').forEach(function(tabContent){
      tabContent.classList.remove('catalog__content-active');
    });

    document.querySelector(`[data-target="${path}"]`).classList.add('catalog__content-active');

  })
});

document.querySelectorAll('.catalog__item-tab').forEach(function(tabsBtn){
  tabsBtn.addEventListener('click', function(event){
    const path = event.currentTarget.dataset.path;

    document.querySelectorAll('.catalog__item-tab').forEach(function(tabContent){
      tabContent.classList.remove('catalog__item-tab-active');
    });

    event.currentTarget.classList.add('catalog__item-tab-active');

    document.querySelectorAll('.catalog__artist-content').forEach(function(tabContent){
      tabContent.classList.remove('catalog__artist-content-active');
    });

    document.querySelector(`[data-target="${path}"]`).classList.add('catalog__artist-content-active');

  })
});

document.querySelectorAll('.menu-dropdown__btn').forEach(function(tabsBtn){
  tabsBtn.addEventListener('click', function(event){
    const path = event.currentTarget.dataset.path;

    document.querySelectorAll('.menu-dropdown__btn').forEach(function(tabContent){
      tabContent.classList.remove('menu-dropdown__btn-active');
    });

    document.querySelectorAll('.menu-board').forEach(function(tabContent){
      tabContent.classList.remove('menu-board-active');
    });

    if(event.currentTarget.classList.contains('menu-dropdown__btn-active'))
    {
      event.currentTarget.classList.remove('menu-dropdown__btn-active');
      document.querySelector(`[data-target="${path}"]`).classList.remove('menu-board-active');
    }
    else
    {
      event.currentTarget.classList.add('menu-dropdown__btn-active');

      document.querySelector(`[data-target="${path}"]`).classList.add('menu-board-active');

    }
  })
});

document.querySelectorAll('a[href^="#"').forEach(link => {

  link.addEventListener('click', function(e) {
      e.preventDefault();

      let href = this.getAttribute('href').substring(1);

      const scrollTarget = document.getElementById(href);

      //const topOffset = document.querySelector('.scrollto').offsetHeight;
      const topOffset = 20; // если не нужен отступ сверху
      const elementPosition = scrollTarget.getBoundingClientRect().top;
      const offsetPosition = elementPosition - topOffset;

      window.scrollBy({
          top: offsetPosition,
          behavior: 'smooth'
      });
  });
});

document.querySelectorAll('.menu-slide__link').forEach(link => {
  const menu = document.querySelector('#menu-slide');
  link.addEventListener('click', function(e) {
    menu.classList.remove('menu-slide-active');
    body.classList.remove('overflow-hidden');
  });
});


const slideSearch = document.querySelector('.search-slide'),
      slideSearchInput = document.querySelector('.search-slide__input'),
      slideSearchBtn = document.querySelector('.search-slide__btn'),
      slideSearchInner = document.querySelector('.search-slide__inner'),
      slideSearchClose = document.querySelector('.search-slide__close');


slideSearchBtn.addEventListener('click', function(event){

  let active = event.currentTarget.dataset.active;

  if(active != 'Y')
  {
    event.preventDefault();
    showSearchInput();
  }
});

document.addEventListener('click', function(e) {
  const target = e.target;
  const itsSlideSearch = target == slideSearch || slideSearch.contains(target);

  if(!itsSlideSearch)
    hideSearchInput();

  if (!target.closest(".menu-dropdown")) {
    document.querySelectorAll(".menu-board").forEach(el => {
        el.classList.remove("menu-board-active");
    })
      document.querySelectorAll(".menu-dropdown__btn").forEach(el => {
        el.classList.remove("menu-dropdown__btn-active");
    });
  }

});


slideSearchClose.addEventListener('click', function(event){
  hideSearchInput();
});

function showSearchInput()
{
  slideSearchInput.classList.add('search-slide__input-active');
  slideSearch.classList.add('search-slide-active');
  slideSearchInner.classList.add('search-slide__inner-active');
  slideSearchClose.classList.add('search-slide__close-active');
  slideSearchBtn.dataset.active = "Y";
}
function hideSearchInput()
{
  slideSearchInput.classList.remove('search-slide__input-active');
  slideSearch.classList.remove('search-slide-active');
  slideSearchInner.classList.remove('search-slide__inner-active');
  slideSearchClose.classList.remove('search-slide__close-active');
  slideSearchBtn.dataset.active = "";
}


document.querySelector('#burger').addEventListener('click', function(event){
  const menu = document.querySelector('#menu-slide');

  menu.classList.toggle('menu-slide-active');

  if(menu.classList.contains('menu-slide-active'))
  {
    event.currentTarget.classList.add('burger__active');
    body.classList.add('overflow-hidden');
  }
  else
  {
    event.currentTarget.classList.remove('burger__active');
    body.classList.remove('overflow-hidden');
  }
});

function closeMenuSlide(){
  document.querySelector('#menu-slide').classList.remove('menu-slide-active');
  document.querySelector('#burger').classList.remove('burger__active');
  body.classList.remove('overflow-hidden');
}

document.querySelector('#menu-slide__close').addEventListener('click', function(){
  closeMenuSlide();
});
document.querySelector('.menu-slide__shadow').addEventListener('click', function(){
  closeMenuSlide();
});

document.addEventListener("DOMContentLoaded", function () {
  const MOBILE_WIDTH = 650;
  let acc;
  const accWrap = document.querySelector(".js-accordion-wrap");
  const checkboxes = accWrap.querySelector(".js-checkboxes");
  const accHeader = accWrap.querySelector(".js-accordion-heading");

  function sortElems(elems) {
    elems.sort(function (a, b) {
      const valueA = parseInt(a.parentNode.dataset.position);
      const valueB = parseInt(b.parentNode.dataset.position);

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0;
    });
  }

  function getWindowWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.body.clientWidth,
      document.documentElement.clientWidth
    );
  }

  function removeCheckbox (e) {
    checkboxes.append(e.target.parentElement);
    e.target.removeEventListener('change', removeCheckbox);
  }

  function onAccordionClick(evt, ui) {
    const checkedBoxes = Array.from(accWrap.querySelectorAll(".js-checkbox"));
    sortElems(checkedBoxes);

    if (!ui.newHeader[0]) {
      checkedBoxes.forEach(function (el) {
        if (el.checked) {
          accWrap.append(el.parentNode);
          el.addEventListener('change', removeCheckbox);
        }
      });
    } else {
      checkedBoxes.forEach(function (el) {
        checkboxes.append(el.parentNode);
        el.removeEventListener('change', removeCheckbox);
      });
    }
  }

  function checkWindowWidth() {
    var currentWidth = getWindowWidth();
    checkedBoxes = Array.from(accWrap.querySelectorAll(".js-checkbox"));

    if (currentWidth > MOBILE_WIDTH && acc) {
      acc.accordion("destroy");
      acc = false;
      checkedBoxes.forEach(function (el) {
        checkboxes.append(el.parentNode);
      });
    } else if ((currentWidth <= MOBILE_WIDTH) & !acc) {
      acc = $(".js-accordion").accordion({
        header: '.js-accordion-heading',
        collapsible: true,
        active: false,
        icons: false,
        heightStyle: "auto",
        activate: function (evt, ui) {
          console.log(ui);
          onAccordionClick(evt, ui);
        }
      });

      checkedBoxes.forEach(function (el) {
        if (el.checked) {
          accWrap.append(el.parentNode);
        }
      });
    }
  }

  checkWindowWidth();
  window.addEventListener("resize", function () {
    checkWindowWidth();
  });
});


document.querySelectorAll('.gallery__item').forEach(function(item){
  item.addEventListener('click', function(event){
    var title=null,
        subtitle=null,
        date=null,
        text=null,
        img=null;

    if(item.querySelector('.gallery-info__title'))
      title = item.querySelector('.gallery-info__title').innerHTML;

    if(item.querySelector('.gallery-info__subtitle'))
      subtitle = item.querySelector('.gallery-info__subtitle').innerHTML;

    if(item.querySelector('.gallery-info__date'))
      date = item.querySelector('.gallery-info__date').innerHTML;

    if(item.querySelector('.gallery-info__text'))
      text = item.querySelector('.gallery-info__text').innerHTML;

    if(item.querySelector('.gallery-info__img'))
      img = item.querySelector('.gallery-info__img').innerHTML;


    if(!title && !subtitle && !date && !text && !img)
      return false;


    titlePopup = popupGallery.querySelector('.gallery-popup__title');
    subtitlePopup = popupGallery.querySelector('.gallery-popup__subtitle');
    datePopup = popupGallery.querySelector('.gallery-popup__date');
    textPopup = popupGallery.querySelector('.gallery-popup__text');
    imgPopup = popupGallery.querySelector('.gallery-popup__img');


    if(title)
    {
      titlePopup.innerHTML=title;
      titlePopup.classList.remove("hide-block");
    }
    else
    {
      titlePopup.innerHTML='';
      titlePopup.classList.add("hide-block");
    }

    if(subtitle)
    {
      subtitlePopup.innerHTML=subtitle;
      subtitlePopup.classList.remove("hide-block");
    }
    else
    {
      subtitlePopup.innerHTML='';
      subtitlePopup.classList.add("hide-block");
    }

    if(date)
    {
      datePopup.innerHTML=date;
      datePopup.classList.remove("hide-block");
    }
    else
    {
      datePopup.innerHTML='';
      datePopup.classList.add("hide-block");
    }

    if(text)
    {
      textPopup.innerHTML=text;
      textPopup.classList.remove("hide-block");
    }
    else
    {
      textPopup.innerHTML='';
      textPopup.classList.add("hide-block");
    }

    if(img)
    {
      imgPopup.style.backgroundImage = "url("+img+")";
    }
    else
    {
      imgPopup.style.backgroundImage='';
    }

    popupGallery.classList.add("gallery-popup-active");
    body.classList.add("overflow-hidden");

  });
});




function closePopupGallery ()
{

  titlePopup = popupGallery.querySelector('.gallery-popup__title');
  subtitlePopup = popupGallery.querySelector('.gallery-popup__subtitle');
  datePopup = popupGallery.querySelector('.gallery-popup__date');
  textPopup = popupGallery.querySelector('.gallery-popup__text');
  imgPopup = popupGallery.querySelector('.gallery-popup__img');

  popupGallery.classList.remove("gallery-popup-active");
  body.classList.remove("overflow-hidden");
  titlePopup.innerHTML = "";
  subtitlePopup.innerHTML = "";
  datePopup.innerHTML = "";
  textPopup.innerHTML = "";
  imgPopup.style.backgroundImage = "";

}

document.querySelector('.gallery-popup__close').addEventListener('click', function(){
  closePopupGallery ();
});

document.querySelector('.gallery-popup__shadow').addEventListener('click', function(){
  closePopupGallery ();
});
