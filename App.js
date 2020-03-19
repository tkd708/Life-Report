import 'react-native-gesture-handler';
import React from 'react';
import { Navigator } from './Router';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'unstated'

//Provider must wrap all the components to have share the states
export default class App extends React.Component {
	render() {
		return (
			<Provider>
				<NavigationContainer>
					<Navigator />
				</NavigationContainer>
			</Provider>
		);
	}
}


