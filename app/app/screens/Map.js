import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import { fetchNearbyPlaces } from '../../services/wheelmap';

// Colors
const WM_COLORS = { yes: 'green', limited: 'orange', no: 'red', unknown: 'gray' };
const USER_COLORS = { up: '#1e90ff', down: '#7e22ce' }; // blue / purple

const API_BASE = "const API_BASE = 'http://172.20.10.6:5050'";
 // 👉 真机改成电脑的局域网 IP

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825, longitude: -122.4324,
    latitudeDelta: 0.01, longitudeDelta: 0.01
  });

  const [wmPlaces, setWmPlaces] = useState([]);            // Wheelmap 官方点
  const [userPlaceRatings, setUserPlaceRatings] = useState([]); // 你们用户对 place 的评分
  const [userRoadRatings, setUserRoadRatings] = useState([]);   // 你们用户对 road 的评分

  const [selectedPlace, setSelectedPlace] = useState(null); // 当前选中的 Wheelmap 点
  const [roadPoint, setRoadPoint] = useState(null);         // 地图长按选择的路面点

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

      // 读取 Wheelmap 附近点（只读）
      try {
        const list = await fetchNearbyPlaces({ lat, lon, radius: 1200 });
        setWmPlaces(list);
      } catch (e) {
        console.warn('Wheelmap fetch failed', e);
      }

      // 读取你们自己的覆盖层（用户评分）
      try {
        const [placeRes, roadRes] = await Promise.all([
          fetch(`${API_BASE}/rate/place`),
          fetch(`${API_BASE}/rate/road`)
        ]);
        setUserPlaceRatings(await placeRes.json());
        setUserRoadRatings(await roadRes.json());
      } catch (e) {
        console.log('No local ratings yet');
      }
    })();
  }, []);

  // 提交“选中 place”的评分
  const rateSelectedPlace = async (score) => {
    if (!selectedPlace) return Alert.alert('Select a place', 'Tap a Wheelmap pin first.');
    try {
      const res = await fetch(`${API_BASE}/rate/place`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: selectedPlace.id,
          name: selectedPlace.name,
          wheelchair: selectedPlace.wheelchair,
          lat: selectedPlace.lat,
          lon: selectedPlace.lon,
          score // +1 👍  /  -1 👎
        })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'failed');
      Alert.alert('Thanks!', `Your ${score > 0 ? '👍' : '👎'} was recorded.`);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  // 提交路面点评分（长按地图先选一个点）
  const rateRoadPoint = async (point, score) => {
    if (!point) return Alert.alert('Pick a road point', 'Long-press the map to drop a road pin first.');
    try {
      const res = await fetch(`${API_BASE}/rate/road`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: point.latitude, lon: point.longitude, score })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'failed');
      Alert.alert('Thanks!', `Road ${score > 0 ? '👍' : '👎'} saved.`);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onLongPress={(e) => setRoadPoint(e.nativeEvent.coordinate)}
      >
        {/* 当前位置 */}
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="Your location"
          accessibilityLabel="Your current position"
          accessibilityHint="Shows where you are on the map"
        />

        {/* Wheelmap 官方层（绿/橙/红/灰） */}
        {showWM && wmPlaces.map(p => (
          <Marker
            key={`wm-${p.id}`}
            coordinate={{ latitude: p.lat, longitude: p.lon }}
            title={p.name}
            description={`wheelchair: ${p.wheelchair || 'unknown'}`}
            pinColor={WM_COLORS[p.wheelchair] || WM_COLORS.unknown}
            onPress={() => setSelectedPlace(p)}
            accessibilityLabel="Wheelmap official place"
            accessibilityHint="Tap to select this place and rate it"
          />
        ))}

        {/* 你们用户：place 覆盖层（蓝=👍，紫=👎） */}
        {showUser && userPlaceRatings.map((r, idx) => (
          <Marker
            key={`ur-${r.placeId}-${idx}`}
            coordinate={{ latitude: r.lat, longitude: r.lon }}
            title={r.name || 'User-rated place'}
            description={r.score > 0 ? 'User 👍' : 'User 👎'}
            pinColor={r.score > 0 ? USER_COLORS.up : USER_COLORS.down}
            accessibilityLabel="User rating overlay"
            accessibilityHint="Community feedback marker"
          />
        ))}

        {/* 你们用户：road 覆盖层（半透明圆） */}
        {showUser && userRoadRatings.map((r, idx) => (
          <Circle
            key={`road-${idx}`}
            center={{ latitude: r.lat, longitude: r.lon }}
            radius={8}
            strokeColor="transparent"
            fillColor={(r.score > 0 ? USER_COLORS.up : USER_COLORS.down) + '55'}
            accessibilityLabel="User road rating"
            accessibilityHint="Crowdsourced surface feedback"
          />
        ))}

        {/* 选中的路面点（预览） */}
        {roadPoint && (
          <Marker
            coordinate={roadPoint}
            title="Selected road point"
            description="Long-pressed point to rate"
          />
        )}
      </MapView>

      {/* 图例 + 开关 + 评分按钮 */}
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

        {/* 仅对“选中的 Wheelmap 点”进行点赞/点踩 */}
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
          <Button
            title={selectedPlace ? `👍 Place: ${selectedPlace.name}` : '👍 Place'}
            onPress={() => rateSelectedPlace(+1)}
            accessibilityLabel="Thumbs up for the selected place"
            accessibilityHint="Adds a positive user rating overlay separate from Wheelmap"
          />
          <Button
            title={'👎 Place'}
            onPress={() => rateSelectedPlace(-1)}
            accessibilityLabel="Thumbs down for the selected place"
            accessibilityHint="Adds a negative user rating overlay separate from Wheelmap"
          />
        </View>

        {/* 路面点评分：先长按地图选择一个点 */}
        <View style={{ flexDirection: 'row', marginTop: 6, gap: 6 }}>
          <Button
            title="👍 Road"
            onPress={() => rateRoadPoint(roadPoint, +1)}
            accessibilityLabel="Thumbs up for selected road point"
            accessibilityHint="Marks the long-pressed road point as accessible"
          />
          <Button
            title="👎 Road"
            onPress={() => rateRoadPoint(roadPoint, -1)}
            accessibilityLabel="Thumbs down for selected road point"
            accessibilityHint="Marks the long-pressed road point as not accessible"
          />
        </View>
      </View>
    </View>
  );
}
