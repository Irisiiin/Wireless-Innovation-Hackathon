import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import { fetchNearbyPlaces } from '../services/wheelmap';

// Colors
const WM_COLORS = { yes: 'green', limited: 'orange', no: 'red', unknown: 'gray' };
const USER_COLORS = { up: '#1e90ff', down: '#7e22ce' }; // blue / purple

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825, longitude: -122.4324,
    latitudeDelta: 0.01, longitudeDelta: 0.01
  });
  const [wmPlaces, setWmPlaces] = useState([]);      // Wheelmap official POIs
  const [userPlaceRatings, setUserPlaceRatings] = useState([]); // your users' place ratings
  const [userRoadRatings, setUserRoadRatings] = useState([]);   // your users' road ratings

  const [showWM, setShowWM] = useState(true);
  const [showUser, setShowUser] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = region.latitude, lon = region.longitude;
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude; lon = pos.coords.longitude;
        setRegion(r => ({ ...r, latitude: lat, longitude: lon }));
      }
      // Wheelmap (read-only)
      try {
        const list = await fetchNearbyPlaces({ lat, lon, radius: 1200 });
        setWmPlaces(list);
      } catch (e) {
        console.warn('Wheelmap fetch failed', e);
      }
      // Your overlay (optional)
      try {
        const [placeRes, roadRes] = await Promise.all([
          fetch('http://localhost:4000/rate/place'),
          fetch('http://localhost:4000/rate/road')
        ]);
        setUserPlaceRatings(await placeRes.json());
        setUserRoadRatings(await roadRes.json());
      } catch (e) {
        // 后端没开也没关系
        console.log('No local ratings yet');
      }
    })();
  }, []);

  const thumbsUp = () => Alert.alert('Marked', 'Thumbs up recorded 👍');
  const thumbsDown = () => Alert.alert('Marked', 'Thumbs down recorded 👎');

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={region}>
        {/* current position */}
       <Marker
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
        accessibilityLabel="Wheelchair-friendly place from Wheelmap"
        accessibilityHint="Official data marker"
        />


        {/* Wheelmap layer */}
        {showWM && wmPlaces.map(p => (
          <Marker
            key={`wm-${p.id}`}
            coordinate={{ latitude: p.lat, longitude: p.lon }}
            title={p.name}
            description={`wheelchair: ${p.wheelchair || 'unknown'}`}
            pinColor={WM_COLORS[p.wheelchair] || WM_COLORS.unknown}
          />
        ))}

        {/* Your users: place ratings overlay (blue=up, purple=down) */}
        {showUser && userPlaceRatings.map((r, idx) => (
          <Marker
            key={`ur-${r.placeId}-${idx}`}
            coordinate={{ latitude: r.lat, longitude: r.lon }}
            title={r.name || 'User-rated place'}
            description={r.score > 0 ? 'User 👍' : 'User 👎'}
            pinColor={r.score > 0 ? USER_COLORS.up : USER_COLORS.down}
          />
        ))}

        {/* Your users: road ratings overlay (circles) */}
        {showUser && userRoadRatings.map((r, idx) => (
          <Circle
            key={`road-${idx}`}
            center={{ latitude: r.lat, longitude: r.lon }}
            radius={8}  // ~8m circle
            strokeColor="transparent"
            fillColor={(r.score > 0 ? USER_COLORS.up : USER_COLORS.down) + '55'} // 33% alpha
          />
        ))}
      </MapView>

      {/* simple legend & toggles */}
      <View style={{ position: 'absolute', top: 16, left: 16, padding: 10, backgroundColor: '#fff', borderRadius: 8 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>Legend</Text>
        <Text>WM yes: green</Text>
        <Text>WM limited: orange</Text>
        <Text>WM no: red</Text>
        <Text>WM unknown: gray</Text>
        <Text>User place 👍: blue</Text>
        <Text>User place 👎: purple</Text>
        <Text>User road: blue/purple circles</Text>
        <View style={{ flexDirection: 'row', marginTop: 6, gap: 6 }}>
          <Button title={showWM ? 'Hide WM' : 'Show WM'} onPress={() => setShowWM(v => !v)} />
          <Button title={showUser ? 'Hide User' : 'Show User'} onPress={() => setShowUser(v => !v)} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
        <Button
            title="👍"
            onPress={thumbsUp}
            accessibilityLabel="Thumbs up for this location"
            accessibilityHint="Adds a positive user rating overlay separate from Wheelmap"
        />
        <Button
            title="👎"
            onPress={thumbsDown}
            accessibilityLabel="Thumbs down for this location"
            accessibilityHint="Adds a negative user rating overlay separate from Wheelmap"
        />
        </View>

      </View>
    </View>
  );
}
