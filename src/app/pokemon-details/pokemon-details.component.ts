import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const name = params['name'];
      console.log('name',name)
      this.pokemonService.getPokemonDetails(name).subscribe((detail: any) => {
  
        this.pokemon["image"] = detail.sprites.other.dream_world.front_default;
        this.pokemon["height"] = detail.height;
        this.pokemon["weight"] = detail.weight;
        console.log('name: ', name,this.pokemon)
        this.getEvolutionDetails(name);
      });
    });
  }

  public getEvolutionDetails(name: string) {
    this.pokemonService.fetchEvolultionDetails(name).subscribe((response) => {
      console.log('getEvolutionDetails: ', response);
      let evoData = response.chain;
      let evoChain: EvolutionChain[] = [];
      do {
        let evoDetails = evoData['evolution_details'][0];
        
        evoChain.push({
          species_name: evoData.species.name,
          min_level: !evoDetails ? 1 : evoDetails.min_level,
          trigger_name: !evoDetails ? null : evoDetails.trigger.name,
          item: !evoDetails ? null : evoDetails.item,
          image: ''
        });

        evoData = evoData['evolves_to'][0];
      } while (!!evoData && evoData.hasOwnProperty('evolves_to'));
      this.pokemon.evolution_chain= [...evoChain];
      this.pokemon.evolution_chain.forEach((evoData)=> {
        this.pokemonService.getPokemonDetails(evoData.species_name).subscribe((detail)=> {
          evoData.image = detail.sprites.other.dream_world.front_default;
          console.log('evoData',evoData)
        })
      })
    })
  }
}
