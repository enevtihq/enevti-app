import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateAccount from '../screen/CreateAccount';
import { useColorScheme } from 'react-native';
import { getTheme } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigationContainer() {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer theme={getTheme(colorScheme!.toString())}>
      <Stack.Navigator>
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
