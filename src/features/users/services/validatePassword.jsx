  export const validatePassword=(form)=>{
     if( form.newPassword.length<=8 || form.confirmPassword.length<=8  ){
      console.log(form)
          return "Password should be of length 8"
        }
      if(form.confirmPassword !== form.newPassword){
            return "New password and confirm password must be same"
        }
        if(form.oldPassword === form.newPassword){
            return "New password and old password must not be same"
        }
        return null
      }