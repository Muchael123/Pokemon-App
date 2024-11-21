export interface Main {
    count:    number;
    next:     string;
    previous: null;
    results:  Result[];
}

export interface Result {
    name: string;
    url:  string;
}

type Pokemon = {
    name: string;
    img: string;
}
export type PokemonData = Pokemon[];
   