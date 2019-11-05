const formValidation = {
    registrationFormValidation: formData => {
        let hasErrors = false;
        let errors = {};

        Object.keys(formData).forEach(key => {
            if(formData[key].trim() === ""){
                hasErrors = true;
                errors[key] = `The ${key} field cannot be empty!`
            } else if(key === "firstName"){
                if(formData[key].length > 25){
                    hasErrors = true;
                    errors[key] = "First name cannot be more than 25 characters";
                }
            } else if(key === "lastName"){
                if(formData[key].length > 50){
                    hasErrors = true;
                    errors[key] = "Last name cannot be more than 50 characters";
                }
            } else if(key === "email"){
                if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData[key])){
                    hasErrors = true;
                    errors[key] = "E-mail is invalid";
                }
            } else if(key === "password"){
                if(formData[key] !== formData.confirmPassword){
                    hasErrors = true;
                    errors[key] = "Passwords do not match";
                }
            }
        });

        return {
            hasErrors,
            errors
        }
    }
};

module.exports = formValidation;