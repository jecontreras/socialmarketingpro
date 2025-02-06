import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BusinessHoursService } from 'src/app/servicesComponent/business-hours.service';
import { MatDialogRef } from '@angular/material/dialog';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { USERT } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-open-config-time',
  templateUrl: './open-config-time.component.html',
  styleUrls: ['./open-config-time.component.scss']
})
export class OpenConfigTimeComponent implements OnInit {

  days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  form!: FormGroup;
  btnDisabled = false;
  dataConfig:any = {};
  dataUser:USERT = {};

  constructor(
    private fb: FormBuilder,
    private _bussinesHours: BusinessHoursService,
    private dialogRef: MatDialogRef<OpenConfigTimeComponent>,
    private _store: Store<STORAGES>,
    private _config: ConfigKeysService,
  ) {
    this.dataConfig = this._config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      days: this.fb.array([]) // Inicialmente vacío, lo llenaremos con los datos de la API
    });

    this.days.forEach(day => {
      (this.form.get('days') as FormArray).push(this.createDayForm(day));
    });

    this.loadBusinessHours();
  }

  createDayForm(day: string): FormGroup {
    return this.fb.group({
      dayOfWeek: [day],
      isOpen: [true],
      timeSlots: this.fb.array([]),
      user: this.dataUser.id,
      company: this.dataUser.empresa
    });
  }

  getTimeSlots(index: number): FormArray {
    return (this.form.get('days') as FormArray).at(index).get('timeSlots') as FormArray;
  }

  addTimeSlot(index: number): void {
    this.getTimeSlots(index).push(this.fb.group({ start: '', end: '' }));
  }

  removeTimeSlot(index: number, slotIndex: number): void {
    this.getTimeSlots(index).removeAt(slotIndex);
  }

  saveHours(): void {
    this.btnDisabled = true;
    this._bussinesHours.setHours( this.form.value ).subscribe(response => {
      alert('Horario guardado');
    });
    this.btnDisabled = false;
  }

  loadBusinessHours(): void {
    this._bussinesHours.getHours({ user: this.dataUser.id, company: this.dataUser.empresa }).subscribe((data: any) => {
      const daysFormArray = this.form.get('days') as FormArray;
      
      // Limpiar y poblar el FormArray con los datos recibidos
      daysFormArray.clear(); // Limpia el array antes de agregar los nuevos datos

      data.forEach((item) => {
        daysFormArray.push(this.createDayFormGroup(item));
      });

      console.log("***85", this.form.value);
    });
  }
  createDayFormGroup(item: any): FormGroup {
    return this.fb.group({
      dayOfWeek: [item.dayOfWeek || ''],
      isOpen: [item.isOpen || false],
      timeSlots: this.fb.array(
        item.timeSlots ? item.timeSlots.map(slot => this.createTimeSlotFormGroup(slot)) : []
      )
    });
  }
  
  createTimeSlotFormGroup(slot: any): FormGroup {
    return this.fb.group({
      start: [slot.start || ''],
      end: [slot.end || '']
    });
  }

}