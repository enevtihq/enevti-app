import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDebouncedCallback } from 'use-debounce';

export type AppNavigationType = StackNavigationProp<RootStackParamList>['push'];

export default function useDebouncedNavigation(navigation: StackNavigationProp<RootStackParamList>) {
  const dnavigation: AppNavigationType = useDebouncedCallback(
    (screen, params) => {
      navigation.push(screen, params);
    },
    750,
    { leading: true, trailing: false },
  );
  return dnavigation;
}
