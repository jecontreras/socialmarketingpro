import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { CompanyServiceService } from 'src/app/servicesComponent/company-service.service';
import { USER } from 'src/app/interfaces/user';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  dataConfig:any = {};
  dataUser: USERT;
  listData:any = {};

  constructor(
    private _config: ConfigKeysService,
    private _emprasa: CompanyServiceService,
    private _store: Store<USER>,
  ){
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  async ngOnInit() {
    this.listData= await this.getStatis()
    console.log("***R", this.listData );
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    /*var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });*/

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: this.listData.dataBuyMes
		});

    var chartSales1 = document.getElementById('chart-sales1');

    this.salesChart = new Chart(chartSales1, {
			type: 'line',
			options: chartExample1.options,
			data: this.listData.dataPerformanceMes
		});
  }

  async getStatis(){
    return new Promise( resolve =>{
      this._emprasa.getStatisCompany( { where:{ user: this.dataUser.id } } ).subscribe(res =>{
        resolve( res.dataEnd );
      });
    })
  }


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
