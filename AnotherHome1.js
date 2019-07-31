import React from 'react';
import MapView from 'react-native-maps';
import { Markers } from 'react-native-maps';
import { Slider } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
} from "react-native";

const geolib = require('geolib');

class Grillplaetze extends React.Component {


    constructor() {

        super();

        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.020,
                longitudeDelta: 0.020
            },
            markers: [],
            loaded: false,
            radius: 40 * 1000,
            value: 40 * 1000

        }



    }

    componentDidMount() {
        this.getPosition();
    }

    getPosition() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.020,
                        longitudeDelta: 0.020,
                    }


                }, () => this.getLocations());
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }


    getLocations() {
        return fetch('http://hydromap.nitifoundation.org/api/Hydropower/')
            .then(response => response.json())
            .then(responseData => {
                let { region } = this.state;
                let { latitude, longitude } = region;

                let markers = responseData.features.map(feature => {
                    let coords = feature.geometry.coordinates

                    return {
                        coordinate: {
                            latitude: coords[1],
                            longitude: coords[0],
                        }
                    }
                }).filter(marker => {
                    let distance = this.calculateDistance(latitude, longitude, marker.coordinate.latitude, marker.coordinate.longitude);
                    return distance <= this.state.value;
                });

                this.setState({
                    markers: markers,
                    loaded: true,
                });
            }).done();
    }

    calculateDistance(origLat, origLon, markerLat, markerLon) {
        return geolib.getDistance(
            { latitude: origLat, longitude: origLon },
            { latitude: markerLat, longitude: markerLon }
        );
    }


    render() {

        return (
            <View style={styles.container}>
                <View style={styles.slider}>
                    <Slider
                        maximumValue={1000}
                        minimumValue={100}
                        step={100}
                        value={this.state.value}
                        onValueChange={value => {
                            this.getLocations()
                            this.setState({ value })
                        }}
                    />
                    <View>
                        <Text>Radius: {this.state.value} km</Text>
                    </View>
                </View>

                <MapView.Animated
                    style={styles.map}
                    region={this.state.region}
                    showsUserLocation={true}
                >
                    {this.state.markers.map(marker => (
                        <MapView.Marker
                            key={Math.random()}
                            coordinate={marker.coordinate}
                        />
                    ))}
                    <MapView.Circle
                        center={this.state.region}
                        radius={this.state.value}
                        strokeWidth={1}
                        strokeColor={'#1a66ff'}
                        fillColor={'rgba(230,238,255,0.5)'}

                    />

                </MapView.Animated>

            </View>
        );
    }
}

export default Grillplaetze;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',

    },
    map: {
        width: "100%",
        height: "90%",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        flex: 1,
    },
    slider: {
        flex: 1,
        width: '90%',
        marginLeft: 10,
        marginRight: 10,
        alignItems: "stretch",
        justifyContent: "center"
    }

})
