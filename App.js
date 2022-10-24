import {Button, StyleSheet, Text, View, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const App = () => {
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  async function getPermission() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }

  useEffect(() => {
    getPermission().then(() => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      </MapView>
      <GooglePlacesAutocomplete
        placeholder="Search Places.."
        query={{
          key: 'AIzaSyDRKyUzBNnGeLdKXfL0xZmkHmQueJs5z5A',
          language: 'en',
        }}
        textInputProps={{
          placeholderTextColor: 'gray',
          returnKeyType: 'search',
        }}
        fetchDetails={true}
        GooglePlacesDetailsQuery={{
          fields: 'geometry',
        }}
        onPress={(data, details = null) => {
          setLocation({
            latitude: details?.geometry?.location?.lat,
            longitude: details?.geometry?.location?.lng,
          });
        }}
        styles={{
          container: {
            width: '100%',
            padding: 4,
          },
          textInput: {
            color: 'black',
          },
          predefinedPlacesDescription: {
            color: 'red',
          },
        }}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },
});
