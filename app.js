//Wrap code in an IIFE
(function () {
  let screen = document.querySelector(".screen");
  let buttons = document.querySelectorAll(".btn");
  let clear = document.querySelector(".btn-clear");
  let equal = document.querySelector(".btn-equal");

  //considering an empty array for storing answer in localstorage
  const values = JSON.parse(localStorage.getItem("values")) || [];
  //retrieve data from numbers that are clicked
  buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      let value = e.target.dataset.num;
      screen.value += value;
    });
    setLocal();
    pickFromLocal();
    renderAnswer();
  });
  values.forEach((valu) => pickFromLocal(valu));
  equal.addEventListener("click", function (e) {
    if (screen.value === "") {
      screen.value = "Please Enter a Value";
    } else {
      let answer = eval(screen.value);
      screen.value = answer;

      //storing the answer into the local storage
      values.push(answer);
      pickFromLocal(answer);
    }
    setLocal();
    pickFromLocal();
    renderAnswer();
  });
  //function for pick data from storage
  function pickFromLocal(valu) {
    console.log(valu);
  }
  //function to render the data into screen
  function renderAnswer() {
    screen.value = values;
  }
  clear.addEventListener("click", function (e) {
    screen.value = "";
    localStorage.clear(values.splice(0));
  });
  //function to storing the data into local storage
  function setLocal() {
    localStorage.setItem("values", JSON.stringify(values));
  }
})(); //end IIFE
