import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Image,
    Button,
    View,
    TouchableOpacity,
    BackHandler,
    Alert
} from "react-native";
import * as Font from "expo-font";
import { LineChart, Path } from 'react-native-svg-charts';
import { Line } from "react-native-svg";
import * as shape from 'd3-shape';
import { FloatingAction } from "react-native-floating-action";
import Property from "./components/Property";
import { Block, Text, Home } from "./components";
import * as theme from "./theme";
import * as mocks from "./mocks";
import * as firebase from "firebase";



class Main extends React.Component {
    static navigationOptions = {
        title: "Right position"
    };
    state = {
        fontsLoaded: false,
        data: [],

    };
    loadFonts() {
        return Font.loadAsync({
            "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
            "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
            "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
            "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
            "Montserrat-Light": require("./assets/fonts/Montserrat-Light.ttf")
        });
    }
    loadBloodRequests = () => {
        const ref = firebase.firestore().collection('blood_requests');
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
                    age: child.data().age,
                    // status: child.data().uid,
                    coordinates: child.data().coordinates,
                    time_allocation: child.data().time_allocation,
                    gender: child.data().gender,
                    bloodtype: child.data().bloodtype
                });
            });
            this.setState({ data: items });
            console.log(this.state.data, 'data');
        });

    }
    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
        navigate('NewScreen');
    }

    handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }



    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        await this.loadFonts();
        await this.loadBloodRequests();

        this.setState({ fontsLoaded: true });
    }

    renderChart() {
        const { chart } = this.props;
        const LineShadow = ({ line }) => (
            <Path
                d={line}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth={7}
                strokeOpacity={0.07}
            />
        );

        return (
            <LineChart
                yMin={0}
                yMax={10}
                data={chart}
                style={{ flex: 2 }}
                curve={shape.curveMonotoneX}
                svg={{
                    stroke: theme.colors.primary,
                    strokeWidth: 1.25
                }}
                contentInset={{ left: theme.sizes.base, right: theme.sizes.base }}
            >
                <LineShadow belowChart={true} />
                <Line
                    key="zero-axis"
                    x1="0%"
                    x2="100%"
                    y1="50%"
                    y2="50%"
                    belowChart={true}
                    stroke={theme.colors.gray}
                    strokeDasharray={[2, 10]}
                    strokeWidth={1}
                />
            </LineChart >
        );
    }

    renderHeader() {

        const { user } = this.props;
        const { data } = this.state;
        // console.log(typeof (data), 'lengt');
        var count = 0;
        var i;

        for (i in data) {
            if (data.hasOwnProperty(i)) {
                count++;
            }
        }
        console.log(count, 's');
        return (
            <Block flex={0.42} column style={{ paddingHorizontal: 15 }}>

                <Block flex={false} row style={{ paddingVertical: 40 }}>
                    <Block center >
                        <Text h3 white style={{ marginRight: -(25 + 5) }}>
                            Blood Requests
                         </Text>
                        <Button
                            style={{ marginTop: 30 }}
                            onPress={() => this.props.navigation.navigate('MapPage')}
                            title="Search For Nearest Blood"
                            color="#007bff"
                            accessibilityLabel="Learn more about this purple button"
                        />
                        {/* <Button

                            onPress={() => this.props.navigation.navigate('SignUp')}
                            title="SignUp"
                            color="#841584"
                            style={styles.signUpbtn}
                            accessibilityLabel="Learn more about this purple button"
                        /> */}
                    </Block>

                    <Image style={styles.avatar} source={user.avatar} />
                </Block>
                <Block card shadow color="white" style={styles.headerChart}>

                    <View style={[{
                        width: '100%',
                        // height: '30%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}>
                        {/* <Button
                            onPress={() => this.props.navigation.navigate('MapPage')}
                            title="Go to Next Page"
                            color="#841584"
                            accessibilityLabel="Learn more about this purple button"
                        /> */}
                    </View>
                    <Block row space="between" style={{ paddingHorizontal: 30 }}>
                        <Block flex={false} row center>
                            <Text h1>291</Text>
                            <Text caption bold tertiary style={{ paddingHorizontal: 10 }}>
                                -12%
              </Text>
                        </Block>
                        <Block flex={false} row center>
                            <Text h1>{count}</Text>
                            <Text caption bold primary style={{ paddingHorizontal: 10 }}>
                                +49%
              </Text>

                        </Block>
                    </Block>
                    <Block
                        flex={0.5}
                        row
                        space="between"
                        style={{ paddingHorizontal: 30 }}
                    >
                        <Text caption light>
                            Available
            </Text>
                        <Text caption light>
                            Requests
            </Text>
                    </Block>
                    <Block flex={1}>
                        {this.renderChart()}
                    </Block>
                </Block>
            </Block>
        );
    }

    renderRequest(request, key, count) {

        return (
            <Block row card shadow color="white" style={styles.request}>
                <Block
                    flex={0.25}
                    card
                    column
                    color="secondary"
                    style={styles.requestStatus}
                >
                    <Block flex={0.25} middle center color={theme.colors.primary}>
                        <Text small white style={{ textTransform: "uppercase" }}>
                            {request.priority}
                        </Text>
                    </Block>
                    <Block flex={0.7} center middle>
                        <Text h2 white>
                            {request.bloodtype}
                        </Text>
                    </Block>
                </Block>
                <Block flex={0.75} column middle>
                    <Text h3 style={{ paddingVertical: 8, }}>{request.name}</Text>
                    <Text caption semibold>
                        {request.age}  •  {request.gender}  •  {request.distance}km  •  {request.time_allocation}hrs
                    </Text>
                    <Text h2 style={{ paddingVertical: 8, }} caption semibold>
                        {request.address}
                    </Text>
                </Block>
            </Block>

        );
    }
    HomePage() {

        return (
            <Block>
                <Text> 2nd Page</Text>
            </Block>
        );

    }

    renderRequests() {
        const { data } = this.state;


        return (
            <Block flex={0.8} column color="gray2" style={styles.requests}>
                <Block flex={false} row space="between" style={styles.requestsHeader}>
                    <Text light>Recent Updates</Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <Text semibold>View All</Text>
                    </TouchableOpacity>
                </Block>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {data.map((request, key) => {


                        return (

                            <TouchableOpacity activeOpacity={0.8} key={`request-${key}`}>
                                {this.renderRequest(request, key)}

                            </TouchableOpacity>
                        )

                    })}
                    <View style={[{
                        width: '100%',
                        // height: '30%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}>
                        {/* <Button
                            onPress={() => this.props.navigation.navigate('LoginView')}
                            title="LogIn"
                            color="#841584"
                            accessibilityLabel="Learn more about this purple button"
                        /> */}
                    </View>

                </ScrollView>
            </Block>
        );
    }
    renderFloatButton() {
        const actions = [
            {
                text: "Add Blood Request",
                icon: require("./images/add_blood.png"),
                name: "add_blood",
                position: 2
            },
            {
                text: "Search Donor in Map",
                icon: require("./images/ic_accessibility_white.png"),
                name: "search_donor",
                position: 3
            },
            {
                text: "About Us",
                icon: require("./images/ic_accessibility_white.png"),
                name: "about_us",
                position: 4
            }
        ];
        return (
            // <View style={styles.container}>
            <FloatingAction
                color={theme.colors.primary}
                buttonSize={60}
                actions={actions}
                onPressItem={name => {
                    // console.log(`selected button: ${name}`);
                    switch (name) {
                        case 'add_blood':
                            return this.props.navigation.navigate('AddBlood');
                        case 'search_donor':
                            return this.props.navigation.navigate('MapPage');
                        case 'about_us':
                            return this.props.navigation.navigate('AboutUs');
                        default:
                            return null;
                    }
                }
                }
            />
            // </View>
        );
    }

    render() {

        if (!this.state.fontsLoaded) {
            return (
                <Block center middle>
                    <Image
                        style={{ width: 140, height: 140 }}
                        source={require("./assets/icon.png")}
                    />
                </Block>
            );
        }


        return (
            <SafeAreaView style={styles.safe}>
                {this.renderHeader()}
                {this.renderRequests()}
                {this.renderFloatButton()}
            </SafeAreaView>



        );
    }
}

Main.defaultProps = {
    user: mocks.user,
    requests: mocks.requests,
    chart: mocks.chart,
};

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safe: {
        flex: 1,
        backgroundColor: theme.colors.primary
    },
    headerChart: {
        paddingTop: 30,
        paddingBottom: 30,
        zIndex: 1
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        marginRight: 5,
    },
    signUpbtn: {
        // width: 50,
        // height: 50,
        // borderRadius: 50 / 2,
        // marginRight: 5,
    },
    requests: {
        marginTop: -55,
        paddingTop: 55 + 20,
        paddingHorizontal: 15,
        zIndex: -1
    },
    requestsHeader: {
        paddingHorizontal: 20,
        paddingBottom: 15
    },
    request: {
        padding: 20,
        marginBottom: 15
    },
    requestStatus: {
        marginRight: 20,
        overflow: "hidden",
        height: 90
    }
});
