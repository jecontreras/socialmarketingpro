import { Component, OnInit } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  dataConfig:any = {};
  constructor(
    private _config: ConfigKeysService,
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
  }

}
