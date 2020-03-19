import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

import RecordWrapper from './components/RecordScreen';
import TodayReportWrapper from './components/TodayReportScreen';
import DailyReportMoneyWrapper from './components/DailyReportScreenMoney';
import DailyReportTimeWrapper from './components/DailyReportScreenTime';
import SettingWrapper from './components/SettingScreen';

const RecordStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Record expenses"
				component={RecordWrapper}
				options={({ navigation }) => ({
					headerLeft: () => (<FontAwesome name="bars" size={24} onPress={() => { navigation.openDrawer() }} style={{ paddingLeft: 20 }} />)
				})}
			/>
		</Stack.Navigator>
	)
}

const ReportStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Today's report"
				component={TodayReportWrapper}
				options={({ navigation }) => ({
					headerLeft: () => (<FontAwesome name="bars" size={24} onPress={() => { navigation.openDrawer() }} style={{ paddingLeft: 20 }} />)
				})}
			/>
		</Stack.Navigator>
	)
}

const DailyMoneyStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Daily money chart"
				component={DailyReportMoneyWrapper}
				options={({ navigation }) => ({
					headerLeft: () => (<FontAwesome name="bars" size={24} onPress={() => { navigation.openDrawer() }} style={{ paddingLeft: 20 }} />)
				})}
			/>
		</Stack.Navigator>
	)
}

const DailyTimeStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Daily time chart"
				component={DailyReportTimeWrapper}
				options={({ navigation }) => ({
					headerLeft: () => (<FontAwesome name="bars" size={24} onPress={() => { navigation.openDrawer() }} style={{ paddingLeft: 20 }} />)
				})}
			/>
		</Stack.Navigator>
	)
}

const SettingStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Setting"
				component={SettingWrapper}
				options={({ navigation }) => ({
					headerLeft: () => (<FontAwesome name="bars" size={24} onPress={() => { navigation.openDrawer() }} style={{ paddingLeft: 20 }} />)
				})}
			/>
		</Stack.Navigator>
	)
}

const RecordBottomTab = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === 'Record') {
						iconName = 'pluscircleo'
					} else if (route.name === 'Report') {
						iconName = 'piechart';
					}
					return <AntDesign name={iconName} size={size} color={color} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'dodgerblue',
				inactiveTintColor: 'gray',
			}}
		>
			<Tab.Screen name="Record" component={RecordStack} />
			<Tab.Screen name="Report" component={ReportStack} />
		</Tab.Navigator>
	)
};

const DailyChartBottomTab = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === 'Money') {
						iconName = 'attach-money'
					} else if (route.name === 'Time') {
						iconName = 'access-time';
					}
					return <MaterialIcons name={iconName} size={size} color={color} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'dodgerblue',
				inactiveTintColor: 'gray',
			}}
		>
			<Tab.Screen name="Money" component={DailyMoneyStack} />
			<Tab.Screen name="Time" component={DailyTimeStack} />
		</Tab.Navigator>
	)
};


export const Navigator = () => {
	return (
		<Drawer.Navigator
			initialRouteName="Record expenses"
			screenOptions={({ route }) => ({
				drawerIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === 'Record expenses') {
						iconName = 'addfile'
					} else if (route.name === 'Daily chart') {
						iconName = 'linechart';
					} else if (route.name === 'Setting') {
						iconName = 'setting';
					}
					return <AntDesign name={iconName} size={size} color={color} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'dodgerblue',
				inactiveTintColor: 'gray',
			}}
		>
			<Tab.Screen name="Record expenses" component={RecordBottomTab} />
			<Tab.Screen name="Daily chart" component={DailyChartBottomTab} />
			<Tab.Screen name="Setting" component={SettingStack} />
		</Drawer.Navigator>
	)
};
