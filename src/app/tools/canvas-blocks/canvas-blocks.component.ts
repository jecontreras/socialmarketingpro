import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Konva from 'konva';

@Component({
  selector: 'app-canvas-blocks',
  templateUrl: './canvas-blocks.component.html',
  styleUrls: ['./canvas-blocks.component.scss']
})
export class CanvasBlocksComponent implements OnInit,AfterViewInit {

  @ViewChild('container') container!: ElementRef;

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.processConfigKonva()
  }

  processConfigKonva(){

    const stage = new Konva.Stage({
      container: this.container.nativeElement,
      width: 800,
      height: 600
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Crear un grupo para el bloque y el marco HTML
    const group = new Konva.Group({
      x: 50,
      y: 50,
      draggable: true
    });
    layer.add(group);

    // Crear el rectángulo Konva
    const rect = new Konva.Rect({
      width: 100,
      height: 50,
      fill: 'blue',
    });
    group.add(rect);

    // Crear el marco HTML
    const frame = document.createElement('div');
    frame.style.width = '100px';
    frame.style.height = '50px';
    frame.style.border = '2px solid black';
    frame.style.position = 'absolute';
    frame.style.top = '50px';
    frame.style.left = '50px';
    frame.innerHTML = 'Contenido del marco';
    this.container.nativeElement.appendChild(frame);

    stage.draw();
  }
}
