const element = document.querySelector(".select");
const choices = new Choices(element, {
  searchEnabled: false,
  shouldSort: false,
  itemSelectText: '',
  classNames: {
    containerOuter: 'select__choices choices',
    containerInner: 'select__choices-inner choices__inner',
    itemChoice: 'select__choices-item--choice choices__item--choice',
    listSingle: 'select__choices-list--single choices__list--single',
  }
});



ymaps.ready(init);
function init(){
    var myMap = new ymaps.Map("map", {
        center: [48.872185073737896,2.354223999999991],
        zoom: 17
    });

    var myPlacemark = new ymaps.Placemark([48.872185073737896,2.354223999999991], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/placemark.png',
      iconImageSize: [28, 40],
      iconImageOffset: [-3, -42]
    });

    myMap.geoObjects.add(myPlacemark);
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
    email: {
      required: true,
      email: true
    },
  },
  messages: {

    name: {
      required: 'Как вас зовут?',
      minLength: 'Имя слишком короткое',
      maxLength: 'Имя слишком длинное'
    },

    tel: {
      required: 'Укажите ваш телефон',
      function: 'Укажите телефон полностью'
    },
    email: {
      required: 'Укажите ваш e-mail',
      email: 'Укажите корректный e-mail'
    },
  },
});


tippy('.tooltip', {
  // hideOnClick: false,
  // trigger: 'click'
});
