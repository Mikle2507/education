const description = document.querySelector(".contacts__map-description");
const btnCloseDescriptionMap = document.querySelector(".contacts__map-description-btn-close");

const showDescriptionMap = () => {
  description.classList.add("contacts__map-description--active");
}

const hideDescriptionMap = () => {
  description.classList.remove("contacts__map-description--active");
}

btnCloseDescriptionMap.addEventListener("click", hideDescriptionMap);

export const map = (e) => {


  ymaps.ready(init);

  function init() {
    const myMap = new ymaps.Map("map", {
      center: [55.76953456898229, 37.63998549999998],
      zoom: 15,
      controls: []
    });

    const myPlacemark = new ymaps.Placemark([55.76953456898229, 37.63998549999998], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/placemark.png',
      iconImageSize: [12, 12],
      iconImageOffset: [-3, -42]
    });

    myPlacemark.events.add('click', function (e) {
      showDescriptionMap();
    });

    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable('scrollZoom');
  }

}
