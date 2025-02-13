import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selection-ciudad',
  templateUrl: './selection-ciudad.component.html',
  styleUrls: ['./selection-ciudad.component.scss']
})
export class SelectionCiudadComponent implements OnInit {
  filtro: string = '';
  constructor(
    public dialogRef: MatDialogRef<SelectionCiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  seleccionar(city: string) {
    this.dialogRef.close(city);
  }

  ciudadesFiltradas() {
    return this.data.ciudades.filter(city =>
      city.name.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  ngOnInit(): void {
  }

}
