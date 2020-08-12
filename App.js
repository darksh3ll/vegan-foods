import React, { useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity, ActivityIndicator,Alert } from 'react-native'
import axios from 'axios'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import ListItem from "./ListItem";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mapStyle: {
    width: '100%',
    height: Dimensions.get('window').height / 2

  }
})

const Home = () => {
  const [foods, setFoods] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [location, setLocation] = useState(null)
  const [geocode, setGeocode] = useState(null)


  const getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation })
    const { latitude, longitude, speed } = location.coords
    await getGeocodeAsync({ latitude, longitude, speed })
    await setLocation({ location: { latitude, longitude, speed } })
  }

  const getGeocodeAsync = async (location) => {
    const geocode = await Location.reverseGeocodeAsync(location)
    setGeocode(geocode)
  }

console.log(foods);
  const getApi = async () => {
    setRefresh(true)
    axios.get(`https://xlmd94l53b.execute-api.eu-west-2.amazonaws.com/api?lat=${location.location.latitude}&long=${location.location.longitude}`, {
    })
        .then(response => {
          setRefresh(false)
          setFoods(response.data.restaurants)

        }).catch((err) => {
      setRefresh(false)
      Alert.alert(
          "🚫",
          "Une défaillance est survenue lors de l'initialisation des services.",
          [
            { text: "Réessayer", onPress: () => getApi() }
          ],
          { cancelable: false }
      );
    })
  }


useEffect(() => {
  location&&getApi()
},[location])

  useEffect(() => {
    getLocationAsync()
  }, [])


  return (
      <View style={styles.container}>
        {
          location
              ? <MapView
                  initialRegion={{
                    latitude: location.location.latitude,
                    longitude: location.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                  showsUserLocation
                  style={styles.mapStyle}
              >
                {
                  foods.length > 0 && foods.map((item) => {
                    return (
                        <Marker
                            coordinate={{ latitude: item.lat, longitude:item.long }}
                            key={item.id}
                            pinColor='#800080'
                            title={item.name}
                        >
                        </Marker>
                    )
                  })
                }

              </MapView>
              : <ActivityIndicator style={styles.mapStyle} size='large' color='#717171' />
        }

        <FlatList
            refreshing={refresh}
            onRefresh={getApi}
            data={[...foods]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <ListItem item={item}/>
            )}
        />
      </View>
  )
}

export default Home
