  export const emailRegex = /^\S+@\S+\.\S+$/;
 export const validateLoginForm = (formData) => {
  if(!formData.email.trim()){
  return "Email cannot be empty";
}
  if (!emailRegex.test(formData.email.trim())) {
    return "Invalid email format";
  }
  if (!formData.password) {
  return "Password cannot be empty";
}
  if (formData.password.length < 8) {
    return "Password must be at least 8 characters";
  }
 
  return null;
};