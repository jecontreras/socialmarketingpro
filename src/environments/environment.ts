// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: "http://localhost:1337",
  urlFile: "https://apilokomproaqui3-8479ed1ed46c.herokuapp.com",
  //url: "https://1337-jecontreras-socialmarke-gi0k7bqhhip.ws-us117.gitpod.io",
  //url: "https://socialmarketingapi2-12ab86fb3d47.herokuapp.com",
  //urlFile: "https://apilokomproaqui1-9219656b6da1.herokuapp.com"
  //url: "https://1337-jecontreras-socialmarke-r9pote9hj0o.ws-us116.gitpod.io"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 *
 * @echo off
title Iniciando Sails.js y XAMPP...

echo 🔹 Iniciando XAMPP...
cd /d "C:\xampp"
start xampp-control.exe

timeout /t 5 /nobreak >nul

echo 🔹 Iniciando MySQL y Apache...
start "" "C:\xampp\xampp_start.exe"

timeout /t 5 /nobreak >nul

echo 🔹 Iniciando Sails.js...
cd /d "C:\ruta\de\tu\proyecto\sails"
start cmd /k "node app.js"

echo ✅ Servidores iniciados correctamente.
exit


 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
