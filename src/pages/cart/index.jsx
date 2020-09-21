import React, { Component, createRef } from 'react';
import Header from '../../components/Header'
import {connect} from 'react-redux'
import Axios from 'axios'
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import Notfound from './../notfound'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import ButtonUi from './../../components/button'
import {Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import {AddcartAction} from './../../redux/Actions'
import {MdDeleteForever} from 'react-icons/md'
import {BiEdit} from 'react-icons/bi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class Cart extends Component {
    state = {
        cart:[],
        isOpen:false,
        pilihan:0,
        bukti:createRef(),
        cc:createRef()
    }

    
    componentDidMount(){
        // Axios.get(`${API_URL}/carts?userId=${this.props.id}&_expand=product`)
        console.log(this.props.id)
        Axios.get(`${API_URL}/carts`,{
            params:{
                userId:this.props.id,
                _expand:'product'
            }
        })
        .then((res)=>{
            console.log(res.data)
            this.setState({cart:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    Ondelclick=(index, id)=>{
        MySwal.fire({
          title: `Are you sure want to delete ? ${this.state.cart[index].product.namatrip}`,
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            Axios.delete(`${API_URL}/carts/${id}`)
            .then((res)=>{
                Axios.get(`${API_URL}/carts`,{
                    params:{
                        userId:this.props.id,
                        _expand:'product'
                    }
                })
                .then((res)=>{
                    console.log(res.data)
                    MySwal.fire(
                      'Deleted!',
                      'Your file has been deleted.',
                      'success'
                    )
                    this.setState({cart:res.data})
                }).catch((err)=>{
                    console.log(err)
                })
              window.location.reload()
            }).catch((err)=>{
              console.log(err)
            })
          }
        })
      }

    renderTotalHarga=()=>{
        var total=this.state.cart.reduce((total,num)=>{
            return total+(num.product.harga*num.qty)
        },0)
        return total
    }

    renderCart=()=>{
        return this.state.cart.map((val,index)=>{
            return(
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.product.namatrip}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'200px'}}>
                            <img width='100%' height='100%' src={val.product.gambar} alt={val.product.namatrip}/>
                        </div>
                    </TableCell>
                    <TableCell>{val.qty}</TableCell>
                    <TableCell>{priceFormatter(val.product.harga)}</TableCell>
                    <TableCell>{priceFormatter(val.product.harga*val.qty)}</TableCell>
                    <TableCell>
                        <span style={{fontSize:30}} onClick={()=>this.Ondelclick(index, val.id)} className='text-danger mr-3'><MdDeleteForever/></span>
                        <span style={{fontSize:30}}  className='text-primary ml-3'><BiEdit/></span>  
                    </TableCell>
                </TableRow>
            )
        })
    }

    // transaction itu ada id,status,userId,tanggalpembayaran,metode,buktipembayaran,
    // transactionDetails id,transactionId,productId,price,qty
    onBayarClick=()=>{
        const {pilihan} =this.state
        if(pilihan==='1'){
            this.onbayarpakebukti()
        }else if(pilihan==='2'){
            this.onbayarpakeCC()
        }else{
            alert('pilih dulu tipe pembayarannya bro')
        }
    }
    onbayarpakeCC=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status:'Completed',
            userId:this.props.id,
            tanggalPembayaran:new Date().getTime(),
            metode:'cc',
            buktipembayaran:this.state.cc.current.value
        }).then((res)=>{
            var arr=[]
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
                    transactionId:res.data.id,
                    productId:val.productId,
                    price: parseInt(val.product.harga),
                    qty:val.qty
                }))
            })
            Axios.all(arr).then((res1)=>{
                var deletearr=[]
                this.state.cart.forEach((val)=>{
                    deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deletearr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId:this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        console.log(res3.data)
                        this.props.AddcartAction([])
                        this.setState({cart:res3.data,isOpen:false})
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((Err)=>{
                    console.log(Err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{

        })
    }
    onbayarpakebukti=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status:'WaitingAdmin',
            userId:this.props.id,
            tanggalPembayaran:new Date().getTime(),
            metode:'upload',
            buktipembayaran:this.state.bukti.current.value
        }).then((res)=>{
            var arr=[]
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
                    transactionId:res.data.id,
                    productId:val.productId,
                    price: parseInt(val.product.harga),
                    qty:val.qty
                }))
            })
            Axios.all(arr).then((res1)=>{
                var deletearr=[]
                this.state.cart.forEach((val)=>{
                    deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deletearr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId:this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        console.log(res3.data)
                        this.props.AddcartAction([])
                        this.setState({cart:res3.data,isOpen:false})
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((Err)=>{
                    console.log(Err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{

        })
    }
    onCheckOutClick=()=>{
        this.setState({isOpen:true})
        // Axios.post(`${API_URL}/transactions`,{
        //     status:'WaitingPayment',
        //     checkoutDate:new Date().getTime(),
        //     userId:this.props.id,
        //     tanggalPembayaran:''
        // }).then((res)=>{
        //     var arr=[]
        //     this.state.cart.forEach((val)=>{
        //         arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
        //             transactionId:res.data.id,
        //             productId:val.productId,
        //             price: parseInt(val.product.harga),
        //             qty:val.qty
        //         }))
        //     })
        //     Axios.all(arr).then((res1)=>{
        //         var deletearr=[]
        //         this.state.cart.forEach((val)=>{
        //             deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
        //         })
        //         Axios.all(deletearr)
        //         .then(()=>{
        //             Axios.get(`${API_URL}/carts`,{
        //                 params:{
        //                     userId:this.props.id,
        //                     _expand:'product'
        //                 }
        //             })
        //             .then((res3)=>{
        //                 console.log(res3.data)
        //                 this.setState({cart:res3.data})
        //             }).catch((err)=>{
        //                 console.log(err)
        //             })
        //         }).catch((Err)=>{
        //             console.log(Err)
        //         })
        //     }).catch((err)=>{
        //         console.log(err)
        //     })
        // }).catch((err)=>{

        // })
    }

    render() {
        if(this.props.role==='user') {
            return (
                <div>
                    <Modal isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:false})}>
                        <ModalHeader toggle={()=>this.setState({isOpen:false})}>Pembayaran</ModalHeader>
                        <ModalBody>
                            <select onChange={(e)=>this.setState({pilihan:e.target.value})} className='form-control' defaultValue={0} >
                                <option value="0" hidden>Select payment</option>
                                <option value="1">Via transfer</option>
                                <option value="2"> Via Credit card</option>
                            </select>
                            {
                                this.state.pilihan==2?
                                <input className='form-control' ref={this.state.cc} placeholder='masukkan cc'/>
                                :
                                this.state.pilihan==1?
                                <input className='form-control' ref={this.state.bukti}  placeholder='input bukti pembayaran'/>
                                :
                                null
                            }
                            <div>
                              Total Harga  {priceFormatter(this.renderTotalHarga())}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonUi onClick={this.onBayarClick}>
                                Bayar
                            </ButtonUi>
                        </ModalFooter>
                    </Modal>
                    <Header/>
                    <div className=' pt-3' style={{paddingLeft:'10%',paddingRight:'10%'}}>
                        <Paper >
                            <TableContainer >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell style={{width:'200px'}}>Nama Trip</TableCell>
                                            <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                            <TableCell>Jumlah</TableCell>
                                            <TableCell>Harga</TableCell>
                                            <TableCell>subtotal Harga</TableCell>
                                            <TableCell >action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderCart()}
                                    </TableBody>
                                    <TableFooter>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell style={{fontWeight:'700',color:'black',fontSize:20}}>Subtotal Harga</TableCell>
                                        <TableCell style={{color:'black',fontSize:20}}>{priceFormatter(this.renderTotalHarga())}</TableCell>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            <ButtonUi onClick={this.onCheckOutClick}  className='my-3' >
                                CheckOut
                            </ButtonUi>
                        </Paper>
                    </div>
                </div>
            );
        }else{
            return(
                <Notfound/>
            )
        }
    }
}
const MapstatetoProps=({Auth})=>{
    return {
        ...Auth
    }
}
export default connect(MapstatetoProps,{AddcartAction})(Cart);