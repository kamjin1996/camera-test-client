import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {SnapshotComponent} from './snapshot/snapshot.component';
import {SocketUtil} from "./snapshot/socket-util";

@NgModule({
  declarations: [
    AppComponent,
    SnapshotComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [{
    provide: APP_INITIALIZER, useClass: SocketUtil
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
