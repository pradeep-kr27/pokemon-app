import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemons(limit: number = 8, offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${name}`);
  }

  getPokemonSpeciesDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon-species/${name}`);
  }


  fetchEvolultionDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon-species/${name}`).pipe(
      switchMap((species: any) => {
        const evolutionChainUrl = species.evolution_chain.url;
        return this.http.get(evolutionChainUrl);
      })
    );
  }
}
