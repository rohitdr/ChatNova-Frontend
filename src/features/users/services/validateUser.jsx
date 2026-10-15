    const emailRegex = /^\S+@\S+\.\S+$/;

 export const validateUserForm = (form,originaldata) => {
     if(!form || !originaldata) return   { error: "Data not ready" };
     const updatedFields = {};
     const payload = {};
   
     Object.keys(form).forEach((key) => {
       if (form[key] !== originaldata[key]) {
         updatedFields[key] = form[key];
       }
     });
   
     if (!emailRegex.test(form.email)) {
       return { error: "Please Enter a Valid Email" };
     }
   
     if (form.name.trim().length < 3 || form.name.trim().length > 20) {
       return { error: "Name should be between length 3 to 20" };
     }
   
     if (form.username.trim().length < 8 || form.username.trim().length > 12) {
       return { error: "Username should be between length 8 to 12" };
     }
   
     if (String(form.phone_number).trim().length !== 10) {
       return { error: "Phone number should be of length 10" };
     }
   
     if (!Object.keys(updatedFields).length) {
       return { error: "Please update something" };
     }
   
   
     if (updatedFields.name) payload.name = updatedFields.name;
     if (updatedFields.email) payload.email = updatedFields.email;
     if (updatedFields.username) payload.username = updatedFields.username;
     if (updatedFields.phone_number) payload.phone_number = updatedFields.phone_number;
   
     return { payload };
   };