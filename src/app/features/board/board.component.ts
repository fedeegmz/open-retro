import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [],
    templateUrl: './board.component.html',
})
export default class BoardComponent {
    private router = inject(Router);
    roomId = '';

    exit(): void {
        this.router.navigate(['']);
    }
}
