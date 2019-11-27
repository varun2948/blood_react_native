import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Item, Form, Input, Button, Label } from "native-base";
import * as firebase from "firebase";


export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            email: "",
            password: ""
        };
    }
    SignUp = () => {

        // console.log("Signup Inside");
        // try {
        //   firebase
        //     .auth()
        //     .createUserWithEmailAndPassword(this.state.email, this.state.password)
        //     .then(user => {
        //       console.log(user);
        //     });
        // } catch (error) {
        //   console.log(error.toString(error));
        // }
    }
    _showAlert = () => {
        Alert.alert(
            'Aviso',
            '¿Desea cerrar la sesion?',
            [
                { text: 'Ask me later', onPress: () => alert('Ask me later pressed') },
                { text: 'Cancel', onPress: () => alert('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    Login = (email, password) => {
        console.log("LOGIN");
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
            } else {
                // No user is signed in.
            }
        });
        // try {
        //     firebase
        //         .auth()
        //         .signInWithEmailAndPassword(email, password)
        //         .then(res => {
        //             // console.log(res.user.email);
        //             this.props.navigation.navigate('MapPage');
        //         });
        // } catch (error) {
        //     this._showAlert;
        //     // console.log(error.toString(error));
        // }
        try {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => this.props.navigation.navigate('Home'))
                .catch(error => {
                    alert("Email Doesnt Exist");
                })
        } catch (err) {
            alert(err);
        }
    };
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
                        <Label>Password</Label>
                        <Input
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={password => this.setState({ password })}
                        />
                    </Item>



                    <Button full rounded success
                        onPress={() => this.Login(this.state.email, this.state.password)} style={styles.button}>
                        <Text>Login</Text>
                    </Button>
                    {/* <Button full rounded success style={{ marginTop: 40 }}
                        onPress={() => this.SignUp(this.state.email, this.state.password)}>
                        <Text>SignUp</Text>
                    </Button> */}

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
    button: {
        color: "#841584"
    }
});
