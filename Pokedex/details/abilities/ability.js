const BASE_URL = "https://pokeapi.co/api/v2/ability";
const LIST_WRAPPER_SELECTOR = ".list-wrapper";
const TYPE_TITLE_SELECTOR = "#type-title";
const typeWrapper = document.querySelector(LIST_WRAPPER_SELECTOR);
const typeTitle = document.querySelector(TYPE_TITLE_SELECTOR);
const loadMoreButton = document.querySelector("#load-more");

let allPokemons = [];
let offset = 0;
const LIMIT = 50;

document.addEventListener("DOMContentLoaded", main);

// Fetch Pokémon list by ability with offset and limit
async function fetchPokemonsByAbility(ability, offset = 0, limit = LIMIT) {
  try {
    const response = await fetch(`${BASE_URL}/${ability}`);
    const data = await response.json();
    const pokemons = data.pokemon.slice(offset, offset + limit);
    return pokemons;
  } catch (error) {
    console.error("Failed to fetch Pokémon by ability", error);
    return [];
  }
}

// Load more Pokémon by ability
async function loadMorePokemons() {
  const urlParams = new URLSearchParams(window.location.search);
  const ability = urlParams.get("name");
  if (!ability) {
    console.error("No ability parameter found in URL");
    return;
  }

  const pokemons = await fetchPokemonsByAbility(ability, offset, LIMIT);
  if (pokemons.length > 0) {
    allPokemons = allPokemons.concat(pokemons);
    displayPokemons(pokemons);
    offset += LIMIT;
  } else {
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "No more Pokémon";
  }
}

// Display list of Pokémon
function displayPokemons(pokemons) {
  typeWrapper.innerHTML = ''; // Clear previous items
  pokemons.forEach((pokemon) => {
    const pokemonID = getPokemonID(pokemon.pokemon.url);
    const listItem = createPokemonListItem(pokemon, pokemonID);

    listItem.addEventListener("click", () => {
      window.location.href = `../detail.html?id=${pokemonID}`;
    });

    typeWrapper.appendChild(listItem);
  });
}

// Create Pokémon list item
function createPokemonListItem(pokemon, id) {
  const listItem = document.createElement("div");
  listItem.className = "list-item";
  listItem.innerHTML = `
  <div class="number-wrap">
    <p class="caption-fonts">${id}</p>
  </div>
  <div class="img-wrap">
    <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg" alt="${pokemon.pokemon.name}" onerror="this.onerror=null; this.src='path/to/default/image.png';" />
  </div>
  <div class="name-wrap">
    <p class="body3-fonts">${pokemon.pokemon.name}</p>
  </div>
`;
  return listItem;
}

// Get Pokémon ID from URL
function getPokemonID(url) {
  return url.split("/")[6];
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Main function to fetch and display Pokémon
async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const ability = urlParams.get("name");

  if (!ability) {
    console.error("No ability parameter found in URL");
    return;
  }

  // Display selected ability name
  typeTitle.textContent = capitalizeFirstLetter(ability);

  // Initial load of Pokémon
  await loadMorePokemons();
}

// Event listener for Load More button
loadMoreButton.addEventListener("click", () => {
  loadMorePokemons();
});
