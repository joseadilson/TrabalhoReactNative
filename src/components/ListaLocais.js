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
} from 'react-native';
import axios from 'axios';

const KEY_GOOGLE_PLACES = "AIzaSyAFZaPFaF6JFd0KPN98QhP1YC85avJxOoo";

class ListaLocais extends Component {

  state = {
    latitude: null,
    longitude: null,
    listaLocais: null,
    erro: null,
    aguarde: false
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
          color="#F00"
        />
      );
    }

    let content;
    if (this.state.listaLocais) {
      content = this.state.listaLocais.map((item, index) => {
        if (item.photos) {
          return (
            <View key={index} style={styles.itemLocais}>
              <View style={styles.fotoLocais}>
                <Image style={styles.detalhesLocais} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=' + item.photos[0].photo_reference + '&key=AIzaSyAFZaPFaF6JFd0KPN98QhP1YC85avJxOoo' }} />
              </View>
              <View>
                <Text>{item.name}</Text>
                <Text>{item.formatted_address}</Text>
              </View>
            </View>
          );
        }
        return (
          <View key={index} style={{ padding: 16 }}>
            <View>
              <Text>{item.name}</Text>
              <Text>{item.formatted_address}</Text>
            </View>
          </View>
        );
      });
    }

    return (
      <View>
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
    margin: 10,
    padding: 10,
    flexDirection: 'row'

  },
  fotoLocais: {
    width: 102,
    height: 102,
  },
  detalhesLocais: {
    height: 100,
    width: 100,
    flex: 1,
  }
});

export default ListaLocais;
