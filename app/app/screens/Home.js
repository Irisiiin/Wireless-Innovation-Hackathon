import { View, Text, Button, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {
  const goSOS = () => navigation.navigate('SOS');
  const goCare = () => navigation.navigate('CarePlan');
  const goMap = () => navigation.navigate('Map');

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '600' }}>
        Today
      </Text>

      <TouchableOpacity
        accessible
        accessibilityRole="button"
        accessibilityLabel="Open SOS"
        accessibilityHint="Send a quick help request"
        onPress={goSOS}
        style={{ padding: 16, backgroundColor: '#222', borderRadius: 12 }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>SOS</Text>
      </TouchableOpacity>

      <Button title="Care Plan" onPress={goCare} />
      <Button title="Map" onPress={goMap} />
    </View>
  );
}
