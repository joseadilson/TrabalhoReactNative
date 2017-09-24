import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView
} from 'react-native';
import axios from 'axios';

const KEY_GOOGLE_PLACES = "AIzaSyD_EXznjY6XC7ZJsvafTDr8HRtHqOnBhJg";
const KEY_MAP = "AIzaSyDWiMznEr_HbaKwfBV6aOSD7gRD4AX4PsE";

class DetailsItems extends Component {
  static navigationOptions = { title:"Detalhes" }
  state = {
    imgFoto: "",
    descNome: "",
    descEnde: "",
    number: "",
    referenceFoto: "",
    mapaStatico: null,
    longitude: null,
    latitude: null
  }
  render() {
    return (
      <View>

        {this.renderTop()}

      </View>
    );
  }

  renderTop = () => {
    const { params } = this.props.navigation.state
    let imgFoto = null
    let descNome = null
    let descEnde = null
    let number = null
    let referenceFoto = null


    axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + params.place + '&key=' + KEY_GOOGLE_PLACES)
      .then((response) => {
        list = response.data.result
      })
      .catch((err) => {
        alert(JSON.stringify(err))
      })
      .finally(() => {
        this.setState({
          descNome: list.name,
          descEnde: list.formatted_address,
          number: list.formatted_phone_number,
          referenceFoto: list.photos[0].photo_reference,
          longitude: list.geometry.location.lng,
          latitude: list.geometry.location.lat
        })
      })

      

    return (
      <ScrollView>
        <View>
          <Image style={styles.fotoLocal} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + params.reference + '&key=' + KEY_GOOGLE_PLACES }} />
        </View>
        <Text style={styles.txtDescNome}>{this.state.descNome}</Text>
        <Text style={styles.txtDescEnd}>{this.state.descEnde}</Text>
        <Text style={styles.txtNumber}>{this.state.number}</Text>
        <View>
          <Image style={styles.fotoLocal} source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?markers=' + this.state.latitude + ',' + this.state.longitude + '&zoom=16&size=400x200&key=' + KEY_MAP }} />
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  fotoLocal: {
    width: 400,
    height: 200,
  }, txtDescNome: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    margin: 6
  }, txtDescEnd: {
    fontSize: 16,
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 6
  },
  txtNumber: {
    fontSize: 16,
    color: '#000',
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 6
  }
});
export default DetailsItems;

