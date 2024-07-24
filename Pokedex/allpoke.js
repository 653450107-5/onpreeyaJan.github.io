fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const datas = data.results;
    const ele = document.getElementById("name");
    let count = 1;
    datas.forEach((element) => {
      const name = element.name;
      ele.innerHTML +=
        "<div class='col-3'>" +
       "<a href='details/details.html?name=" + name + "'>" +
        "<div class='card'>" +
        "<img class='card-img-top' src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+count+".png'>" +
        "<div class='card-body'>" +
        name +
        "</div></div></div>";
        count++;
    });
  })
  .catch((err) => console.error(err));
