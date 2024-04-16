import { Component, Inject, OnInit } from '@angular/core';
import { MovementItemComponent } from '../movement-item/movement-item.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-qr',
  templateUrl: './open-qr.component.html',
  styleUrls: ['./open-qr.component.scss']
})
export class OpenQrComponent implements OnInit {
  data = {
    qr: ""
  }
  constructor(
    public dialogRef: MatDialogRef<MovementItemComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
  ) {
    this.data.qr = this.datas.qr;
  }

  ngOnInit(): void {
  }

}
