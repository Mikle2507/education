document.addEventListener("DOMContentLoaded", function(){

  const swiper = new Swiper('.banner__swiper-container', {
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    allowTouchMove: false,
    loop: true,
    pagination: {
      clickable: true,
      el: '.banner__swiper-pagination',
    },
  });


  document.querySelectorAll('.slider-work__label').forEach(function(tabsBtn){
    tabsBtn.addEventListener('click', function(event){
      const path = event.currentTarget.dataset.path;

      document.querySelectorAll('.slider-work__label').forEach(function(tabContent){
        tabContent.classList.remove('slider-work__label-active');
      });

      event.currentTarget.classList.add('slider-work__label-active');

      document.querySelectorAll('.slide-work').forEach(function(tabContent){
        tabContent.classList.remove('slide-work__active');
      });

      document.querySelector(`[data-target="${path}"]`).classList.add('slide-work__active');
    })
  });

  $( ".faq__accordion" ).accordion({
    heightStyle: "content"
  });

  document.querySelector('#burger').addEventListener('click', function(event){
    const menu = document.querySelector('#menu-slide');

    menu.classList.toggle('menu-slide__active');

    if(menu.classList.contains('menu-slide__active'))
    {
      event.currentTarget.classList.add('burger__active');
    }
    else
    {
      event.currentTarget.classList.remove('burger__active');
    }
  });

  document.querySelector('#menu-slide__close').addEventListener('click', function(){
    document.querySelector('#menu-slide').classList.remove('menu-slide__active');
    document.querySelector('#burger').classList.remove('burger__active');
  });
});



