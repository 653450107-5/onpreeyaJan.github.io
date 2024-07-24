const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
document.getElementById("name").innerText = name;

fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  .then((res) => res.json())
  .then((data) => {
    const details = document.getElementById("details");
    
    const sprite = data.sprites.front_default;
    const height = data.height;
    const weight = data.weight;
    const types = data.types.map(typeInfo => typeInfo.type.name);
    const stats = data.stats.map(statInfo => ({
      name: statInfo.stat.name,
      value: statInfo.base_stat
    }));
    const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name);

    let typeLinks = types.map(type => `<a href="type.html?type=${type}">${type}</a>`).join(", ");
    let abilityLinks = abilities.map(ability => `<a href="ability.html?ability=${ability}">${ability}</a>`).join(", ");
    let statList = stats.map(stat => `
      <div class="mb-2">
        <strong>${stat.name}:</strong>
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: ${stat.value}%" aria-valuenow="${stat.value}" aria-valuemin="0" aria-valuemax="100">${stat.value}</div>
        </div>
      </div>
    `).join("");

    details.innerHTML = `
      <div class='col-12'>
        <div class='card'>
          <img class='card-img-top' src='${sprite}' alt='${name}'>
          <div class='card-body'>
            <h2>${name}</h2>
            <p><strong>Height:</strong> ${height} decimetres</p>
            <p><strong>Weight:</strong> ${weight} hectograms</p>
            <p><strong>Types:</strong> ${typeLinks}</p>
            <p><strong>Abilities:</strong> ${abilityLinks}</p>
            <p><strong>Stats:</strong></p>
            ${statList}
          </div>
        </div>
      </div>
    `;
  })
  .catch((err) => console.error(err));
