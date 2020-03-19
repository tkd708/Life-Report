import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit'
import AppContainer from './Container';
import { Subscribe } from 'unstated'


const { width, height } = Dimensions.get('window');

class TodayReportScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		this.props.container.getExpensesMoneyToday();
		this.props.container.getExpensesTimeToday()
	}


	renderBarChart() {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
				<BarChart
					data={{
						labels: this.props.container.state.money_today_category,
						datasets: [{
							data: this.props.container.state.money_today_amount
						}]
					}}
					width={width - 10}
					height={height / 2}
					yAxisLabel={this.props.container.state.money_currency + ' '}
					fromZero={1}
					verticalLabelRotation={45}
					backgroundColor='rgb(230, 230, 230)'
					chartConfig={{
						backgroundGradientFrom: '#eff3ff',
						backgroundGradientTo: '#efefef',
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
					}}
					style={{
						paddingVertical: 10,
						borderRadius: 10,
					}}
				/>
			</View>
		)
	}


	renderPieChart() {
		const time_today_data = [];
		const colorList = [
			'rgb(210, 40, 50)', 'rgb(255, 128, 0)', 'rgb(255, 255, 0)', 'rgb(128, 255, 0)', 'rgb(0, 255, 255)', 'rgb(0, 128, 255)',
			'rgb(128, 0, 255)', 'rgb(255, 0, 255)', 'rgb(255, 0, 128)', 'rgb(50, 255, 255)', 'rgb(255, 200, 100)', 'rgb(255, 200, 200)'
		]
		for (let i = 0; i < this.props.container.state.time_today_category.length; i++) {
			time_today_data.push(
				{
					name: this.props.container.state.time_today_category[i],
					hour: Number(this.props.container.state.time_today_amount[i]),
					color: colorList[i], legendFontColor: '#7F7F7F', legendFontSize: 12
				}
			);
		};
		time_today_data.push(
			{
				name: "Uncounted",
				hour: this.props.container.state.time_today_uncounted,
				color: 'rgb(128, 128, 128)', legendFontColor: '#7F7F7F', legendFontSize: 12
			}
		);

		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
				<PieChart
					data={time_today_data}
					width={width - 10}
					height={height / 2 - 50}
					chartConfig={{
						backgroundColor: 'transparent',
						backgroundGradientFrom: '#eff3ff',
						backgroundGradientTo: '#efefef',
						color: (opacity = 1) => `rgba(230, 230, 230, ${opacity})`,
					}}
					backgroundColor='rgb(230, 230, 235)'
					paddingLeft='25'
					accessor="hour"
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						marginVertical: 10,
						borderRadius: 10,
					}}

				/>
			</View>
		)
	}



	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'column' }}>

				<ScrollView>

					{this.renderBarChart()}

					{this.renderPieChart()}

				</ScrollView>
			</View>
		)
	}
}

// The methods in the Container must be used inside <Subscribe>
const TodayReportWrapper = () => (
	<Subscribe to={[AppContainer]}>
		{container => <TodayReportScreen container={container} />}
	</Subscribe>
)

export default TodayReportWrapper