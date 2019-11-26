import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Image,
    Button,
    View,
    TouchableOpacity
} from "react-native";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button title="LogIn" onPress={() => this.props.navigation.navigate('SignIn')} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button color="red" title="SignUp as Blood Donor" onPress={() => this.props.navigation.navigate('SignUp')} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button color="#841584" title="SignUp as Blood Donee" />
                </View>
            </View>);
    }
}

export default HomePage;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        // flex: 1,
        width: "80%",
        margin: 10
    }
});