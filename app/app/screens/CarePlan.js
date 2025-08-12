import * as Notifications from 'expo-notifications';
import { View, Button, Text, Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false
  })
});

export default function CarePlan() {
  const schedule = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission required');
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Care reminder', body: 'Time to check skin/urination.' },
      trigger: { seconds: 4 * 60 * 60, repeats: true } // every 4 hours
    });
    Alert.alert('Scheduled', 'Every 4 hours');
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>Schedule 4-hour care reminders</Text>
      <Button title="Start reminders" onPress={schedule} />
    </View>
  );
}
