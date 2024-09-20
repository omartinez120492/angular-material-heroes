import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {
  //! Se debe importar, ReactiveFormsModule, en el módulo de heroes, sección imports
  public searchInput = new FormControl('')

  public heroes:Hero[] = []
  public selectedHero:Hero | undefined;

  constructor(private heroService: HeroesService){}

  searchHero(){
    const valueInput:string = this.searchInput.value || '';
    this.heroService.getSuggestions(valueInput)
    .subscribe( heroes => this.heroes = heroes )
  }

  //! para que no se muestre [object, object] en el input
  onSelectedOption(event: MatAutocompleteSelectedEvent):void{
    if(!event.option.value){
      this.selectedHero = undefined
      return
    }
    const hero:Hero = event.option.value
    this.searchInput.setValue(hero.superhero)
    this.selectedHero = hero
  }
}
