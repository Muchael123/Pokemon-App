

export async function FetchPokemons(url: string){
    try{
      const res = await  fetch(url);
        const data = await res.json();
        return data;
    }
    catch(e){
        console.error(e)
        return null;
    }
}