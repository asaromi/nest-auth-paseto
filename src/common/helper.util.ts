import { Injectable } from '@nestjs/common';
import { monotonicFactory } from 'ulidx';

@Injectable()
export class HelperUtil {
  static generateId(epochTime?: number): string {
    const id = monotonicFactory();
    return id(epochTime ?? Date.now())
      .toString()
      .toLocaleLowerCase();
  }
}
