import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, Divider } from 'react-native-elements'
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center'
  },
  distance: {
    margin: 5,
    color: 'gray',
    flexGrow:1
  },
  containerInfo: {
    flexDirection: 'column',
    paddingLeft: 10,
    flexGrow: 1
  },
  user: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#717171'
  }
})

const ListItem = React.memo(({ item }) => {

  const formatUrl = (url) => {
    if (url) {
      const index = url.split("").indexOf("?")
      const newUrl = url.slice(0,index)
      return newUrl
    }else {
      return 'http://dummyimage.com/232x126.bmp'
    }
  }
  return (
      <>
        <View style={styles.container}>
          <View>
            <Avatar
                size='medium'
                rounded
                source={{uri: formatUrl(item.logo)}}
            />
          </View>
          <Text style={styles.distance}>{item.name}</Text>
          <Text>{item.note}</Text>
        </View>
        <View style={{padding:20}}>
          <Text>{item.description}</Text>
        </View>
        <Divider style={{ backgroundColor: '#717171' }} />
      </>
  )
})

ListItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ListItem
