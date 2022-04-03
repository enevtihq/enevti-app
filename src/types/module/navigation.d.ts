import { RootStackParamList } from 'enevti-app/navigation';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
