import React from 'react';
import { StyleSheet, View, TouchableOpacity, Picker, Animated, Dimensions, Keyboard, TextInput, UIManager } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import { Block, Text, Home } from "./components";
import * as firebase from "firebase";
import TimePicker from "react-native-24h-timepicker";

import firestore from 'firebase/firestore';
const { State: TextInputState } = TextInput;


export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            email: "",
            blood_type: "",
            latitude: "",
            longitude: "",
            gender: "",
            password: "",
            timefrom: "0:00",
            timeto: "0:00",
            shift: new Animated.Value(0),
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.020,
                longitudeDelta: 0.020
            },
            choosenIndex: 0
        };
    }
    getPosition = () => {
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
    onCancel() {
        this.TimePicker.close();

    }

    onConfirm(hour, minute) {
        this.setState({ timefrom: `${hour}:${minute}` });
        this.TimePicker.close();
    }
    onCancel1() {

        this.TimePicker1.close();
    }

    onConfirm1(hour, minute) {
        this.setState({ timeto: `${hour}:${minute}` });
        this.TimePicker1.close();
    }
    SignUp = () => {
        this.getPosition()
        console.log("Signup Inside");

        if (this.state.name == "") {
            return alert('Enter Your Name');
        }
        else if (this.state.address == "") {

            return alert('Enter Your Address');
        }
        else if (this.state.gender == '' || this.state.gender == '0') {

            return alert('Enter Gender First');
        } else {
            try {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(res => {
                        // return console.log(this.state.name);
                        // firebase.database().ref('users/' + res.user.uid).set({
                        //     email: this.state.email,
                        //     blood_type: this.state.blood_type,
                        //     available_time_period: this.state.available_time_period,
                        //     name: this.state.name,
                        //     address: this.state.address,
                        //     uid: res.user.uid,
                        //     coordinates: { latitude: this.state.region.latitude, longitude: this.state.region.longitude },
                        // })


                        const ref = firebase.firestore().collection('users');
                        ref.add({
                            email: this.state.email,
                            blood_type: this.state.blood_type,
                            timefrom: this.state.timefrom,
                            timeto: this.state.timeto,
                            gender: this.state.gender,
                            name: this.state.name,
                            address: this.state.address,
                            uid: res.user.uid,
                            coordinates: { latitude: this.state.region.latitude, longitude: this.state.region.longitude },
                        });

                        this.props.navigation.navigate('SignIn');

                    }).catch(error => {
                        alert(error.message);
                    })
            } catch (err) {
                alert(err);
            }
        }
    }
    // Login = (email, password) => {
    //     console.log("LOGIN");
    //     firebase.auth().onAuthStateChanged(function (user) {
    //         if (user) {
    //             // User is signed in.
    //         } else {
    //             // No user is signed in.
    //         }
    //     });
    //     try {
    //         firebase
    //             .auth()
    //             .signInWithEmailAndPassword(email, password)
    //             .then(res => {
    //                 console.log(res.user.email);
    //             });
    //     } catch (error) {
    //         console.log(error.toString(error));
    //     }
    // };
    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }
    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }
    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 1000,
                    useNativeDriver: true,
                }
            ).start();
        });
    }

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }

    render() {
        const { shift } = this.state;
        return (
            <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
                <Container>
                    <Form>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={email => this.setState({ email })}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Name</Label>
                            <Input
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={name => this.setState({ name })}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Address</Label>
                            <Input
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={address => this.setState({ address })}
                            />
                        </Item>
                        {/* <Item floatingLabel>
                        <Label>Blood Type</Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={blood_type => this.setState({ blood_type })}
                        />
                    </Item> */}
                        {/* <Item floatingLabel> */}
                        <View floatingLabel style={{ marginTop: 10, marginLeft: 10 }}>
                            <Picker
                                placeholder="Gender"
                                floatingLabel style={styles.pickerStyle}
                                selectedValue={this.state.gender}
                                onValueChange={(itemValue, itemPosition) => {
                                    if (itemValue == 0) {
                                        alert('Select Gender First');
                                    }
                                    else {
                                        this.setState({ choosenIndex: itemPosition, gender: itemValue })
                                    }
                                }}
                            >
                                <Picker.Item label="Choose Your Gender" value="0" />
                                <Picker.Item label="Male" value="male" />
                                <Picker.Item label="Female" value="female" />
                                <Picker.Item label="Other" value="other" />
                            </Picker>
                        </View>
                        <View floatingLabel style={{ marginTop: 10, marginLeft: 10 }}>
                            <Picker
                                style={styles.button}
                                placeholder="Pick a Blood Type"
                                floatingLabel style={styles.pickerStyle}
                                selectedValue={this.state.blood_type}
                                onValueChange={(itemValue, itemPosition) => {
                                    if (itemValue == 0) {
                                        alert('Select Blood Type First');
                                    }
                                    else {
                                        this.setState({ language: itemValue, choosenIndex: itemPosition, blood_type: itemValue })
                                    }
                                }}
                            >
                                <Picker.Item disabled={true} label="Select Blood Type" value="0" />
                                <Picker.Item label="A+" value="A+" />
                                <Picker.Item label="A-" value="A-" />
                                <Picker.Item label="B+" value="B+" />
                                <Picker.Item label="B-" value="B-" />
                                <Picker.Item label="0+" value="0+" />
                                <Picker.Item label="0-" value="0-" />
                                <Picker.Item label="AB+" value="AB+" />
                                <Picker.Item label="AB-" value="AB-" />
                            </Picker>
                        </View>
                        {/* </Item> */}
                        <View floatingLabel >
                            <TouchableOpacity
                                onPress={() => this.TimePicker.open()}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Available From</Text>
                            </TouchableOpacity>
                            <Text style={styles.text}>{this.state.timefrom}</Text>
                            <TimePicker
                                ref={ref => {
                                    this.TimePicker = ref;
                                }}
                                onCancel={() => this.onCancel()}
                                onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
                            />
                        </View>
                        <View floatingLabel >
                            <TouchableOpacity
                                onPress={() => this.TimePicker1.open()}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Available To</Text>
                            </TouchableOpacity>
                            <Text style={styles.text}>{this.state.timeto}</Text>
                            <TimePicker
                                ref={ref => {
                                    this.TimePicker1 = ref;
                                }}
                                onCancel={() => this.onCancel1()}
                                onConfirm={(hour, minute) => this.onConfirm1(hour, minute)}
                            />
                        </View>
                        {/* <View floatingLabel >
                        <TouchableOpacity
                            onPress={() => this.TimePicker.open()}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Available To</Text>
                        </TouchableOpacity>
                        <Text style={styles.text}>{this.state.timeto}</Text>
                        <TimePicker
                            ref={ref => {
                                this.TimePicker = ref;
                            }}
                            onCancel={() => this.onCancel()}
                            onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
                        />
                    </View> */}
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={password => this.setState({ password })}
                            />
                        </Item>

                        <Button full rounded primary style={{ marginTop: 40 }} color="#841584"
                            onPress={() => this.SignUp(this.state.email, this.state.password)}>
                            <Text white >SignUp</Text>
                        </Button>

                    </Form>
                </Container>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    container: {
        backgroundColor: 'gray',
        flex: 1,
        height: '100%',
        justifyContent: 'space-around',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%'
    },
    pickerStyle: {
        height: 50,
        width: "98%",
        color: '#344953',
        justifyContent: 'center',
        backgroundColor: '#fa99a7'
    },
    text: {
        fontSize: 20,
        // marginTop: 10
        marginLeft: 20,
        alignItems: 'center',
        textAlign: "center",
        justifyContent: 'center',
    },
    button: {
        height: 50,
        width: "70%",
        justifyContent: 'center',
        backgroundColor: "#4EB151",
        paddingVertical: 11,
        marginTop: 10,
        marginLeft: 60,
        // paddingHorizontal: 17,
        borderRadius: 3,
        // marginVertical: 50
    },
    buttonText: {
        marginLeft: 10,
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        justifyContent: 'center',
        textAlign: "center"
    }
});
