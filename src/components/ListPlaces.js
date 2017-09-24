import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  Geolocation,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

const KEY_GOOGLE_PLACES = "AIzaSyD_EXznjY6XC7ZJsvafTDr8HRtHqOnBhJg";

class ListPlaces extends Component {
  static navigationOptions = { title: "Locais" }

  state = {
    latitude: "",
    longitude: "",
    listaLocais: [],
    erro: "",
    aguarde: "",
  }

  componentDidMount = () => {
    const config = { enableHighAccuracy: false };
    navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, config);
  }

  locationSuccess = (position) => {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  locationError = (error) => {
    alert(error)
  }

  render() {
    const { latitude, longitude } = this.state;

    if (latitude && longitude) {
      return (
        <View>
          {this.renderTopo()}

          <ScrollView>
            {this.renderLocais()}
          </ScrollView>
        </View>
      );
    }

    return (
      <View>
        <Text>Aguardando localização...</Text>
      </View>
    )
  }

  renderTopo = () => {
    return (
      <View>
        <View>
          <TextInput
            value={this.state.busca}
            onChangeText={this.onChangeBusca}
          />
        </View>
        <View>
          <Button
            title="Busca"
            onPress={this.onBuscaLocais}
          />
        </View>
      </View>
    );
  }

  renderLocais = () => {
    if (this.state.aguarde) {
      return (
        <ActivityIndicator
          size="large"
          color="#000"
        />
      );
    }

    let content;
    if (this.state.listaLocais) {
      content = this.state.listaLocais.map((item, index) => {
        if (item.photos) {
          const { navigate } = this.props.navigation;
          return (
            <TouchableOpacity
              key={item.formatted_address}
              onPress={() => navigate('DetailsItems', { place: item.place_id, reference: item.photos[0].photo_reference })}
            >
              <View key={index} style={styles.itemLocais}>
                <View style={styles.fotoLocais}>
                  <Image style={styles.detalhesLocais} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=' + item.photos[0].photo_reference + '&key='+KEY_GOOGLE_PLACES }} />
                </View>
                <View style={styles.detalhesItem}>
                  <Text style={styles.txtNome}>{item.name}</Text>
                  <Text>{item.formatted_address}</Text>
                </View>
              </View>
            </TouchableOpacity >
          );
        }

        return (
          <TouchableOpacity
            key={item.formatted_address}
            onPress={() => this.props.navigation.navigate('DetailsItems', { place: item.place_id })}
          >
            <View key={index} style={styles.itemLocais}>
              <View>
                <Text style={styles.txtNome}>{item.name}</Text>
                <Text>{item.formatted_address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    }

    return (
      <View >
        {content}
      </View>
    )
  }

  onBuscaLocais = () => {
    const { latitude, longitude, busca } = this.state;
    this.setState({ aguarde: true });
    let listaLocais = null;
    let erro = '';

    axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + busca + '&location=' + latitude + ',' + longitude + '&key=' + KEY_GOOGLE_PLACES)
      .then((response) => {
        list = response.data.results
      })
      .catch((err) => {
        alert(JSON.stringify(err))
      })
      .finally(() => {
        this.setState({
          aguarde: false,
          listaLocais: list,
          erro: erro
        });
      });
  }

  onChangeBusca = (busca) => {
    this.setState({ busca })
  }
}

const styles = StyleSheet.create({
  itemLocais: {
    backgroundColor: '#EEE',
    borderWidth: 0.5,
    borderColor: '#000',
    margin: 6,
    padding: 6,
    flexDirection: 'row'
  },
  fotoLocais: {
    width: 102,
    height: 72,
  },
  detalhesLocais: {
    height: 70,
    width: 100,
  },
  detalhesItem: {
    marginLeft: 10,
    flex: 1
  },
  txtNome: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ListPlaces;
