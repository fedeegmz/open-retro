import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { FormCard } from "./components/form-card/form-card";

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    HeaderComponent,
    FormCard
  ],
  templateUrl: './lobby.component.html',
})
export default class LobbyComponent {
  // userName = '';
  // roomName = '';
  // roomCode = '';
  // activeTab = signal(0);

  // constructor(
  //   private yjsService: YjsService,
  //   private router: Router
  // ) { }

  // canCreate(): boolean {
  //   return this.userName.trim().length >= 2 && this.roomName.trim().length >= 2;
  // }

  // canJoin(): boolean {
  //   return this.userName.trim().length >= 2 && this.roomCode.trim().length === 6;
  // }

  // createRoom(): void {
  //   if (!this.canCreate()) return;

  //   const roomId = this.yjsService.createRoom(
  //     this.userName.trim(),
  //     this.roomName.trim()
  //   );

  //   this.router.navigate(['/board', roomId]);
  // }

  // joinRoom(): void {
  //   if (!this.canJoin()) return;

  //   this.yjsService.joinRoom(
  //     this.roomCode.trim().toUpperCase(),
  //     this.userName.trim()
  //   );

  //   this.router.navigate(['/board', this.roomCode.trim().toUpperCase()]);
  // }
}

