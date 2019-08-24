import * as actionTypes from './actionTypes';

export const authStart=()=>{
    return {
        type:actionTypes.AUTH_START
    }
   
}

export const authSuccess=()=>{
    return {
        type:actionTypes.AUTH_SUCCESS,
    

    }
}
    

export const loginSuccess=(token,userId)=>{
 //  console.log("auth"+authData)
     return {
         type:actionTypes.LOGIN_SUCCESS,
         token:token,
         userId:userId
    
        }
 }
 
export const logout = () => {
  localStorage.removeItem('token');
  
  localStorage.removeItem('id');
  localStorage.removeItem('expirationDate');
  return {
   type: actionTypes.AUTH_LOGOUT
 };
};
export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
      setTimeout(() => {
          dispatch(logout());
      }, expirationTime * 1000);
  };
};



export const authFail=(error)=>{
    return {
        type:actionTypes.AUTH_FAIL,
        error:error
    }
    }
export const auth=(email,password,name,confirmPassword)=>{
    return dispatch =>{
        dispatch(authStart());
     fetch("http://localhost:8080/signup",{
                method:"POST",
                body:JSON.stringify({
                    email:email,
                    password:password,
                    name:name,
                    confirmPassword:confirmPassword
                }),
                headers: {
                    'Content-Type': 'application/json'
                  }
            }).then((res)=>{
                if (res.status === 422) {
                    throw new Error(
                      "Validation failed. Make sure the email address isn't used yet!"
                    );
                  }
                  if (res.status !== 200 && res.status !== 201) {
                    console.log('Error!');
                    throw new Error('Creating a user failed!');
                  }
                  return res.json();
                }).then(resData => {
                   // console.log(resData);
                    dispatch(authSuccess());
                 
                  }).catch((err)=>{
                    console.log(err);
                    dispatch(authFail());
                  });
    };
}  ;

export const login=(email,password)=>{
    return dispatch =>{
        dispatch(authStart());
     fetch("http://localhost:8080/login",{
                method:"POST",
                body:JSON.stringify({
                    email:email,
                    password:password,
                    
                }),
                headers: {
                    'Content-Type': 'application/json'
                  }
            }).then((res)=>{
                if (res.status === 422) {
                    throw new Error(
                      "Validation failed. Make sure the email address isn't used yet!"
                    );
                  }
                  if (res.status !== 200 && res.status !== 201) {
                    //console.log('Error!');
                    throw new Error('Creating a user failed!');
                  }
                  return res.json();
                }).then(resData => {
                    console.log(resData.expiresIn * 1000);
                    const expirationDate = new Date(new Date().getTime() + resData.expiresIn *3600* 1000);
                    localStorage.setItem("token",resData.token);
                    localStorage.setItem("id",resData.userId);
                    localStorage.setItem('expirationDate', expirationDate);
                    dispatch(loginSuccess(resData));
                  
                  }).catch((err)=>{
                    console.log(err);
                    dispatch(authFail());
                  });
    };
}  ;

export const loginStatus=()=>{
  return dispatch =>{
    const token =localStorage.getItem("token");
    //console.log(token);
    if(!token){
      dispatch(authFail())
    }else{
      const userId = localStorage.getItem('id');
      dispatch(loginSuccess(token, userId));
    }
  }
}
export const contact=(receiver)=>{
  return {
    type:actionTypes.CONTACT,
    receiver:receiver
  }
};
export const setAuthRedirectPath=path=>{
  return {
    type:actionTypes.REDIRECTPATH,
    path:path
  }
};

export const authCheckState = () => {
  return dispatch => {
      const token = localStorage.getItem('token');
      if (!token) {
          dispatch(logout());
      } else {
          const expirationDate = new Date(localStorage.getItem('expirationDate'));
          if (expirationDate <= new Date()) {
              dispatch(logout());
          } else {
              const userId = localStorage.getItem('userId');
              dispatch(loginSuccess(token, userId));
              dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
          }   
      }
  };
};