import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';

interface EvolutionChain {
  species_name: string;
  min_level: number;
  trigger_name: string;
  item: any;
  image: string;
}
interface Pokemon {
  name: string;
  image: string;
  evolution_chain: EvolutionChain[];
  height: number | null;
  weight: number | null;
}
@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatTabsModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})

export class PokemonDetailsComponent {
  pokemon: Pokemon = {
    name: '',
    image: '',
    height: null,
    weight: null,
    evolution_chain: [],
  };
  private subscription: Subscription = new Subscription();

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.subscription.add(this.route.params.pipe(
      switchMap(params => {
        const name = params['name'];
        this.titleService.setTitle(`${name.toUpperCase()} Details`);
        this.pokemon.name = name;
        return this.pokemonService.getPokemonDetails(name);
      }),
      switchMap(detail => {
        this.pokemon.image = detail.sprites.other.dream_world.front_default;
        this.pokemon.height = detail.height * 10; // Convert decimetres to cm
        this.pokemon.weight = detail.weight / 10; // Convert hectograms to kg
        return this.pokemonService.fetchEvolultionDetails(this.pokemon.name);
      })
    ).subscribe(response => {
      let evoChain: EvolutionChain[] = [];
      let evoData = response.chain;
      do {
        const evoDetails = evoData['evolution_details'][0];
        const species_name = evoData.species.name;

        evoChain.push({
          species_name: species_name,
          min_level: evoDetails ? evoDetails.min_level : null,
          trigger_name: evoDetails ? evoDetails.trigger.name : null,
          item: evoDetails ? evoDetails.item : null,
          image: ''
        });

        evoData = evoData['evolves_to'][0];
      } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

      evoChain.forEach((evo, index) => {
        this.subscription.add(this.pokemonService.getPokemonDetails(evo.species_name).subscribe(detail => {
          evoChain[index].image = detail.sprites.other.dream_world.front_default;
        }));
      });

      this.pokemon.evolution_chain = evoChain;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
