import { emailRegex } from "./login.schema";

 export const validateSignUpForm = (formData) => {
  if(!formData.email.trim() || !formData.username.trim()){
  return "Fields cannot be empty";
}
  if (!emailRegex.test(formData.email.trim())) {
    return "Invalid email format";
  }
  if (formData.password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (formData.username.trim().length < 8) {
    return "Username must be at least 8 characters";
  }
  return null;
};