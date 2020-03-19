import React, { useState, useEffect } from 'react';
import { Text, View, Picker } from 'react-native';
import { DatePicker } from 'native-base';
import moment from "moment";
import AppContainer from './Container';
import { Subscribe } from 'unstated'
import DailyLineChart from './DailyLineChart';
import { useIsFocused } from '@react-navigation/native';

const DailyReportScreenMoney = ({ container }) => {

	const isFocused = useIsFocused();
	const [categorySelected, setCategory] = useState('Daily total')
	const [lowerDate, setLowerDate] = useState(moment(new Date()).add(-28, 'days').format('YYYY-MM-DD'))
	const [upperDate, setUpperDate] = useState(moment(new Date()).add(0, 'days').format('YYYY-MM-DD'))

	// initial trigger [] is included	
	useEffect(() => {
		isFocused && container.getDailyExpenses("Money", categorySelected, lowerDate, upperDate)
	},
		[isFocused, categorySelected, lowerDate, upperDate])

	let labelArray = container.state.dailyExpenses_dates.length !== 0
		? container.state.dailyExpenses_dates.map(date => moment(date).format('MMM-DD'))
		: ["NA"]
	let dataArray = container.state.dailyExpenses_amounts.length !== 0
		? container.state.dailyExpenses_amounts
		: [0]
	let remarkArray = container.state.dailyExpenses_remarks.length !== 0
		? container.state.dailyExpenses_remarks
		: [""]

		
	return (
		<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>

			<View style={{ marginTop: 5 }}>
				<Picker
					style={{ height: 90, width: 200 }}
					itemStyle={{ height: 70 }}
					selectedValue={categorySelected}
					onValueChange={category => setCategory(category)}
				>
					<Picker.Item label="Daily total" value="Daily total" />
					{container.state.moneyCategories.map((category, index) => (
						<Picker.Item label={category} value={category} key={index} />
					))}
				</Picker>
			</View>

			<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
				<Text>From</Text>
				<DatePicker
					defaultDate={new Date()}
					locale={"en"}
					timeZoneOffsetInMinutes={undefined}
					modalTransparent={false}
					animationType={"fade"}
					androidMode={"default"}
					placeHolderText={moment(new Date()).add(-28, 'days').format('YYYY-MM-DD')}
					textStyle={{ color: "green" }}
					placeHolderTextStyle={{ color: "green" }}
					formatChosenDate={date => moment(date).format('YYYY-MM-DD')}
					onDateChange={newDate => setLowerDate(moment(newDate).format("YYYY-MM-DD"))}
					disabled={false}
				/>
				<Text>To</Text>
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
					onDateChange={newDate => setUpperDate(moment(newDate).format("YYYY-MM-DD"))}
					disabled={false}
				/>
			</View>

			<View style={{ marginTop: 10 }}>
				<Text style={{ fontSize: 20, color: "darkorange" }}>
					Subtotal over the period = {
						container.state.dailyExpenses_amounts.length !== 0 ?
							container.state.dailyExpenses_amounts.reduce((a, b) => a + b) :
							0
					} {container.state.money_currency} </Text>
			</View>

			<DailyLineChart
				categorySelected={categorySelected}
				chartLabels={labelArray}
				chartDatasets={dataArray}
				chartRemarks={remarkArray}
				chartUnit={container.state.money_currency}
			/>

		</View>
	)
}

// The methods in the Container must be used inside <Subscribe>
const DailyReportMoneyWrapper = () => (
	<Subscribe to={[AppContainer]}>
		{container => <DailyReportScreenMoney container={container} />}
	</Subscribe>
)

export default DailyReportMoneyWrapper