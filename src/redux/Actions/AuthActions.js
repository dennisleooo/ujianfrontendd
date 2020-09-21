import Axios from 'axios'
import { API_URL } from '../../helpers/idrformat'
import {ADDCART} from './../Type'
export const LoginFunc=(user,cart)=>{
    return{
        type:'LOGIN',
        payload:user,
        cart:cart
    }
}

export const Clearfunc=()=>{
    return{
        type:'CLEAR'
    }
}


export const AddcartAction=(cart)=>{
    return{
        type:ADDCART,
        cart:cart
    }
}


export const LoginThunk=(username,password)=>{
    return (dispatch)=>{
        dispatch({type:'LOADING'})
        Axios.get(`${API_URL}/users`,{
            params:{
                username:username,
                password:password
            }
        }).then((res)=>{
            if(res.data.length){
                Axios.get(`${API_URL}/carts`,{
                    params:{
                        userId:res.data[0].id,
                        _expand:'product'
                    }
                }).then((res1)=>{
                    localStorage.setItem('id',res.data[0].id)
                    dispatch({type:'LOGIN',payload:res.data[0],cart:res1.data})
                }).catch((err)=>{
                    dispatch({type:'Error',payload:'servernya error bro'})
                })
            }else{
                dispatch({type:'Error',payload:'masukkin datanya bro'})
            }
        }).catch((err)=>{
            dispatch({type:'Error',payload:'servernya error bro'})
        })
    }
}
