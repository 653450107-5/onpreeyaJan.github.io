const listWrapper = document.querySelector(".list-wrapper");
const loadMoreButton = document.querySelector("#load-more");
let allPokemons = [];
let offset = 0;
const LIMIT = 100; // จำนวนโปเกมอนที่ดึงต่อคำขอ

// Fetch Pokémon list with offset and limit
async function fetchPokemons(offset, limit) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch Pokémon list", error);
    return [];
  }
}

// Load more Pokémon
async function loadMorePokemons() {
  const pokemons = await fetchPokemons(offset, LIMIT);
  if (pokemons.length > 0) {
    allPokemons = allPokemons.concat(pokemons);
    displayPokemons(pokemons);
    offset += LIMIT;
  } else {
    // If no more Pokémon, disable the button
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "No more Pokémon";
  }
}

// Display list of Pokémon
function displayPokemons(pokemons) {
  pokemons.forEach((pokemon) => {
    const pokemonID = getPokemonID(pokemon.url);
    const listItem = createPokemonListItem(pokemon, pokemonID);

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./details/detail.html?id=${pokemonID}`;
      }
    });

    listWrapper.appendChild(listItem);
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
      <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg" alt="${pokemon.name}" />
    </div>
    <div class="name-wrap">
      <p class="body3-fonts">${pokemon.name}</p>
    </div>
  `;
  return listItem;
}

function getPokemonID(url) {
  return url.split("/")[6];
}

// Fetch Pokémon data before redirect
async function fetchPokemonDataBeforeRedirect(id) {
  try {
    await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokémon data before redirect");
    return false;
  }
}

// Event listener for Load More button
loadMoreButton.addEventListener("click", () => {
  loadMorePokemons();
});

// Initial load
loadMorePokemons();
