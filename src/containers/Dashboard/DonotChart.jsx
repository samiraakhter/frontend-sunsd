import {Component} from 'react';
import React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import Axios from 'axios';

import {
  Chart,
  ChartTitle,
  ChartTooltip,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels
} from '@progress/kendo-react-charts';

class Charts extends Component {
state = {
  Product: [],
  Inventory: [],
  visible: true,
  productInEdit: undefined,
}
  componentDidMount()
  {
    Axios.get("http://localhost:64883/api/Inventory")
    .then((response) => {
      return response.data;
    })
    .then(data => {
        
      let dataFromApi = data.Data.map(x => { return {value: x.Product.Id, display: x.Product.ProductName, Instock: x.Product.Instock, MinimumStockLevel: x.MinimumStockLevel} })
      this.setState({  Product: dataFromApi});
      console.log(this.state.Product);
      console.log(this.state.Inventory);
  }).catch(error => {
      console.log(error);
    });
   
  }

//   toggleDialog = () => {
   

// }
changeHandler = (event,product) => {
  
 let item = product.Instock;
 let itemId = product.value;
  this.setState({
    productInEdit:item,
    visible: !this.state.visible,

});
console.log(item,itemId);
console.log(product);
Axios({
  url: 'http://localhost:64883/api/Product/UpdateStock',
  method: 'POST',
  params: { id: itemId , Instocks: item } ,
  // data: item,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  }
})
.then((response) => {
  return response.data;
  
})
.then(data => {
 
  alert(this.name+ " Restocked");
  //this.popUpNotificationWidget.show('success');
  
});

}
handleToogle = () => {
  this.setState({
    visible: !this.state.visible,

});
}

  render() {

    
    const Instocks = this.state.Product.map(x => x.Instock);
    const MinimumStockLevels = this.state.Product.map(x => x.MinimumStockLevel);
    const Name = this.state.Product.map(x => x.display);
    const product = this.state.Product;

      console.log(Instocks,MinimumStockLevels) 
    
    for (let index = 0; index < Instocks.length; index++) {
      if(Instocks[index] < MinimumStockLevels[index])
      {
        console.log(Name[index]+" restock");
          return (
          <div>
           {this.state.visible && <Dialog  title={"Restock"}onClose={this.handleToogle} width={200} height={250} >
                        <p style={{ margin: "25px", textAlign: "center" }}>{"Restock "+Name[index] }</p>
                        <DialogActionsBar>
                            <button className="k-button k-primary" onClick={(event) => this.changeHandler(event, product[index])}>Restock?</button>
                        </DialogActionsBar>
                    </Dialog>}
          </div>
          );
          }
    }
    const labelContent = (e) => (`${ e.category }: \n ${e.value} unit(s)`);
    
    const renderTooltip = (context) => {
        const { category, series, value } = context.point || context;
        return (<div>{category} {series.display}: {value}unit(s)</div>);
    };
    

    return (

      
      <Chart>
      <ChartTitle text="Products Available in Stock" />
      <ChartTooltip render={renderTooltip} />
      <ChartSeries>
        <ChartSeriesItem type="donut" data={this.state.Product} categoryField="display" field="Instock"  startAngle={150}>
          <ChartSeriesLabels  background="none" content={labelContent}   position="outsideEnd" />
        </ChartSeriesItem>
      </ChartSeries>
      <ChartLegend visible={false} />
    </Chart>

    );
  }
  cloneProduct(product) {
    return Object.assign({}, product);
}
}
export default  Charts;