document.querySelector('#burger').addEventListener('click', function(event){
  const menu = document.querySelector('#menu-slide');
  menu.classList.toggle('menu-slide__active');
});

document.querySelector('#menu-slide__close').addEventListener('click', function(){
  document.querySelector('#menu-slide').classList.remove('menu-slide__active');
});
