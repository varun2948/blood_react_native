import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Home extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                {/* <Text> 2nd Page</Text> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        fles: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});