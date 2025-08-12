import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import CarePlan from './screens/CarePlan';
import SOS from './screens/SOS';
import MapScreen from './screens/Map';
import Community from './screens/Community';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CarePlan" component={CarePlan} />
        <Stack.Screen name="SOS" component={SOS} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Community" component={Community} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
