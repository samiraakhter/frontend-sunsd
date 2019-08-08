import React, { Component } from 'react';
import 'hammerjs';
import Axios from 'axios';

import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartValueAxis,
  ChartValueAxisItem
} from '@progress/kendo-react-charts';

import { barChartQ4Months, barChartMonthlyPercentages } from './data.js';

class BarChartContainer extends Component {
    state = {
      Product: [],
      Date: [],
    }

    componentDidMount()
    {
      Axios.get("http://localhost:64883/api/OrderLines")
      .then((response) => {
        return response.data;
      })
      .then(data => {
          
        let dataFromApi = data.Data.map(x => { return {value: x.Quantity, display: x.Product.ProductName,date: x.Order.OrderDate} })
        this.setState({  Product: dataFromApi});
        console.log(this.state.Product);
       
    }).catch(error => {
        console.log(error);
      });
     
    }
    render() {
        return (
            <div >
  <Chart style={{ height: 288 }}>
    <ChartLegend visible={false} />
    <ChartCategoryAxis>
      <ChartCategoryAxisItem categories={barChartQ4Months} startAngle={45} />
    </ChartCategoryAxis>
    <ChartSeries>
      {
        barChartMonthlyPercentages.map((item, idx) => (
          <ChartSeriesItem key={idx} type="column" data={item.data} name={item.name} gap={2}/>
        ))}
    </ChartSeries>
    <ChartValueAxis skip={4}>
      <ChartValueAxisItem color="#888" skip={2} />
    </ChartValueAxis>
  </Chart>
  </div>
);
}
cloneProduct(product) {
  return Object.assign({}, product);
}
}
export default  BarChartContainer;
