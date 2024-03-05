import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatGridListModule, RouterModule],
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss'
})
export class PokemonsComponent {
  
  pokemons: any[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemons().subscribe(data => {
      const allPokemons = data.results;
      console.log(allPokemons);
      allPokemons.forEach((pokemon: { name: string; }) => {
        this.pokemonService.getPokemonDetails(pokemon.name).subscribe(detail => {
          console.log('detail: ', detail);
          this.pokemons.push({
            name: pokemon.name,
            image: detail.sprites.other.dream_world.front_default
          });
        });
      });
    });
  }
}
