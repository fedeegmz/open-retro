import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/lobby/lobby.component'),
    },
    {
        path: '**',
        redirectTo: ''
    }
];
