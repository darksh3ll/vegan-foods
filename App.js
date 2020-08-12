import React, { useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {StyleSheet, View, Dimensions, FlatList, ActivityIndicator, Text, Button} from 'react-native'
import axios from 'axios'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import ListItem from "./ListItem";
import OverlayModal from "./components/OverlayModal";
import LottieView from "lottie-react-native";
import animationErrorApi from './assets/error-api.json'
import useToogle from "./hooks/useToogle";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mapStyle: {
    width: '100%',
    height: Dimensions.get('window').height / 2
  },
  animation:{
    height: 300,
    width: 300
  },
  wrapperAnimation:{
    padding:10,
    justifyContent:'center',
    alignItems:'center'
  }
})


const Home = () => {
  const [foods, setFoods] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [location, setLocation] = useState(null)
  const [modalActive, setModalActive] = useToogle()

  const getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
    alert('Activer et désactiver le service de localisation pour certaines apps')
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation })
    const { latitude, longitude, speed } = location.coords
    await setLocation({ location: { latitude, longitude, speed } })
  }

const URL_API = `https://xlmd94l53b.execute-api.eu-west-2.amazonaws.com/api?lat=${location.location.latitude}&long=${location.location.longitude}`

  const getApi = async () => {
    setRefresh(true)
    axios.get(URL_API, {
    })
        .then(response => {
          setRefresh(false)
          setFoods(response.data.restaurants)

        }).catch((err) => {
      setRefresh(false)
      setModalActive(true)
    })
  }


useEffect(() => {
  location&&getApi()
},[location])

  useEffect(() => {
    getLocationAsync()
  }, [])

  const refreshApi = () => {
    setModalActive(false)
    getApi()
  }


  return (
      <View style={styles.container}>

        <OverlayModal closeModal={refreshApi} isActive={modalActive}>
          <View style={styles.wrapperAnimation}>
            <LottieView style={styles.animation} source={animationErrorApi} autoPlay loop />
            <Text>Une erreur de serveur s'est produite. Réessayez ou annulez l'opération afin de revenir à l'écran précedent</Text>
            <Button title="Réessayer" onPress={refreshApi}/>
          </View>
        </OverlayModal>

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
            renderItem={({ item }) => (<ListItem item={item}/>)}
        />
      </View>
  )
}

export default Home
