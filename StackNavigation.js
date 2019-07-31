import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import { Home } from "./components";
import Spielplaetze from './AnotherHome1.js';
import LoginView from './components/Login';

const MainNavigator = createStackNavigator({
    Main: { screen: Main },
    // Home: { screen: Home }
    AnotherHome: { screen: Spielplaetze },
    LoginView: { screen: LoginView }

},
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
    }
);

export const AppContainer = createAppContainer(MainNavigator);