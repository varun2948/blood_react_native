import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Picker, Animated, Dimensions, Keyboard, UIManager } from 'react-native';
import * as firebase from "firebase";
const { State: TextInputState } = TextInput;
export default class AddBlood extends React.Component {

    state = {
        name: '', phoneno: '', blood_type: '', age: '', address: '', gender: '', time_allocation: '', latitude: "",
        longitude: "", errorMessage: null, shift: new Animated.Value(0), region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.020,
            longitudeDelta: 0.020
        },
        choosenIndex: 0
    };

    getPosition = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position, "position");
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

    handleSignUp = () => {
        // TODO: Firebase stuff...
        console.log('handleSignUp');
        this.getPosition();
        setTimeout(
            function () {
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
                        // .auth()
                        // .createUserWithEmailAndPassword(this.state.email, this.state.password)
                        // .then(res => {
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


                        const ref = firebase.firestore().collection('blood_requests');
                        ref.add({
                            name: this.state.name,
                            bloodtype: this.state.bloodtype,
                            phoneno: this.state.phoneno,
                            age: this.state.age,
                            gender: this.state.gender,
                            time_allocation: this.state.time_allocation,
                            address: this.state.address,
                            coordinates: { latitude: this.state.region.latitude, longitude: this.state.region.longitude },
                        });
                        alert("Your Blood Request Added Sucessfully.")
                        this.props.navigation.navigate('Home');

                        // }).catch(error => {
                        //     alert(error.message);
                        // })
                    } catch (err) {
                        alert(err);
                    }
                }
            }
                .bind(this),
            5000
        );
        console.log("Signup Inside");


    }
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
                {/* <View style={styles.container}> */}
                <Text>Request For Urgent Blood</Text>
                {this.state.errorMessage &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}
                    </Text>}
                <TextInput
                    placeholder="Name"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="PhoneNo"
                    autoCapitalize="none"
                    keyboardType={'phone-pad'}
                    style={styles.textInput}
                    onChangeText={phoneno => this.setState({ phoneno })}
                    value={this.state.phoneno}
                />
                {/* <View floatingLabel style={{ marginTop: 10, marginLeft: 10 }}> */}
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
                <Picker
                    placeholder="Blood Type"
                    floatingLabel style={styles.pickerStyle}
                    selectedValue={this.state.bloodtype}
                    onValueChange={(itemValue, itemPosition) => {
                        if (itemValue == 0) {
                            alert('Select Blood Type Of Need');
                        }
                        else {
                            this.setState({ choosenIndex: itemPosition, bloodtype: itemValue })
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
                {/* </View> */}

                <TextInput

                    placeholder="Age"
                    keyboardType={'phone-pad'}
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={age => this.setState({ age })}
                    value={this.state.age}
                />
                <TextInput

                    placeholder="Address"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={address => this.setState({ address })}
                    value={this.state.address}
                />
                <TextInput

                    placeholder="Allocate Time Of Blood Need"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={time_allocation => this.setState({ time_allocation })}
                    value={this.state.time_allocation}
                />
                <Button title="Add Request" onPress={this.handleSignUp} />

                {/* </View> */}
            </Animated.View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    pickerStyle: {
        height: 50,
        width: "90%",
        margin: 10,
        color: '#344953',
        justifyContent: 'center',
        backgroundColor: '#fa99a7'
    },
})