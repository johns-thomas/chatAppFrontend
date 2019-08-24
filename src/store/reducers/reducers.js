
import * as actionTypes from '../action/actionTypes'

const initialState={
    token:null,
    loading:false,
    userID:null,
    error:null,
    receiver:null

};

const reducer =(state=initialState,action)=>{
    switch(action.type){
       case(actionTypes.AUTH_START):
         return {
             ...state,
             loading:true
         }
        
        case(actionTypes.AUTH_SUCCESS):
        //console.log(state.token)
         return {
             ...state,
             loading:false
         }
         case(actionTypes.LOGIN_SUCCESS):
        // console.log(action)
         return {
             ...state,
             token:action.token,
             userID:action.userId,
             loading:false,
             isLogined:true
         }
         case(actionTypes.AUTH_FAIL):{
             return {
                 ...state,
                 loading:false,
                 error:action.error
             }
         }
         case(actionTypes.AUTH_LOGOUT):{
            return {
                ...state,
                loading:false,
                token:null,
                userID:null
                
            }
        }
        case(actionTypes.CONTACT):{
            return {
                ...state,
                receiver:action.receiver
                
            }
        }
        case(actionTypes.REDIRECTPATH):{
            return {
                ...state,
               path:action.path
                
            }
        }
         default:
             return state;




}
}
export default reducer;