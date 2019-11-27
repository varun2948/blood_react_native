import React from 'react';
import { StyleSheet, View, TouchableOpacity, Picker, Animated, Dimensions, Keyboard, TextInput, UIManager } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import { Block, Text, Home } from "./components";
import * as firebase from "firebase";
import TimePicker from "react-native-24h-timepicker";

import firestore from 'firebase/firestore';
const { State: TextInputState } = TextInput;


export default class SignUpBloodDonee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            email: "",
            phoneno: "",
            latitude: "",
            longitude: "",
            gender: "",
            password: "",
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
        this.getPosition();
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


                        const ref = firebase.firestore().collection('blood_receiver_users');
                        ref.add({
                            email: this.state.email,
                            phoneno: this.state.phoneno,
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
                            <Label>Phone No</Label>
                            <Input
                                autoCorrect={false}
                                keyboardType={'phone-pad'}
                                onChangeText={phoneno => this.setState({ phoneno })}
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

                        <Item floatingLabel style={{ marginTop: 4 }}>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={password => this.setState({ password })}
                            />
                        </Item>

                        <Button full rounded primary style={{ marginTop: 15 }} color="#841584"
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
