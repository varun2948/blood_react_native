import React from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Constants, MapView, Location, Permissions } from 'expo';
import { Block, Home } from "./components";
import Geolib from 'geolib';

const geolib = require('geolib');
export default class AnotherHome extends React.Component {
    state = {
        location: null,
        errorMessage: null,
        mapRegion: { latitude: 28.3949, longitude: 84.5340, latitudeDelta: 0.1421, longitudeDelta: 0.1421 },
        region: { latitude: 28.3949, longitude: 84.5340, latitudeDelta: 0.1421, longitudeDelta: 0.1421 },
        locationResult: null,
        location: { coords: { latitude: 28.3949, longitude: 84.5340 } },
        markers: [{
            title: 'hello',
            coordinates: {
                latitude: 28.3949,
                longitude: 84.5340
            },
        },
        {
            title: 'hello',
            coordinates: {
                latitude: 28.3949,
                longitude: 84.1240
            },
        },
        {
            title: 'hello',
            coordinates: {
                latitude: 28.4949,
                longitude: 84.9240
            },
        }]
        // data: [
        //     { "id": 1, "type": "Marker", geom: { 'lat': -122.4324, 'lon': 0.0922 } },
        //     { "id": 2, "type": "Marker", geom: { 'lat': -122.4324, 'lon': 0.0922 } },
        //     { "id": 3, "type": "Marker", geom: { 'lat': -122.4324, 'lon': 0.0922 } },
        // ]

    };
    componentDidMount() {
        // this._getLocationAsync();
        this.getLocations();
        this.getPosition();
    }
    _handleMapRegionChange = mapRegion => {
        this.setState({ mapRegion });
    };

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
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }
    getLocations() {
        let { region } = this.state;
        let { latitude, longitude } = region;
        fetch('http://media-panda.de/cologne.geojson')
            .then(response => response.json())
            .then(responseData => {

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
                    return distance <= 500;
                });

                this.setState({
                    markers: markers,
                    loaded: true,
                });
            }).done(); // should probably have a catch on here otherwise you've got no way to handle your errors
    }

    // this function uses geolib to calculate the distance between the points
    calculateDistance(origLat, origLon, markerLat, markerLon) {
        return geolib.getDistance(
            { latitude: origLat, longitude: origLon },
            { latitude: markerLat, longitude: markerLon }
        );
    }

    _getLocationAsync = async () => {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        // console.log(status, "status");


        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
                location,
            });
        }
        // console.log(Location.hasServicesEnabledAsync(), "Check Location En");

        getLocations();

        // if (await Location.hasServicesEnabledAsync()) {
        //     const location = await Location.getCurrentPositionAsync({});
        //     this.setState({ locationResult: JSON.stringify(location), location, latitudeDelta: 0.1421 });
        // }
        // else {

        //     alert('Turn You Gps Location On.')
        // }
        // console.log(await Location.hasServicesEnabledAsync(), "Await Check Location En");
        // console.log(status, 'status');
        // console.log(await Location.getCurrentPositionAsync({}).then(data => { console.log('then', data) })
        //     .catch((err) => { console.log(err, "ERROR") }));


        // console.log("get", await Location.getCurrentPositionAsync({}));




    };
    // getCurrentLocation() {
    //     alert('Varun');

    // const geolib = require('geolib');

    // ...


    // }
    render() {

        return (
            <Block style={styles.container} >

                <Block>
                    <MapView
                        style={styles.mapContainer}
                        region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 17, longitudeDelta: 0.0421 }}
                    // onRegionChange={this._handleMapRegionChange}
                    >
                        {this.state.markers.map((marker, i) => (
                            <MapView.Marker
                                key={i}
                                coordinate={marker.coordinates}
                                title={marker.title}
                            />
                        ))}
                        <MapView.Marker
                            coordinate={this.state.location.coords}
                            title="My Marker"
                            description="Some description"
                        />

                    </MapView>
                </Block>

                <Block style={styles.bottomView}>
                    {/* <Text
                        style={styles.bottomView}>
                        Location: {this.state.locationResult}
                    </Text> */}
                    <Button
                        style={styles.floatingMenuButtonStyle}
                        onPress={this.getLocations}
                        title="My Locations"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </Block>

            </Block>
            // < View style={styles.container} >
            //     <MapView
            //         provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            //         style={styles.map}
            //         region={{
            //             latitude: 27.78825,
            //             longitude: 85.4324,
            //             latitudeDelta: 17,
            //             longitudeDelta: 0.0121,
            //         }}
            //     >
            //     </MapView>
            //     <Text style={styles.paragraph}>{text}</Text>
            // </View >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        // height: 1000,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    mapContainer: {
        height: 1000,
        width: 500,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    mainConatinerStyle: {
        flexDirection: 'column',
        flex: 1
    },
    floatingMenuButtonStyle: {
        // alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        // marginTop: 80
    },
    bottomView: {
        width: '50%',
        height: 70,
        position: 'absolute',
        // bottom: 0
    },

});
