module.exports = {
    complexity(str){
        const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        let errors = [];

        if (str.length < 8){
            errors.push('Password must be at least 8 characters long.')
        }

        if (!format.test(str)){
            errors.push('Password must contain at least 1 special character.')
        }

        return errors;
    },
    match(str1, str2){
        let error = false;
        if (str1 === str2){
            error = true;
        }
        return error;
    }
    ,
  validateEmail(str){
    const format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return format.test(str);
  }
};


