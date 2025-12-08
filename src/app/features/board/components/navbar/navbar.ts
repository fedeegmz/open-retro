import { Component, inject } from '@angular/core';
import { RoomService } from '@core/services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'board-navbar',
  imports: [],
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);
  private roomService = inject(RoomService);

  roomName = this.roomService.currentRoomName;

  exit(): void {
    this.router.navigate(['']);
  }
}
