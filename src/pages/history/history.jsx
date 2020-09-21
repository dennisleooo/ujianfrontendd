import React, { Component } from 'react';
import Header from '../../components/Header'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios'
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import {connect} from 'react-redux'

class History extends Component {
    state = { 
        history : [],
     }
    
     componentDidMount(){
         Axios.get(`${API_URL}/transactions`,{
             params:{
                 userId: this.props.id,
                 _embed: 'transactionsdetails'
             }
         })
         .then((res)=>{
             console.log(res.data.length)
             console.log(res.data)
             this.setState({history:res.data})
         }).catch((err)=>{
             console.log(err)
         })
     }

    rendertotalharga=(arr)=>{
        var total= arr.reduce((total, num)=>{
            return total + num.price
        },0)
        
        return total
    }

    renderhistory=()=>{
        return this.state.history.map((val)=>{
            return (
                <TableRow key={val.id}>
                    <TableCell>{val.id}</TableCell>
                    <TableCell>{priceFormatter(this.rendertotalharga(val.transactionsdetails))}</TableCell>
                    <TableCell>{val.metode}</TableCell>
                    <TableCell>{val.status}</TableCell>
                </TableRow>        
            )
        })
    }

    render() { 
        return ( 
            <div>
                <Header/>
                    <div className=' d-flex justify-content-center align-items-center mt-3' >
                        <h1>History Pembelian {this.props.username}</h1>
                    </div>
                    <div className=' pt-3' style={{paddingLeft:'10%',paddingRight:'10%'}}>
                        <TableContainer >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id.Pembelian</TableCell>
                                        <TableCell>Total Pembayaran</TableCell>
                                        <TableCell>Metode pembayaran</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderhistory()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
            </div>
         );
    }
}

 
const MapstatetoProps=({Auth})=>{
    return {
      ...Auth
    }
  }
  export default connect(MapstatetoProps) (History);