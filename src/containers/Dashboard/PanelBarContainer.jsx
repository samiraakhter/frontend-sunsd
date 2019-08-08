import React ,{Component} from 'react';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import Axios from 'axios';
import classes from './PanelBarContainer.css';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@progress/kendo-react-layout';



const imageUrl = (imageName) => ('img/'+ imageName +'.jpg');


class PanelBarContainer extends Component {
    state = {
        Users:[]
    }
    componentDidMount() {
        let token = localStorage.getItem('token');
        Axios.get("http://localhost:64883/api/Product/Users", { headers: {"Authorization" : `Bearer ${token}`} })
          .then((response) => {
            return response.data;
          })
          .then(data => {

            let dataFromApi = data.Data.map(x => { return {value: x.Id, Username: x.Username, firstName:x.FirstName , lastName:x.LastName ,position:x.Role.RoleName} })
            this.setState({  Users: dataFromApi });
            

        }).catch(error => {
            console.log(error);
          });
        }
    render()
    {
        return (
            <PanelBar >
    <PanelBarItem expanded={true} title="My Teammates">
      <div>
        {this.state.Users.map((item, idx) => (
          <div className={idx === 0 ? classes.teammate : classes.teammate} id={item.firstName + ' ' + item.lastName} key={idx}>
            <img src={imageUrl(item.firstName)} alt={item.firstName + ' ' + item.lastName} />
            <span className={classes.mateinfo}>
              <h2>{item.firstName + ' ' + item.lastName}</h2>
              <p>{item.position}</p>
            </span>
          </div>
        ))}
      </div>
    </PanelBarItem>
    <PanelBarItem title={'Projects'} >
        
      <Menu vertical={true} onSelect={this.onSelect}>
                    <MenuItem text="Home" data={{ route: '/' }} />
                    <MenuItem text="Create Users" data={{ route: '/register' }} />
                    <MenuItem text="Customer Routes" data={{ route: '/route' }}>
                    <MenuItem text="Add Route" data={{ route: '/addroute' }} />
                    </MenuItem>
                    <MenuItem text="Products" data={{ route: '/product' }} >
                    <MenuItem text="Create New Product" data={{ route: '/addproduct' }} />
                    </MenuItem>

                    <MenuItem text="Customer" data={{ route: '/addcustomer' }}>
                        {/* <MenuItem text="Team" data={{ route: '/about/team' }} /> */}
                    </MenuItem>
                    <MenuItem text="Inventory" data={{ route: '/inventory' }} >
                    <MenuItem text="Create New Inventory Item" data={{ route: '/additem' }} />
                    </MenuItem>
                    <MenuItem text="Customer Orders" data={{ route: '/orders' }} />
                </Menu>
                    </PanelBarItem >
   
    <PanelBarItem title="Communication" disabled={true} />
  </PanelBar>

        );
       
    }
    onSelect = (event) => {
      this.props.history.push(event.item.data.route);
  }
}

export default withRouter(PanelBarContainer);
