import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Form, Item, Input, Label, DatePicker, Picker, Icon, } from 'native-base';
import AppContainer from './Container';
import { Subscribe } from 'unstated'
import uuid from 'uuid';
import moment from "moment";


class RecordScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			expenseType: "Money",
			category: "",
			amount: "",
			remark: "",
			buttonToggle: 0,
		};
	}
	
	componentDidMount() {
		this.props.container.updateCurrency()
		this.props.container.updateExpenses()
		this.props.container.updateCategories()
	}

	onAddExpense = () => {
		if (!this.state.amount) return

		const id = uuid();
		this.props.container.onDoneAddExpense(
			id,
			moment(this.state.date).format("YYYY-MM-DD"),
			this.state.expenseType,
			this.state.category,
			this.state.amount,
			this.state.remark)
		this.setState({
			date: new Date(),
			expenseType: "Money",
			category: "",
			amount: "",
			remark: "",
			buttonToggle: 0,
		});

	}

	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>

				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<TouchableOpacity
						style={[styles.button,
						this.state.buttonToggle == 0 ?
							{ backgroundColor: 'rgba(80,80,80,0.7)' } :
							{ backgroundColor: 'rgba(200,200,200,0.5)' }
						]}
						onPress={() => this.setState({ expenseType: "Money", buttonToggle: 0 })}
					>
						<Text style={styles.text}> Money </Text>
					</TouchableOpacity>
					<Text style={styles.text2}> OR </Text>
					<TouchableOpacity
						style={[styles.button,
						this.state.buttonToggle == 1 ?
							{ backgroundColor: 'rgba(80,80,80,0.7)' } :
							{ backgroundColor: 'rgba(200,200,200,0.5)' }
						]}
						onPress={() => this.setState({ expenseType: "Time", buttonToggle: 1 })}
					>
						<Text style={styles.text}> Time </Text>
					</TouchableOpacity>
				</View>

				<Form>
					<Item stackedLabel>
						<Label>Date</Label>
						<DatePicker
							defaultDate={new Date()}
							//minimumDate={new Date(2001, 1, 1)}
							//maximumDate={new Date(2020, 12, 31)}
							locale={"en"}
							timeZoneOffsetInMinutes={undefined}
							modalTransparent={false}
							animationType="fade"
							androidMode={"default"}
							placeHolderText={moment(new Date()).format('YYYY-MM-DD')}
							textStyle={{ color: "green" }}
							placeHolderTextStyle={{ color: "green" }}
							onDateChange={newDate => this.setState({ date: newDate })}
							formatChosenDate={date => moment(date).format('YYYY-MM-DD')}
							disabled={false}
						/>
					</Item>

					<Item stackedLabel>
						<Label>Category</Label>
						<Picker
							mode="dropdown"
							iosIcon={<Icon name="arrow-down" />}
							style={{ width: undefined }}
							placeholder="Select a category"
							placeholderStyle={{ color: "#bfc6ea" }}
							placeholderIconColor="#007aff"
							selectedValue={this.state.category}
							onValueChange={selected => this.setState({ category: selected })}
						>
							{this.state.buttonToggle === 0 ?
								Object.values(this.props.container.state.moneyCategories)
									.map((item, index) =>
										<Picker.Item label={item} value={item} key={index} />
									)
								:
								Object.values(this.props.container.state.timeCategories)
									.map((item, index) =>
										<Picker.Item label={item} value={item} key={index} />
									)
							}
						</Picker>
					</Item>

					<Item stackedLabel>
						<Label>Amount</Label>
						<Input
							style={{ textAlign: 'center' }}
							onChangeText={text => this.setState({
								amount: text,
							})}
							value={this.state.amount}
						/>
					</Item>

					<Item stackedLabel>
						<Label>Remark</Label>
						<Input
							style={{ textAlign: 'center' }}
							onChangeText={text => this.setState({
								remark: text,
							})}
							value={this.state.remark}
						/>
					</Item>
				</Form>

				<TouchableOpacity
					style={styles.addExpenseButton}
					onPress={() => this.onAddExpense()}
				>
					<Text style={styles.text}> Add expense </Text>
				</TouchableOpacity>

			</View>
		)
	}

}

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
	},

	text2: {
		textAlign: 'center',
		fontSize: 20,
		marginTop: 30,
	},

	datePickerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	categoryPicker: {
		height: 100,
		width: 200,
		margin: 5,
	},
	categoryPickerContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	button: {
		padding: 5,
		marginVertical: 20,
		marginHorizontal: 10,
		borderRadius: 5,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},

	addExpenseButton: {
		backgroundColor: 'rgba(30,30,30,0.3)',
		padding: 5,
		marginVertical: 10,
		marginHorizontal: 70,
		borderRadius: 5,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},

});

// The methods in the container must be used inside <Subscribe>
const RecordWrapper = () => (
	<Subscribe to={[AppContainer]}>
		{container => <RecordScreen container={container} />}
	</Subscribe>
)
export default RecordWrapper
