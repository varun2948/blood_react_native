import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import { Home } from "./components";
import Spielplaetze from './MapPage';
import SignIn from './SignIn';
import Loading from './components/Loading';
import SignUp from './SignUp';
import MainHome from './components/MainHome';

const MainNavigator = createStackNavigator({
    Main: { screen: Main },
    // Home: { screen: Home }
    MapPage: { screen: Spielplaetze },
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp }

},
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
    }
);

export const AppContainer = createAppContainer(MainNavigator);