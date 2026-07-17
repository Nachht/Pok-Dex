let pokemonActual = null;
async function searchPokemon() {
    try {
        let pokemon = document.getElementById("pokemon-name").value.toLowerCase().trim();
        if (!pokemon) {
            alert("Por favor, ingrese un pokémon.");
            return;
        }

        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if (!response.ok) {
            throw new Error("Pokémon no encontrado");
        }
        let data = await response.json();
    
        pokemonActual = data;

        document.getElementById("resultado").innerHTML = `
            <h3>${data.name.toUpperCase()}</h3>
            <img src="${data.sprites.front_default}" alt="${data.name}">
        `;

    } catch (error) {
        pokemonActual = null;
        alert("Pokémon no encontrado.");
        document.getElementById("resultado").innerHTML = `
            <p>Pokémon no encontrado.</p>
        `;
    }
}
function saveFavorite() {
    if (!pokemonActual) {
        alert("Primero busca un Pokemon");
        return;
    }
    const favoritosGuardados = localStorage.getItem("favoritos");
    const favoritos = favoritosGuardados
        ? JSON.parse(favoritosGuardados)
        : [];
        
    const existe = favoritos.some(
        pokemon => pokemon.name === pokemonActual.name
    );
    if (!existe) {
        favoritos.push(pokemonActual);
        localStorage.setItem(
            "favoritos",
            JSON.stringify(favoritos)
        );
    }
    updateFavoritesList();
}
function updateFavoritesList() {
    const favoritosDiv = document.getElementById('favoritos');
    favoritosDiv.innerHTML = '';
    
    const favoritosStr = localStorage.getItem('favoritos');
    if (!favoritosStr) {
        favoritosDiv.innerHTML = '<p>No tienes ningún Pokémon en favoritos.</p>';
        return;
    }
    
    let listaFavoritos = [];
    try {
        listaFavoritos = JSON.parse(favoritosStr);
    } catch (error) {
        console.error("Error al analizar los favoritos de localStorage:", error);
        listaFavoritos = [];
    }
    
    if (listaFavoritos.length === 0) {
        favoritosDiv.innerHTML = '<p>No tienes ningún Pokémon en favoritos.</p>';
        return;
    }
    
    listaFavoritos.forEach(function(pokemon, index) {
        const pokemonCard = document.createElement('li');
        pokemonCard.className = 'favorite-card'; 
        
        const pokemonName = pokemon.name;
        const pokemonImage = pokemon.image || (pokemon.sprites && pokemon.sprites.front_default);
        
        pokemonCard.innerHTML = `
            <img src="${pokemonImage}" alt="${pokemonName}" class="favorite-image">
            <span class="favorite-name">${pokemonName}</span>
            <button class="btn-remove" onclick="removeFavorite(${index})">Eliminar</button>
        `;
        
        favoritosDiv.appendChild(pokemonCard);
    });
}

function removeFavorite(index) {
    const favoritosStr = localStorage.getItem('favoritos');
    if (!favoritosStr) return;
    
    let favoritos = [];
    try {
        favoritos = JSON.parse(favoritosStr);
    } catch (e) {
        favoritos = [];
    }
    favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    updateFavoritesList();
}

function clearAllFavorites() {
    localStorage.removeItem('favoritos');
    updateFavoritesList();
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn-search").addEventListener("click", searchPokemon);
    document.getElementById("btn-favorite").addEventListener("click", saveFavorite);
    const btnClearAll = document.getElementById("btn-clear-all");
    if (btnClearAll) {
        btnClearAll.addEventListener("click", clearAllFavorites);
    }
    
    updateFavoritesList();
});
