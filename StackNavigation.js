import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import { Home } from "./components";
import HomePage from './HomePage';
import AddBlood from './components/AddBlood';
import Spielplaetze from './MapPage';
import SignIn from './SignIn';
import SignUpBloodDonee from './SignUpBloodDonee';
import Loading from './components/Loading';
import SignUp from './SignUp';
import MainHome from './components/MainHome';

const MainNavigator = createStackNavigator({
    // Main: { screen: HomePage },
    // Home: { screen: Main },
    Main: { screen: Main },
    Home: { screen: Main },
    MapPage: { screen: Spielplaetze },
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    AddBlood: { screen: AddBlood },
    SignUpBloodDonee: { screen: SignUpBloodDonee }

},
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
    }
);

export const AppContainer = createAppContainer(MainNavigator);