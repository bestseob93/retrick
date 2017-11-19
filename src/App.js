import { StackNavigator, TabNavigator } from 'react-navigation';
import {
  MainScreen,
  AlbumScreen,
  CapturedScreen
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
      },
      Captured: {
        screen: CapturedScreen,
        navigationOptions: {
          header: null
        },
      }
    }
    // {
    //     mode: 'modal'
    // }
);

export default App;