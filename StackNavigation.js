import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import { Home } from "./components";
import Spielplaetze from './MapPage';
import LoginView from './components/Login';
import Loading from './components/Loading';
import SignUp from './components/Signup';
import Login from './components/Login1';
import MainHome from './components/MainHome';

const MainNavigator = createStackNavigator({
    Main: { screen: Main },
    // Home: { screen: Home }
    MapPage: { screen: Spielplaetze },
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