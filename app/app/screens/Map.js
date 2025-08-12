import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View, Button, Alert } from 'react-native';

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825, longitude: -122.4324,
    latitudeDelta: 0.01, longitudeDelta: 0.01
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        setRegion(r => ({
          ...r,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }));
      }
    })();
  }, []);

  const thumbsUp = () => Alert.alert('Thanks!', 'Marked as accessible 👍');
  const thumbsDown = () => Alert.alert('Thanks!', 'Marked as not accessible 👎');

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
      <View style={{ position: 'absolute', bottom: 24, left: 24, right: 24, flexDirection: 'row', gap: 12 }}>
        <Button title="👍" onPress={thumbsUp} />
        <Button title="👎" onPress={thumbsDown} />
      </View>
    </View>
  );
}
