import type { IHashService } from "../../domain/services/IHashService";

export class BunHashService implements IHashService {
  hash(value: string): string {
    return Bun.hash(value).toString();
  }

  verify(value: string, hash: string): boolean {
    return this.hash(value) === hash;
  }
}
