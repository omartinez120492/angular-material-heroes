import { HeroesService } from './../../services/heroes.service';
import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public heroes: Hero[] = [];

  constructor(private heroesServive: HeroesService) { }

  ngOnInit(): void {
    this.heroesServive.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }


}
