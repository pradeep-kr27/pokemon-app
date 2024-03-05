import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemons(offset = 0, limit = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`);
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
        // Assuming the response has a URL you need to call next
        const nextUrl = species.evolution_chain.url; // Replace `someUrlField` with the actual field name from the response
        return this.http.get(nextUrl);
      })
    );
  }
}
