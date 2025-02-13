import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selection-departament',
  templateUrl: './selection-departament.component.html',
  styleUrls: ['./selection-departament.component.scss']
})
export class SelectionDepartamentComponent implements OnInit {
  filtro: string = '';
  constructor(
    public dialogRef: MatDialogRef<SelectionDepartamentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  seleccionar(depto: string) {
    this.dialogRef.close(depto);
  }
  departamentosFiltrados() {
    return this.data.departamentos.filter(depto =>
      depto.name.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  ngOnInit(): void {
  }

}
