import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class RoomService {
    currentRoomId = signal<string | null>(null);
    currentRoomName = signal('');

    createRoom(name: string): string {
        const roomId = crypto.randomUUID();
        console.log(`Create room "${name}" with id: ${roomId}`);

        this.setRoomId(roomId);
        this.setRoomName(name);

        return roomId;
    }

    private setRoomId(id: string): void {
        this.currentRoomId.set(id);
    }

    private setRoomName(name: string): void {
        this.currentRoomName.set(name);
    }
}
