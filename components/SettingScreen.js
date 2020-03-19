import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TextInput, ScrollView, Picker } from 'react-native';
import { Button, List, ListItem, DatePicker, Left, Right, Icon } from 'native-base';
import AppContainer from './Container';
import * as SQLite from 'expo-sqlite';
import { Subscribe } from 'unstated'
import moment from "moment";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const LifeReport = SQLite.openDatabase('LifeReport')

const SettingScreen = ({ container }) => {

	const [type, setType] = useState("Money")
	const [text, setText] = useState("")
	const [currency, setCurrency] = useState("")
	const [dateDelete, setDateDelete] = useState(moment(new Date()).add(0, 'days').format('YYYY-MM-DD'))
	const [typeDelete, setTypeDelete] = useState("Money")
	const [categoryDelete, setCategoryDelete] = useState([])

	useEffect(() => {
		container.updateCurrency()
		container.updateCategories()
	},
		[]
	)

	const convertToCSV = (objArray) => {
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		var str = '';
		var headerLine = 'ID, Date, Type, Category, Amount, Remark';
		str += headerLine + '\r\n';

		for (var i = 0; i < array.length; i++) {
			var line = '';
			for (var index in array[i]) {
				if (line != '') line += ','

				line += array[i][index];
			}

			str += line + '\r\n';
		}

		return str;
	}

	const exportFile = async () => {
		let fileName = "LifeReport_allExpenses_" + String(moment(new Date()).add(0, 'days').format('YYYY-MM-DD'));
		let fileUri = FileSystem.documentDirectory + fileName + ".csv";
		let txtFile = convertToCSV(container.state.allExpenses);
		//let txtFile = JSON.stringify(container.state.allExpenses, undefined, 4);
		await FileSystem.writeAsStringAsync(fileUri, txtFile, { encoding: FileSystem.EncodingType.UTF8 });
		await Sharing.shareAsync(fileUri)
		await FileSystem.deleteAsync(fileUri)
	}

	return (
		<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>

			<ScrollView>

				<List>
					<ListItem itemDivider>
						<Text> Add a category </Text>
					</ListItem>

					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
						<Picker
							style={{ height: 60, width: 100 }}
							itemStyle={{ height: 60 }}
							selectedValue={type}
							onValueChange={type => setType(type)}
						>
							<Picker.Item label="Money" value="Money" />
							<Picker.Item label="Time" value="Time" />
						</Picker>
						<TextInput
							style={{ height: 60, width: 150, }}
							onChangeText={text => setText(text)}
							onSubmitEditing={() => {
								LifeReport.transaction(tx => {
									tx.executeSql(
										"INSERT INTO categories " +
										"(Type, Category) " +
										"VALUES (?, ?);",
										[type, text]
									);
								},
									() => { console.log('fail to add a category') },
									() => { setText(""); container.updateCategories(); },
								);
							}}
							placeholder="Enter a category"
							value={text}
						/>
					</View>

					<ListItem itemDivider>
						<Text> Money Categories</Text>
					</ListItem>
					{container.state.moneyCategories.map((item, index) => (
						<ListItem
							label={item}
							value={item}
							key={index}
						>
							<Left>
								<Text> {item} </Text>
							</Left>
							<Right>
								<Icon
									name="trash"
									style={{ color: 'red', fontSize: 25 }}
									button={true}
									onPress={() => {
										LifeReport.transaction(tx => {
											tx.executeSql(
												"DELETE FROM categories " +
												"WHERE Type = 'Money' AND Category = ? ;",
												[item]
											);
										},
											() => { console.log('fail to delete a category') },
											() => { console.log('delete_category_success'); container.updateCategories(); },
										);
									}} />
							</Right>
						</ListItem>
					))}

					<ListItem itemDivider>
						<Text> Time Categories</Text>
					</ListItem>
					{container.state.timeCategories.map((item, index) => (
						<ListItem
							label={item}
							value={item}
							key={index}
						>
							<Left>
								<Text> {item} </Text>
							</Left>
							<Right>
								<Icon
									name="trash"
									style={{ color: 'red', fontSize: 25 }}
									button={true}
									onLongPress={() => {
										LifeReport.transaction(tx => {
											tx.executeSql(
												"DELETE FROM categories " +
												"WHERE Type = 'Time' AND Category = ? ;",
												[item]
											);
										},
											() => { console.log('fail to delete a category') },
											() => { console.log('delete_category_success'); container.updateCategories(); },
										);
									}} />
							</Right>
						</ListItem>
					))}

					<ListItem itemDivider>
						<Text> Currency </Text>
					</ListItem>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
						<TextInput
							style={{ height: 60, width: 150, }}
							onChangeText={text => setCurrency(text)}
							onSubmitEditing={() => {
								LifeReport.transaction(tx => {
									tx.executeSql(
										"INSERT INTO currency " +
										"(Currency) " +
										"VALUES (?);",
										[currency]
									);
								},
									() => { console.log('fail to set a currency') },
									() => { container.updateCurrency(); },
								);
							}}
							placeholder={container.state.money_currency}
							value={currency}
						/>
					</View>

					<ListItem itemDivider>
						<Text> File export </Text>
					</ListItem>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }} >
						<Button rounded primary
							style={{ width: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
							onPress={() => {
								exportFile()
							}}
						>
							<Text>Export database</Text>
						</Button>
					</View>

					<ListItem itemDivider>
						<Text> Delete a record </Text>
					</ListItem>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }} >
						<View style={{ flexDirection: 'column', alignSelf: 'center' }} >
							<DatePicker
								defaultDate={new Date()}
								locale={"en"}
								timeZoneOffsetInMinutes={undefined}
								modalTransparent={false}
								animationType={"fade"}
								androidMode={"default"}
								placeHolderText={moment(new Date()).add(0, 'days').format('YYYY-MM-DD')}
								textStyle={{ color: "green" }}
								placeHolderTextStyle={{ color: "green" }}
								formatChosenDate={date => moment(date).format('YYYY-MM-DD')}
								onDateChange={newDate => setDateDelete(moment(newDate).format("YYYY-MM-DD"))}
								disabled={false}
							/>
						</View>
						<Picker
							style={{ height: 60, width: 100 }}
							itemStyle={{ height: 60 }}
							selectedValue={typeDelete}
							onValueChange={type => setTypeDelete(type)}
						>
							<Picker.Item label="Money" value="Money" />
							<Picker.Item label="Time" value="Time" />
						</Picker>
						<Picker
							style={{ height: 60, width: 100 }}
							itemStyle={{ height: 60 }}
							selectedValue={categoryDelete}
							onValueChange={category => setCategoryDelete(category)}
						>
							<Picker.Item label={"Choose a category"} value={"Choose a category"} />
							{typeDelete === "Money" ?
								container.state.moneyCategories.map((item, index) =>
									<Picker.Item label={item} value={item} key={index} />
								)
								:
								container.state.timeCategories.map((item, index) =>
									<Picker.Item label={item} value={item} key={index} />
								)
							}
						</Picker>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }} >
						<Button rounded warning
							style={{ width: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
							onPress={() => container.deleteExpense(dateDelete, typeDelete, categoryDelete)}
						>
							<Text>Delete</Text>
						</Button>
					</View>

					<ListItem itemDivider>
						<Text> Delete all the records </Text>
					</ListItem>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }} >
						<Button rounded danger
							style={{ width: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
							onPress={() => {
								Alert.alert(
									'Delete all the records',
									'Do you want to proceed?',
									[
										{ text: 'Cancel', style: 'cancel' },
										{ text: 'OK', onPress: () => container.deleteAllExpenses() },
									],
									{ cancelable: false },
								);
							}}
						>
							<Text>Delete all</Text>
						</Button>
					</View>

				</List>

			</ScrollView>
		</View>
	)
}

// The methods in the container must be used inside <Subscribe>
const SettingWrapper = () => (
	<Subscribe to={[AppContainer]}>
		{container => <SettingScreen container={container} />}
	</Subscribe>
)
export default SettingWrapper
