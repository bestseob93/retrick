import { StackNavigator, TabNavigator } from 'react-navigation';
import {
  MainScreen,
  AlbumScreen,
} from './containers';

const App = StackNavigator(
    {
      Main: {
        screen: MainScreen,
        navigationOptions: {
          header: null,
        }
      },
      Album: {
        screen: AlbumScreen
      }
    },
    {
        mode: 'modal'
    }
);

export default App;