gsap.from(".hero__title", {opacity: 0, y: 50, duration: 1, delay: 0.5, ease: "power4.out"});
    gsap.from(".hero__btn", {opacity: 0, y: 40, duration: 0.8, delay: 0.5, ease: "power4.out"});

    gsap.fromTo(".hero__descr", {opacity: 0}, {opacity: 1, duration: 2, delay: .8, ease: "power1.out"});

    const imgItems = document.querySelectorAll('.photos__item');
    let delay = 1.1;
    for (let i = 0; i < imgItems.length; i++) {
      gsap.fromTo(imgItems[i], {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 0.7, delay: delay});
      delay += 0.4;
    }

    gsap.fromTo(".photos__author", {opacity: 0}, {opacity: 1, duration: 2.5, delay: 2.1});

    let tl = gsap.timeline({paused: true});

    tl
      .to(".menu", {display: "block"})
      .from(".menu__top", {opacity: 0, y: -50, duration: 0.5, ease: "power4.out"}, 1)
      .from(".menu__container-wrapper", {opacity: 0, y: 50, duration: 0.5, ease: "power4.out"}, 1.2)
      .from(".nav__list", {opacity: 0, y: 50, duration: 0.5, ease: "power4.out"}, 1.5)
      .from(".social", {opacity: 0, y: 50, duration: 0.5, ease: "power4.out"}, 2)
      .from(".menu__right", {opacity: 0, y: 50, duration: 0.5, ease: "power4.out"}, 2)

    const burger = document.querySelector('.burger'),
          close = document.querySelector('.close'),
          menu = document.querySelector('.menu');

    burger.addEventListener('click', function() {
      tl.play();
    });

    close.addEventListener('click', function() {
      tl.reverse();
    });
