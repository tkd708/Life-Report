import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit'

import moment from "moment";

const DailyLineChart = ({ categorySelected, chartLabels, chartDatasets, chartRemarks, chartUnit }) => {

    const [toolTipVisible, setToolTipVisible] = useState(false)
    const [toolTipPoint, setToolTipPoint] = useState({ x: "", y: "", value: "" })

    useEffect(() => {
        setToolTipVisible(false);
    }, [categorySelected])

    const Tooltip = (props) => {
        if (props.visible) {
            return (
                <View style={{
                    marginVertical: 'auto',
                    marginHorizontal: 'auto',
                    backgroundColor: 'rgba(35, 24, 21, 1)',
                    padding: 5,
                    width: Math.max(...props.point.value.map(e => e.length)) == 0
                    ? 0
                    : Math.max(50, 8 * Math.max(...props.point.value.map(e => e.length))),
                    //height: 25,
                    top: props.point.y - 25,
                    left: props.point.x - 8 * Math.max(...props.point.value.map(e => e.length)) / 2,
                }}
                >
                    {props.point.value.filter(e => e.length > 0).map((item, index) => {
                        return (
                            <Text style={{
                                color: 'rgba(255, 255, 255, 1)',
                                fontSize: 11,
                                textAlign: 'center',
                                key: index
                            }}>
                                {item}
                            </Text>
                        )
                    })}
                </View >
            );
        } else {
            return null;
        }
    }


    return (
        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }} >
            <LineChart
                data={{
                    labels: chartLabels,
                    datasets: [{
                        data: chartDatasets,
                        remarks: chartRemarks,
                        strokeWidth: 2,
                    }],
                }}
                onDataPointClick={(data) => {
                    if (toolTipVisible && data.x === toolTipPoint.x && data.y === toolTipPoint.y) {
                        setToolTipVisible(false);
                        return;
                    }
                    setToolTipPoint({
                        x: data.x,
                        y: data.y,
                        value: data.dataset.remarks[data.index],
                    })
                    setToolTipVisible(true);
                }}
                decorator={(data) => {
                    return (
                        <Tooltip point={{
                            x: toolTipPoint.x,
                            y: toolTipPoint.y,
                            value: toolTipPoint.value
                        }}
                            visible={toolTipVisible}
                        />
                    )
                }}
                width={Dimensions.get('window').width - 50}
                height={Dimensions.get('window').height / 2}
                fromZero={1}
                yAxisLabel={chartUnit!='hours' ? chartUnit + ' ' : ''}
                yAxisSuffix={chartUnit=='hours' ? ' ' + chartUnit : ''}
                verticalLabelRotation={45}
                chartConfig={{
                    //fillShadowGradient: '#fff'
                    //backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientFromOpacity: 0,	
                    backgroundGradientTo: '#fff',
                    backgroundGradientToOpacity: 0,
                    decimalPlaces: 0,
                    color: (opacity = 0.5) => `rgba(10, 10, 10, ${opacity})`,
                    style: {
                        borderRadius: 5,
                    },
                }}
                style={{
                    marginVertical: 10,
                    borderRadius: 5,
                }}
            />
        </View>
    )

}

export default DailyLineChart