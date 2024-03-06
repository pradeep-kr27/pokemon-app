import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable, Subscription, from, map, mergeMap, toArray } from 'rxjs';
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
  limit: number = 8;
  offset: number = 0;
  total: number = 0;
  currentPage: number = 1;
  cols$: Observable<number>;
  private breakpointSubscription!: Subscription;
  private subscriptions = new Subscription();

  constructor(private pokemonService: PokemonService, private breakpointObserver: BreakpointObserver, private titleService: Title) {
    this.cols$ = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 3;
        } else if (result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
          return 4;
        } else {
          return 4; // Default to 4 columns
        }
      })
    );
  }

  ngOnInit() {
    this.titleService.setTitle('Pokemon List');
    this.loadPokemons();
  }

  loadPokemons() {
    this.subscriptions.add(
      this.pokemonService.getPokemons(this.limit, this.offset).pipe(
        mergeMap(data => {
          this.total = data.count;
          return from(data.results);
        }),
        mergeMap((pokemon: any) => this.pokemonService.getPokemonDetails(pokemon.name)),
        toArray()
      ).subscribe(details => {
        this.pokemons = details.map(detail => ({
          name: detail.name,
          image: detail.sprites.other.dream_world.front_default
        }));
        console.log('Pokemons loaded:', this.pokemons);
      })
    );
  }

  nextPage() {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.currentPage++;
      this.loadPokemons();
    }
  }

  previousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage--;
      this.loadPokemons();
    }
  }

  getPageCount(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    this.subscriptions.unsubscribe();
  }
}
