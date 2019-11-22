import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import { Block, Text, Home } from "./components";
import * as firebase from "firebase";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            email: "",
            blood_type: "",
            available_time_period: "",
            latitude: "",
            longitude: "",
            password: "",
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.020,
                longitudeDelta: 0.020
            },
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
    SignUp = () => {
        this.getPosition()
        console.log("Signup Inside");
        try {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(res => {
                    // return console.log(this.state.name);
                    firebase.database().ref('users/' + res.user.uid).set({
                        email: this.state.email,
                        blood_type: this.state.blood_type,
                        available_time_period: this.state.available_time_period,
                        name: this.state.name,
                        address: this.state.address,
                        uid: res.user.uid,
                        coordinates: { longitude: this.state.region.longitude, latitude: this.state.region.latitude },
                    })
                    console.log(res);
                    this.props.navigation.navigate('SignIn');
                }).catch(error => {
                    alert(error.message);
                })
        } catch (err) {
            alert(err);
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
    render() {
        return (
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
                    <Item floatingLabel>
                        <Label>Blood Type</Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={blood_type => this.setState({ blood_type })}
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label>Available Time Period</Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={available_time_period => this.setState({ available_time_period })}
                        />
                    </Item>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
