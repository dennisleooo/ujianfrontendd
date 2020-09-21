import React, { Component,createRef } from 'react';
import Foto from './../../assets/Homescreen.webp'
import { withStyles } from '@material-ui/core/styles';
import Axios from 'axios'
import TextField from '@material-ui/core/TextField';
import {API_URL} from './../../helpers/idrformat'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {Clearfunc} from './../../redux/Actions'

const Styles={
    root:{
        'input': {
            '&::placeholder': {
           
              color: 'blue'
            },
        },

        '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'yellow',
          },
          '& .MuiOutlinedInput-root': {
    
            '& fieldset': {
              borderColor: 'white',
              color:'white'
            },
            '&:hover fieldset': {
              borderColor: 'white',
              color:'white'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
              border:'3px solid ',
              color:'white'
            },
          },
    }
}

class Register extends Component {
    state = {
        username:createRef(),
        password:createRef(),
        repassword:createRef(),
        alert:''
    }

    onRegisterclick=()=>{
        var {username,password,repassword} = this.state
        var role = "user"
        var username = username.current.value
        var password = password.current.value
        var repassword = repassword.current.value
        var adduser ={username,password,role}
        if(username === '' || password === '' || repassword === ''){
            alert('data kosong')
        }else{
            Axios.get(`${API_URL}/users?username=${username}`)
            .then((res)=>{
                console.log(res.data)
                if(res.data.length === 0){
                    if(password !== repassword){
                        alert('masukin yang bener')
                    }else{
                        Axios.post(`${API_URL}/users`,adduser)
                        .then((res1)=>{
                            alert('berhasil regist')
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                }else{
                    alert('username sudah ada')
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
    render() {
        const {classes}=this.props 
        return ( 
            <div className='row m-0 p-0'>
                <div className='col-md-6 m-0 p-0' style={{height:'100vh'}} >
                    <img width='100%' height='100%' style={{objectFit:'cover'}} src={Foto} alt={'foto'}/>
                </div>
                <div className='col-md-6 m-0 p-0 d-flex justify-content-center align-items-center' style={{background:'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}>
                    <div className='login-kotak d-flex px-4'>
                        <h1 className='align-self-center'>Register</h1>
                        <div className='mt-3'>
                            <TextField 
                                inputProps={{ 
                                    className:'text-white login-placeholder'
                                }} 
                                InputLabelProps={{
                                    className:'text-white'
                                }} 
                                className={classes.root} 
                                inputRef={this.state.username} 
                                label="Username" 
                                fullWidth='true' 
                                variant="outlined" 
                                size='small' 
                            />
                        </div>
                        <div className='mt-3'>
                            <TextField 
                                inputProps={{ className:'text-white'}} 
                                className={classes.root} 
                                inputRef={this.state.password} 
                                InputLabelProps={{
                                    className:'text-white'
                                }}
                                type="password"  
                                label="Password" 
                                fullWidth='true' 
                                variant="outlined" 
                                size='small' 
                            />
                        </div>
                        <div className='mt-3'>
                            <TextField 
                                inputProps={{ className:'text-white'}} 
                                className={classes.root} 
                                inputRef={this.state.repassword} 
                                InputLabelProps={{
                                    className:'text-white'
                                }}
                                type="password"  
                                label="Repassword" 
                                fullWidth='true' 
                                variant="outlined" 
                                size='small' 
                            />
                        </div>
                        <div className='mt-3'>
                                <button onClick={this.onRegisterclick} className='px-3 py-2 rounded text-white' style={{border:'white 1px solid',backgroundColor:'transparent'}}>
                                    Register
                                </button>
                        </div>
                        <div>
                            Sudah punya akun ?
                            <Link to='/login'>
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}

const Mapstatetoprops=(state)=>{
    return{
        Auth:state.Auth
    }
}

export default withStyles(Styles) (connect(Mapstatetoprops,{Clearfunc})(Register));