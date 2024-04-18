import { Component, OnInit } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  dataConfig:any = {};
  constructor(
    private _config: ConfigKeysService,
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
  }

}
