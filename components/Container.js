import { Container } from 'unstated' // Container... store & actions
import * as SQLite from 'expo-sqlite';
import moment from "moment";

const LifeReport = SQLite.openDatabase('LifeReport')

export default class AppContainer extends Container {
	constructor(props) {
		super(props);
		this.state = {
			moneyCategories: ["Set your categories"],
			timeCategories: ["Set your categories"],
			allExpenses: [],
			money_today_category: [],
			money_today_amount: [],
			money_currency: "Set a currency",
			time_today_category: [],
			time_today_amount: [],
			time_today_uncounted: 24,
			daily_typeSelected: "Money",
			daily_selectedCategory: "Daily total",
			daily_lowerDate: moment(new Date()).add(-28, 'days').format('YYYY-MM-DD'),
			daily_upperDate: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
			dailyExpenses_dates: [],
			dailyExpenses_amounts: [],
			dailyExpenses_remarks: [],
		};
	}



	queryTableInfo() {
		LifeReport.transaction(tx => {
			tx.executeSql("PRAGMA table_info('expenses');"); // query for table into
			[],
				(res) => { console.log(res); }
		},
			(e) => { console.log('fail table info') },
			(e) => { console.log('success table info') }
		);
	}


	updateCurrency = () => {
		LifeReport.transaction(tx => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS currency (" +
				"Currency text" +
				");",
				null,
				LifeReport.transaction(tx => {
					tx.executeSql(
						"SELECT Currency " +
						"FROM currency " +
						";",
						[],
						(_, { rows: { _array } }) => {
							this.setState({ money_currency: _array.slice(-1)[0].Currency });
						}
					),
						(e) => { console.log('fail to update currency' + e) }
				},
					(e) => { console.log(e) },
					() => { console.log('success update currency') }
				),
				(e) => { console.log('fail table establish' + e) }
			)
		});
	};


	updateCategories = () => {
		LifeReport.transaction(tx => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS categories (" +
				"Type text," +
				"Category text" +
				");",
				null,
				LifeReport.transaction(tx => {
					tx.executeSql(
						"SELECT Type, Category " +
						"FROM categories " +
						";",
						[],
						(_, { rows: { _array } }) => {
							const moneyCategories = _array.filter(e => { return e.Type === "Money" }).map(e => e.Category);
							this.setState({ moneyCategories: moneyCategories });
							const timeCategories = _array.filter(e => { return e.Type === "Time" }).map(e => e.Category);
							this.setState({ timeCategories: timeCategories });
						}
					),
						(e) => { console.log('fail to update category') }
				},
					(e) => { console.log(e) },
					() => { console.log('success update category') }
				),
				(e) => { console.log('fail table establish') }
			)
		});
	};


	onDoneAddExpense = (id, date, type, category, amount, remark) => {
		if (amount !== '') {

			LifeReport.transaction(tx => {
				tx.executeSql(
					"INSERT INTO expenses" +
					"(ID, Date, Type, Category, Amount, Remark) " +
					"VALUES (?, ?, ?, ?, ?, ?);",
					[id, date, type, category, amount, remark]
				);
			},
				() => { console.log('fail') }, // 失敗時のコールバック関数
				() => { // 成功時のコールバック関数
					console.log('add_record_success')
					this.updateExpenses(),
					this.getExpensesMoneyToday(),
					this.getExpensesTimeToday()
					this.getDailyExpenses(type, category, moment(new Date()).add(-28, 'days').format('YYYY-MM-DD'), moment(new Date()).add(0, 'days').format('YYYY-MM-DD'));
				},

			);
		}
	};


	// database.transaction >> only the first one is atually executed!!! you might need to nest if you want several!!! 
	updateExpenses() {
		LifeReport.transaction(tx => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS expenses (" +
				"ID text primary key not null," +
				"Date text," +
				"Type text," +
				"Category text," +
				"Amount integer," +
				"Remark text" +
				");"
			);
		},
			() => { console.log('fail') },
			() => { console.log('success_tableCheck') }
		);

		LifeReport.transaction(tx => {
			tx.executeSql(
				'SELECT * FROM expenses;',
				[],
				(_, { rows: { _array } }) => this.setState({ allExpenses: _array })
			);
		},
			() => { console.log('fail') },
			() => { console.log('success_fetchAllData') }
		);
	}

	getExpensesMoneyToday() {
		LifeReport.transaction(tx => {
			tx.executeSql(
				"SELECT Category, SUM(Amount) Subtotal " +
				"FROM expenses " +
				"WHERE Type = 'Money' AND Date = ? " +
				"GROUP BY Category " +
				";",
				[moment(new Date()).format("YYYY-MM-DD")],
				(_, { rows: { _array } }) => {
					this.setState({
						money_today_category: _array.map(x => x.Category),
						money_today_amount: _array.map(x => x.Subtotal)
					})
				}
			);
		},
			() => { console.log('fail') },
			() => { console.log('success_money_today') }
		);
	}


	getExpensesTimeToday() {
		LifeReport.transaction(tx => {
			tx.executeSql(
				"SELECT Category, SUM(Amount) Subtotal " +
				"FROM expenses " +
				"WHERE Type = 'Time' AND Date = ? " +
				"GROUP BY Category " +
				";",
				[moment(new Date()).format("YYYY-MM-DD")],
				(_, { rows: { _array } }) => {
					this.setState({
						time_today_category: _array.map(x => x.Category),
						time_today_amount: _array.map(x => x.Subtotal),
					})
				}
			);
		},
			() => { console.log('fail') },
			() => {
				console.log('success_time_today'),
					this.setState({
						time_today_uncounted:
							this.state.time_today_amount.length === 0 ?
								24 :
								24 - this.state.time_today_amount.reduce((a, b) => a + b)
					})
			}
		);
	}


	getDailyExpenses(type, category, lowerDate, upperDate) {
		if (type == "Money" && category == "Daily total") {
			LifeReport.transaction(tx => {
				tx.executeSql(
					"SELECT Date, SUM(Amount) DailyTotal " + // SUM() Variable_name
					"FROM expenses " +
					"WHERE Type = 'Money' AND Date BETWEEN ? AND ? " +
					"GROUP BY Date " +
					";",
					[lowerDate, upperDate],
					(_, { rows: { _array } }) => {
						this.setState({
							dailyExpenses_dates: _array.map(x => x.Date),
							dailyExpenses_amounts: _array.map(x => x.DailyTotal),
							dailyExpenses_remarks: _array.map(x => [String(x.DailyTotal)])
						})
					}
				)
			},
				() => { console.log('fail') },
				() => { console.log('success_daily_money_total') }
			)
		} else {
			LifeReport.transaction(tx => {
				tx.executeSql(
					"SELECT Date, SUM(Amount) Subtotal, GROUP_CONCAT(Remark, ',') AS Remarks " + // SUM() Variable_name
					"FROM expenses " +
					"WHERE Type = ? AND Category = ? AND Date BETWEEN ? AND ? " +
					"GROUP BY Date " +
					";",
					[type, category, lowerDate, upperDate],
					(_, { rows: { _array } }) => {
						this.setState({
							dailyExpenses_dates: _array.map(x => x.Date),
							dailyExpenses_amounts: _array.map(x => x.Subtotal),
							dailyExpenses_remarks: _array.map(x => x.Remarks.split(','))
						});
					}
				)
			},
				() => { console.log('fail') },
				() => { console.log('success_daily_money') }
			)
		}
	}



	deleteExpense(dateDelete, typeDelete, categoryDelete) {
		LifeReport.transaction(tx => {
			tx.executeSql(
				"DELETE FROM expenses " +
				"WHERE Date = ? AND Type = ? AND Category = ? ;",
				[dateDelete, typeDelete, categoryDelete]
			);
		},
			() => { console.log('fail to delete an expense') },
			() => {
				console.log('delete expense success');
				this.updateExpenses();
				this.getExpensesMoneyToday();
				this.getExpensesTimeToday();
				this.getDailyExpenses();
			},
		);
	}


	deleteAllExpenses() {
		LifeReport.transaction(tx =>
			tx.executeSql('DROP TABLE IF EXISTS expenses;'),   // remove the dataset
			(e) => { console.log('fail' + e); console.warn(e) },
			() => { console.log('success_deleteTable') }
		);
	}

}