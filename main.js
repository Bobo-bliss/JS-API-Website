const pokemonNames = [
  'abra',
  'alakazam',
  'arcanine',
  'blastoise',
  'bulbasaur',
  'charizard',
  'charmander',
  'charmeleon',
  'eevee',
  'flareon',
  'gloom',
  'growlithe',
  'gyarados',
  'ivysaur',
  'jolteon',
  'kadabra',
  'magikarp',
  'ninetales',
  'oddish',
  'pidgeot',
  'pidgeotto',
  'pidgey',
  'pikachu',
  'raichu',
  'squirtle',
  'vaporeon',
  'venusaur',
  'vileplume',
  'vulpix',
  'wartortle'
];

let sumOfPokemon = {
  water: 0,
  fire: 0,
  grass: 0,
  poison: 0,
  electric: 0,
  psychic: 0,
  normal: 0,
  flying: 0
};


//Variables
//Sum data container
const pokeElementContainer = document.querySelector('.poke-elm-ctn');
//Sorting buttons
const sortBtns = document.querySelectorAll('.sort-btn');
//Collections/Favorites buttons
const collFavBtns = document.querySelectorAll('.coll-fav-btn');
//Collection button
const collBtn = document.getElementById('coll-btn');
//Favorite button
const favsBtn = document.getElementById('favs-btn');
//Collections container
const collContainer = document.getElementById('coll-ctn');
//Favorites container
const favsContainer = document.getElementById('favs-ctn');

//Functions
//Fetch pokemon data
const getPokemon = async (names) => {
  try {
    const promises = names
      .map(name => fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => response.json()));
      const allPokemon = await Promise.all(promises);
      return allPokemon;
    } catch (error) {
      console.error('Error fetching pokemon data:', error);
      return [];
    }
};

//Make pokemon cards
const makePokemonCards = (pokemonData) => {
  pokemonData.forEach(pokemon => {
    const pokemonCard = document.createElement('div');
    // Capitalize the first letter of the Pokemon name
    const capitalizePokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      pokemonCard.innerHTML = `
        <h2>${capitalizePokemonName}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height} decimeters</p>
        <p>Weight: ${pokemon.weight} hectograms</p>
      `;
    pokemonCard.id = pokemon.name;
    pokemonCard.classList.add('poke-card-coll');
    collContainer.appendChild(pokemonCard);
  });
};

//DOM events after DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  //Add pokemon cards to DOM
  const pokemonData = await getPokemon(pokemonNames);
  makePokemonCards(pokemonData);

  //Display the sum of pokemon data
  const pokeTypeArray = [];
  pokemonData.forEach((card) => {
    card.types.forEach((category) => {
      pokeTypeArray.push(category.type.name);
    });
  });

  pokeTypeArray.forEach((type) => {
    if (type === 'water') {
      sumOfPokemon.water++;
    } else if (type === 'fire') {
      sumOfPokemon.fire++
    } else if (type === 'grass') {
      sumOfPokemon.grass++
    } else if (type === 'poison') {
      sumOfPokemon.poison++
    } else if (type === 'electric') {
      sumOfPokemon.electric++
    } else if (type === 'psychic') {
      sumOfPokemon.psychic++
    } else if (type === 'normal') {
      sumOfPokemon.normal++
    } else if (type === 'flying') {
      sumOfPokemon.flying++
    };
  });

  console.log(sumOfPokemon);

  for (const type in sumOfPokemon) {
    const pokeElement = document.createElement('div');
    pokeElement.innerHTML = `
      ${type}: ${sumOfPokemon[type]}${type !== 'flying' ? ',' : ''}
    `;
    pokeElementContainer.appendChild(pokeElement);
  }





  //Get all pokemon cards
  let collCards = document.querySelectorAll('.poke-card-coll');
  let favCards = document.querySelectorAll('.poke-card-fav');

  //Sort pokemon cards
  const sortPokemon = (sortDir) => {
    const pokemonCardsColl = Array.from(collCards);
    const pokemonCardsFav = Array.from(favCards);
    if (sortDir === 'asc') {
      pokemonCardsColl.sort((a, b) => a.id.localeCompare(b.id));
      pokemonCardsFav.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      pokemonCardsColl.sort((a, b) => b.id.localeCompare(a.id));
      pokemonCardsFav.sort((a, b) => b.id.localeCompare(a.id));
    };
    pokemonCardsColl.forEach((card) => collContainer.appendChild(card));
    pokemonCardsFav.forEach((card) => favsContainer.appendChild(card));
  };

  sortBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const sortDir = btn.dataset.sortdir;
      sortPokemon(sortDir);
    });
  });

  //Move pokemon cards to favorites/collection
const moveCards = (cardId, direction) => {
  const card  = document.getElementById(cardId);

  if (direction === 'toFavs') {
    card.classList.replace('poke-card-coll', 'poke-card-fav');
    favsContainer.appendChild(card);
  } else if (direction === 'toColl') {
    card.classList.replace('poke-card-fav', 'poke-card-coll');
    collContainer.appendChild(card);
  };
  collCards = document.querySelectorAll('.poke-card-coll');
  favCards = document.querySelectorAll('.poke-card-fav');
};
  
  //Make cards clickable
  //Move pokemon cards on click
  collCards.forEach((card) => {
    card.addEventListener('click', () => {
      //Get pokemon card ID
      const cardId = card.id;
      //Get pokemon card container ID
      const cardCtnId = card.parentNode.id;
      //Direction cards are moving
      const direction = cardCtnId === 'coll-ctn' ? 'toFavs' : 'toColl';

      moveCards(cardId, direction);
    });
  });

  //Make the Collection/Favorites buttons clickable
  collFavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.id === 'favs-btn') {
        favsContainer.classList.remove('hidden');
        collContainer.classList.add('hidden');
      } else {
        collContainer.classList.remove('hidden');
        favsContainer.classList.add('hidden');
      }
    });
  });

}); //End of DOMContentLoaded


//Programmatically add the pokemon element type data to HTML