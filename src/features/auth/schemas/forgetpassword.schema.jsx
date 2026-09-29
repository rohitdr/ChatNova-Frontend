  export const emailRegex = /^\S+@\S+\.\S+$/;

  export const validateForgetPassword = (formData) => {
    if (
      !formData.email.trim() ||
      !formData.username.trim() ||
      !formData.password
    ) {
      return "Fields cannot be empty";
    }

    if (!emailRegex.test(formData.email.trim())) {
      return "Enter valid Email";
    }

    if (formData.password.length < 8) {
      return "Password should be of length 8";
    }

    if (formData.username.trim().length < 8) {
      return "Username should be of length 8";
    }

    return null;
  };