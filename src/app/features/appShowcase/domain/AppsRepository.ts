import type { AppItem } from './AppItem';

export interface AppsRepository {
  getPromotedApps(): Promise<AppItem[]>;
}
