import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { PokemonData } from '@/constants/Types';
import { router } from 'expo-router';
import { Audio } from 'expo-av';


export default function TabOneScreen() {
  const [pokemons, setPokemons] = useState<PokemonData | null>(null);
  const [offset, setOffset] = useState<number>(30);
  const [limit, setLimit] = useState<number>(6);
  const [level, setLevel] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemonList, setPokemonList] = useState <string[]>([]);
  const [gameError, setGameError] = useState<string | null>(null);
  const [win, setWin] = useState<boolean>(false);
  const [Winsound, setWinSound] = useState<Audio.Sound | null>(null);
  const [Losesound, setLoseSound] = useState<Audio.Sound | null>(null);
  const [flipSound, setFlipSound] = useState<Audio.Sound | null>(null);

  const FetchSound = async () => {
    const win = new Audio.Sound();
    const lose = new Audio.Sound();
    const flip = new Audio.Sound();
    try {
      await win.loadAsync(require('../../assets/sounds/success.mp3'));
      await lose.loadAsync(require('../../assets/sounds/lose.mp3'));
      await flip.loadAsync(require('../../assets/sounds/flipcard.mp3'));
      setWinSound(win);
      setLoseSound(lose);
      setFlipSound(flip);
    } catch (e) {
      console.error(e);
    }
  }

  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  
  const fetchpokeImage = async (name: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      return data.sprites?.front_default || null; // Extract the default image
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchPokemons = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      const data = await res.json();
      const PokeData: PokemonData = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const img = await fetchpokeImage(pokemon.name);
          return { name: pokemon.name, img: img || '' };
        })
      );

      setPokemons(PokeData);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch Pokémon data.');
      setLoading(false);
    }
  };

  // Fetch Pokémon data when the component mounts or offset changes
  useEffect(() => {
    fetchPokemons(url);
    
  }, [offset]);
  useEffect(() => {
    FetchSound();
    return () => {
      Winsound?.unloadAsync();
      Losesound?.unloadAsync();
      flipSound?.unloadAsync();
    }
  }, []);

  const HandleCardClick = async (name: string) => {
    setGameError(null);
  
    if (pokemonList.includes(name)) {
      console.log("Already in list");
      setGameError(
        `You already have ${name} in your list \n Your score is ${pokemonList.length} \n You Failed!`
      );
      if (Losesound) {
        await Losesound.setPositionAsync(0); // Reset sound to start
        await Losesound.playAsync(); // Play the sound
      }
      setPokemonList([]);
      return;
    }
  
    // Add to the list
    setPokemonList([...pokemonList, name]);
    console.log("my list...", pokemonList.length);
    console.log(pokemonList.length+1 === limit, pokemonList.length)
    if (pokemonList.length+1 === limit) {
      setWin(true);
      await GameWin();
      return;
    }
  
    if (flipSound) {
      await flipSound.setPositionAsync(0); // Reset sound to start
      await flipSound.playAsync(); // Play the sound
    }
  
    // Shuffle the Pokémon list
    if (pokemons) {
      setPokemons(pokemons.sort(() => Math.random() - 0.5));
    }
  };
  

  const GameWin = async () => {
    
    console.log("You Win");
    setLevel(prev => prev+1);
    setLimit(prev => prev+2)
    setOffset(prev => prev+limit);
    if (Winsound) {
      await Winsound.setPositionAsync(0); // Reset sound to start
      await Winsound.playAsync(); // Play the sound
    }
    setPokemonList([]);
    console.log("You Win");
    // router.push(`/${win.toString()}`);
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={{width: Dimensions.get('screen').width*.9,flexDirection: 'row', justifyContent: 'space-between', display: 'flex'}}>
      <Text style={styles.title}>Pokémon List</Text>
      <Text style={styles.title1}>Level {level}</Text>
      </View>
      {gameError ? <Text style={styles.errorText}>{gameError}</Text> : 
      <Text style={styles.title}>Your score is {pokemonList.length}</Text>
      }
      {/* Show loading state */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Show error state */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Show Pokémon list */}
      {pokemons && (
        <FlatList
          data={pokemons}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={{gap:5,columnGap:5}}
          
          renderItem={({ item }) => (
            
            <TouchableOpacity style={styles.pokemonCard} onPress={()=>HandleCardClick(item.name)}>
              <Image source={{ uri: item.img }} style={styles.pokemonImage} />
              <Text style={styles.pokemonName}>
              {pokemonList.includes(item.name) ? "Selected" : item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 0 : 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'green'
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: 'red',
  },
  pokemonCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
