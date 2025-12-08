import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '@core/services/room.service';

@Component({
  selector: 'lobby-form-card',
  imports: [],
  templateUrl: './form-card.html',
})
export class FormCard {
  private router = inject(Router);
  private roomService = inject(RoomService);

  readonly tabs = ['Crear sala', 'Unirse a sala'];
  activeTab = signal(0);
  userName = signal('');
  roomName = signal('');
  roomCode = signal('');

  setActiveTab(index: number): void {
    if (index == this.activeTab()) return;

    this.activeTab.set(index);
    if (index == 0) {
      this.setRoomCode('');
    } else if (index == 1) {
      this.setRoomName('');
    }
  }

  setUserName(value: string): void {
    this.userName.set(value);
  }

  setRoomName(value: string): void {
    this.roomName.set(value);
  }

  setRoomCode(value: string): void {
    this.roomCode.set(value);
  }

  canCreate(): boolean {
    return this.userName().trim().length >= 2 && this.roomName().trim().length >= 2;
  }

  canJoin(): boolean {
    return this.userName().trim().length >= 2 && this.roomCode().trim().length === 6;
  }

  createRoom(): void {
    if (!this.canCreate()) return;

    const roomId = this.roomService.createRoom(this.roomName());

    console.log(`${this.userName()} creating room: ${this.roomName()} (${roomId})`);

    this.router.navigate(['/board', roomId]);
  }

  joinRoom(): void {
    if (!this.canJoin()) return;

    console.log(`${this.userName()} joining room: ${this.roomCode()}`);

    this.router.navigate(['/board', this.roomCode().trim().toUpperCase()]);
  }
}
