import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  constructor(private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    //? Para mostrar un mensaje de éxito o error
    private snackBar: MatSnackBar,
    //? Para mostrar un mensaje de confirmación
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    //? Si en la URL no incluye 'edit', se retorna
    if (!this.router.url.includes('edit')) return;

    //? Si en la URL incluye 'edit', se obtiene el héroe por su ID
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.heroService.getHeroById(id))
    ).subscribe(hero => {
      if (!hero) return this.router.navigateByUrl('/heroes/list');
      //? Si el héroe existe, se resetea el formulario con los datos del héroe
      this.heroForm.reset(hero);
      return;
    })
  }

  //? Formulario reactivo para la creación y edición de héroes
  public heroForm = new FormGroup({
    id: new FormControl<string>('', { nonNullable: true }),
    superhero: new FormControl<string>('', { nonNullable: true }),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alt_img: new FormControl<string>(''),
  });

  //? Lista de editores disponibles para el héroe
  public publishers = [
    { id: 'DC Comics', desc: 'DC Comics' },
    { id: 'Marvel Comics', desc: 'Marvel Comics' },
  ]


  //? Método para obtener el título del héroe
  get currentHero(): Hero {
    return this.heroForm.value as Hero;
  }

  //? Método para guardar un nuevo héroe
  onSubmit(): void {
    //? Si el formulario es inválido, se retorna
    if (this.heroForm.invalid) {
      return;
    }


    //? Si el héroe tiene un ID, se actualiza, si no, se crea
    if (this.currentHero.id) {
      this.heroService.updateHero(this.currentHero)
        .subscribe(hero => {
          //! mostrar mensaje de éxito
          this.showSnackBar(` ${this.currentHero.superhero} actualizado correctamente`);
          this.router.navigateByUrl('/heroes/list');
        })
      return;
    }

    //? Si no tiene ID, se crea
    this.heroService.addHero(this.currentHero)
      .subscribe(hero => {
        //! mostrar mensaje de éxito
        this.showSnackBar(` ${this.currentHero.superhero} creado correctamente`);
        this.router.navigateByUrl('/heroes/list');
      })
  }

  onDeleteHero(): void {

    if (!this.currentHero.id) throw Error('Héroe no existe');

    //? ConfirmDialogComponent es un componente que se encarga de mostrar un mensaje de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted),
        tap(() => {
          this.showSnackBar(` ${this.currentHero.superhero} eliminado correctamente`);
        }),
        tap(() => {
          this.router.navigateByUrl('/heroes/list');
        })
      )
      .subscribe();
  }

  //? Método para mostrar un mensaje de éxito o error
  showSnackBar(message: string): void {
    this.snackBar.open(message, 'ok!', {
      duration: 2500,
    })
  }

}


