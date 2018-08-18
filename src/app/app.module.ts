import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import { HttpClientModule} from '@angular/common/http';

const appRoutes: Routes = [
  { path: 'Map', component: MapComponent },
  {  path: '', component: MapComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    ),
    AgmCoreModule.forRoot({
      apiKey: "insert you api key here",
      libraries: ["places"]
    }),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
