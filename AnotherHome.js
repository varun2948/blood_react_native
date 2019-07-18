import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import WebViewLeaflet from "react-native-webview-leaflet";

export default class AnotherHome extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>AnotherHome</Text>
                <Button title='go to home' onPress={() => this.props.navigation.navigate('Main')} />
            </View>
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