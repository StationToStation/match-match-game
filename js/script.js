let difficulty = document.querySelectorAll('.difficulty button');
difficulty.forEach((elem, i) => elem.addEventListener("click", function() {
  localStorage.setItem("difficulty", i);
}));
let backs = document.querySelectorAll('.backs button');
backs.forEach((elem, i) => elem.addEventListener("click", function() {
  localStorage.setItem("backs", i);
}));
let show=document.getElementById('showForm');
let form=document.querySelector('form');
show.addEventListener('click', ()=>form.classList.add("visible"));
let button = form.querySelector('a');
button.addEventListener('click', ()=>{
  let input=form.querySelectorAll('input');
  localStorage.setItem("firstName", input[0].value);
  localStorage.setItem("lastName", input[1].value);
  localStorage.setItem("email", input[2].value);
});
