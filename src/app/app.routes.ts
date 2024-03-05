import { Routes } from '@angular/router';
import { PokemonsComponent } from './pokemons/pokemons.component';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonsComponent },
    { path: 'pokemon/:name', component: PokemonDetailsComponent }
];

