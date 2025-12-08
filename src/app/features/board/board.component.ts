import { Component } from '@angular/core';
import { Navbar } from "./components/navbar/navbar";

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [Navbar],
    templateUrl: './board.component.html',
})
export default class BoardComponent { }
