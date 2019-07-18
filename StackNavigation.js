import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import { Home } from "./components";
import AnotherHome from './AnotherHome.js';

const MainNavigator = createStackNavigator({
    Main: { screen: Main },
    // Home: { screen: Home }
    AnotherHome: { screen: AnotherHome }
},
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
    }
);

export const AppContainer = createAppContainer(MainNavigator);