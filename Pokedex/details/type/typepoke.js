const BASE_URL = "https://pokeapi.co/api/v2/type";
const LIST_WRAPPER_SELECTOR = ".list-wrapper";
const TYPE_TITLE_SELECTOR = "#type-title";
const typeWrapper = document.querySelector(LIST_WRAPPER_SELECTOR);
const typeTitle = document.querySelector(TYPE_TITLE_SELECTOR);
const loadMoreButton = document.querySelector("#load-more");

let allPokemons = [];
let offset = 0;
const LIMIT = 50;

document.addEventListener("DOMContentLoaded", main);

// Fetch Pokémon list by type with offset and limit
async function fetchPokemonsByType(type, offset = 0, limit = LIMIT) {
  try {
    const response = await fetch(`${BASE_URL}/${type}`);
    const data = await response.json();
    const pokemons = data.pokemon.slice(offset, offset + limit);
    return pokemons;
  } catch (error) {
    console.error("Failed to fetch Pokémon by type", error);
    return [];
  }
}

// Load more Pokémon by type
async function loadMorePokemons() {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type");
  if (!type) {
    console.error("No type parameter found in URL");
    return;
  }

  const pokemons = await fetchPokemonsByType(type, offset, LIMIT);
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
      <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg" alt="${pokemon.pokemon.name}" />
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
  const type = urlParams.get("type");

  if (!type) {
    console.error("No type parameter found in URL");
    return;
  }

  // Display selected type name
  typeTitle.textContent = capitalizeFirstLetter(type);

  // Initial load of Pokémon
  await loadMorePokemons();
}

// Event listener for Load More button
loadMoreButton.addEventListener("click", () => {
  loadMorePokemons();
});
