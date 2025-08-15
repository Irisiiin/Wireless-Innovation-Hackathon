import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';

function Home({ navigation }) {
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Today</Text>
      <Button title="Map (placeholder)" onPress={() => {}} />
    </View>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
