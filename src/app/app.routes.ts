import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/lobby/lobby.component'),
    },
    {
        path: 'board/:roomId',
        loadComponent: () => import('./features/board/board.component'),
    },
    {
        path: '**',
        redirectTo: ''
    }
];
