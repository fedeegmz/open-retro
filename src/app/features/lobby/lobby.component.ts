import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { FormCard } from "./components/form-card/form-card";

@Component({
  selector: 'app-lobby',
  imports: [
    HeaderComponent,
    FormCard
  ],
  templateUrl: './lobby.component.html',
})
export default class LobbyComponent { }
