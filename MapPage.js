import React from 'react';
import MapView, {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType,
} from 'react-native-maps';
import { Markers } from 'react-native-maps';
import { Slider, Linking, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import * as firebase from "firebase";
import Modal, {
    ModalContent,
    ModalTitle,
    ModalFooter,
    ModalButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-modals';
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
import { underline } from 'ansi-colors';

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
            visible: false,
            bottomModalAndTitle: false,
            loading: true,
            valids: true,
            modalData: [],
            loaderZindex: 1,

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
                            address: child.data().address,
                            phoneno: child.data().phoneno,
                            status: child.data().uid,
                            coordinates: child.data().coordinates,
                            timefrom: child.data().timefrom,
                            timeto: child.data().timeto,
                            gender: child.data().gender,
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
                                name: feature.name,
                                timefrom: feature.timefrom,
                                timeto: feature.timeto,
                                address: feature.address,
                                phoneno: feature.phoneno,
                                gender: feature.gender,
                            }

                        }

                    }).filter(marker => {
                        let distance = this.calculateDistance(latitude, longitude, marker.coordinate.latitude, marker.coordinate.longitude);
                        return distance <= this.state.value;
                    });


                    this.setState({
                        markers: markers,
                        loaded: true,
                        loading: false,
                        loaderZindex: 0,
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
                <View style={{
                    position: 'absolute',
                    left: 0,
                    zIndex: this.state.loaderZindex,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator animating={this.state.loading} size="large" color="#ef0652" />
                </View>
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
                                    onPress={() => {

                                        this.setState({
                                            bottomModalAndTitle: true,
                                            valids: true,
                                            modalData: marker.properties,
                                        });
                                    }}
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
                        else {
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
                                    onPress={() => {

                                        this.setState({
                                            bottomModalAndTitle: true,
                                            modalData: marker.properties,
                                            valids: false,
                                        });
                                    }}
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
                        }

                    })}
                    <Modal.BottomModal
                        visible={this.state.bottomModalAndTitle}
                        onTouchOutside={() => this.setState({ bottomModalAndTitle: false })}
                        height={0.4}
                        width={1}
                        onSwipeOut={() => this.setState({ bottomModalAndTitle: false })}
                        modalTitle={
                            <ModalTitle
                                title="Blood Donor Details"
                                hasTitleBar
                            />
                        }
                    >
                        <ModalContent
                            style={{
                                flex: 1,
                                backgroundColor: 'fff',
                            }}>
                            <Text  >Bloodtype: <Text style={styles.redcolor}>{this.state.modalData.bloodtype}</Text></Text>
                            <Text >Name: <Text style={styles.bigText}>{this.state.modalData.name}</Text></Text>
                            {/* <TouchableOpacity > */}
                            <Text >Number: <Text onPress={() => { Linking.openURL(`tel:${'119'}`); }} style={styles.blacktext} onClick> +9779845662948</Text> <Text style={{ color: 'red', fontSize: 12 }}>  (Tap to Call) </Text></Text>
                            <Text >Address: <Text style={styles.bigText}>{this.state.modalData.address}</Text></Text>
                            <Text >Gender: <Text style={styles.bigText}>{this.state.modalData.gender}</Text></Text>
                            <Text >Available From: <Text style={styles.bigText}>{this.state.modalData.timefrom}</Text></Text>
                            <Text >Available To: <Text style={styles.bigText}>{this.state.modalData.timeto}</Text></Text>

                            {(this.state.valids == true) ? <Text style={{ fontWeight: "bold", fontSize: 15 }} >Availability: <Text style={{ color: 'red', fontSize: 15, fontWeight: 'bold' }}>Available To Donate &#10004;  </Text></Text> : <Text style={{ fontWeight: "bold", fontSize: 15 }} >Availability: <Text style={{ color: 'red', fontSize: 15, fontWeight: 'bold' }}>Not Available To Donate &#10799;  </Text></Text>

                            }
                            {/* </TouchableOpacity> */}

                        </ModalContent>
                    </Modal.BottomModal>
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
    bigText: {
        fontSize: 15,
        fontWeight: "bold",
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
    blacktext: {
        fontSize: 16,
        fontWeight: "bold",
        color: "blue",
        textDecorationLine: 'underline',
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
    },
    loading: {
        position: 'absolute',
        left: 0,
        zIndex: 1,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }

})
