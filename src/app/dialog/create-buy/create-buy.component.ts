import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-buy',
  templateUrl: './create-buy.component.html',
  styleUrls: ['./create-buy.component.scss']
})
export class CreateBuyComponent implements OnInit {
  ventaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateBuyComponent>
  ) {
    // Definir formulario con validaciones
    this.ventaForm = this.fb.group({
      nombre: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      direccion: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      producto: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit(): void {

  }

  // Método para guardar los datos
  guardarVenta() {
    if (this.ventaForm.valid) {
      this.dialogRef.close(this.ventaForm.value); // Cierra el modal y envía los datos
    }
  }

  // Método para cerrar el formulario sin guardar
  cerrar() {
    this.dialogRef.close();
  }
}
