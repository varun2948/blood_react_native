import React from 'react';
import MapView, {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType,
} from 'react-native-maps';
import { Markers } from 'react-native-maps';
import { Slider } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import * as firebase from "firebase";
import firestore from 'firebase/firestore';
import * as theme from "./theme";
import * as mocks from "./mocks";
import moment from 'moment';

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
            arrData: [],
            markers: [],
            data: [],
            loaded: false,
            radius: 40 * 1000,
            value: 40 * 1000,
            time: '',

        }



    }

    componentDidMount() {
        this.getPosition();


        //Getting the current date-time with required format and UTC   
        var date = moment()
            .utcOffset('+05:30')
            .format('hh:mm:ss a');

        this.setState({ time: date });

    }

    getPosition() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 1.050,
                        longitudeDelta: 0.020,
                    }


                }, () => this.getLocations());
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );
    }


    getLocations() {
        return fetch('http://hydromap.nitifoundation.org/api/Hydropower/')
            .then(response => response.json())
            .then(responseData => {
                // let { region } = this.state;
                // let { latitude, longitude } = region;


                // let markers = responseData.features.map(feature => {
                //     let coords = feature.geometry.coordinates
                //     let data = feature.properties

                //     return {
                //         coordinate: {
                //             latitude: coords[1],
                //             longitude: coords[0],
                //         },
                //         properties: {
                //             bloodtype: data.blood_type,
                //             Name: data.name
                //         }
                //     }
                // }).filter(marker => {
                //     let distance = this.calculateDistance(latitude, longitude, marker.coordinate.latitude, marker.coordinate.longitude);
                //     return distance <= this.state.value;
                // });


                // this.setState({
                //     markers: markers,
                //     loaded: true,
                // });
                // var ref = firebase.database().ref("users"); //Here assuming 'Users' as main table of contents   
                const ref = firebase.firestore().collection('users');
                // ref.once('value').then(snapshot => {

                ref.onSnapshot((snapshot) => {
                    // get children as an array
                    var items = [];
                    snapshot.forEach((child) => {
                        items.push({
                            id: child.data().id,
                            name: child.data().name,
                            available_time_period: child.data().available_time_period,
                            phone: child.data().phone,
                            status: child.data().uid,
                            coordinates: child.data().coordinates,
                            timefrom: child.data().timefrom,
                            timeto: child.data().timeto,
                            latitude: child.data().latitude,
                            longitude: child.data().longitude,
                            blood_type: child.data().blood_type

                        });
                    });
                    let { region } = this.state;
                    let { latitude, longitude } = region;


                    let markers = items.map(feature => {
                        let coords = feature.coordinates;
                        // let data = feature.properties

                        return {
                            coordinate: {
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                            },
                            properties: {
                                bloodtype: feature.blood_type,
                                Name: feature.name,
                                timefrom: feature.timefrom,
                                timeto: feature.timeto,
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
                    // this.setState({ arrData: items });
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
        console.log(this.state.time);
        return (
            <View style={styles.container}>
                <View style={styles.slider}>
                    <Slider
                        maximumValue={this.state.radius}
                        minimumValue={100}
                        step={100}
                        value={this.state.value}
                        onValueChange={value => {
                            this.getLocations()
                            this.setState({ value })
                        }}
                    />
                    <View>
                        <Text>Radius: {this.state.value} m</Text>
                    </View>
                </View>

                <MapView.Animated
                    style={styles.map}
                    region={this.state.region}
                    showsUserLocation={true}
                >

                    {this.state.markers.map(marker => {
                        const startTime = marker.properties.timefrom;
                        const endTime = marker.properties.timeto;
                        let currentDate = new Date();
                        startDate = new Date(currentDate.getTime());
                        startDate.setHours(startTime.split(":")[0]);
                        startDate.setMinutes(startTime.split(":")[1]);

                        endDate = new Date(currentDate.getTime());
                        endDate.setHours(endTime.split(":")[0]);
                        endDate.setMinutes(endTime.split(":")[1]);
                        valid = startDate < currentDate && endDate > currentDate
                        console.log(valid, 'valid');
                        if (valid == true) {
                            return (

                                <MapView.Marker
                                    ref={ref => {
                                        this.marker1 = ref;
                                    }}
                                    key={Math.random()}
                                    style={{ width: 40, height: 40 }}
                                    coordinate={marker.coordinate}
                                    description="Varun"
                                    title={marker.name}
                                    // opacity={0.5}
                                    image={require('./assets/blue.png')}
                                // icon={require('./assets/varun.jpg')}
                                >
                                    <Callout  >
                                        <View style={styles.plainView} >
                                            <Text style={styles.whitetext} >Bloodtype: <Text style={styles.redcolor}>{marker.properties.bloodtype}</Text></Text>
                                            <Text style={styles.whitetext}>Name: {marker.properties.Name}</Text>
                                        </View>
                                    </Callout>
                                </MapView.Marker>

                            )
                        }
                        return (

                            <MapView.Marker
                                ref={ref => {
                                    this.marker1 = ref;
                                }}
                                key={Math.random()}
                                style={{ width: 40, height: 40 }}
                                coordinate={marker.coordinate}
                                description="Varun"
                                title={marker.name}
                                // opacity={0.5}
                                image={require('./assets/mark80.bmp')}
                            // icon={require('./assets/varun.jpg')}
                            >
                                <Callout  >
                                    <View style={styles.plainView} >
                                        <Text style={styles.whitetext} >Bloodtype: <Text style={styles.redcolor}>{marker.properties.bloodtype}</Text></Text>
                                        <Text style={styles.whitetext}>Name: {marker.properties.Name}</Text>
                                        <Text style={styles.whitetext}>Not Available at This Time</Text>
                                    </View>
                                </Callout>
                            </MapView.Marker>

                        )
                    })}

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
        justifyContent: 'space-between'

    },
    redcolor: {
        color: "#fa99a7",
        fontWeight: "bold",
        fontSize: 20,
    },
    plainView: {
        backgroundColor: "#5957ba",
        color: "white",
        width: 200,
        // alignSelf: 'center',
        // padding: 5

    },

    map: {
        width: "100%",
        height: "90%",
    },
    whitetext: {
        color: "white"
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
    // slider: {
    //     flex: 1,
    //     width: '90%',
    //     marginLeft: 10,
    //     marginRight: 10,
    //     alignItems: "stretch",
    //     justifyContent: "center",
    // },
    slider: {
        width: '100%',
        backgroundColor: '#1cee67',
        // justifyContent: 'center',
        // alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        // marginBottom: 20,
    }


})
