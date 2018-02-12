<template>
    <div class='row mt50'>
        <div class="col"></div>

        <div class="col-md-5 col-sm-6 col-lg-4 form-container">
            <div class="row justify-content-center">
                <div
                        :class="formSuccessType"
                        class="alert"
                        v-if="formSuccessMessage">{{formSuccessMessage}}
                </div>
            </div>

            <form method="post" v-on:submit.prevent="validateRegistration">
                <div class="form-group row">
                    <input
                            id="login-email"
                            v-model="email"
                            :class="{'is-invalid': submitted && formErrors.emailErrors.length > 0}"
                            class="form-control form-control-sm"
                            type="text"
                            name="email"
                            placeholder="Email Address"
                            autofocus
                    >
                    <div v-for="emailError in formErrors.emailErrors" class="invalid-feedback">
                        {{emailError}}
                    </div>
                </div>

                <div class="form-group row">
                    <input
                            id="login-password"
                            v-model="password"
                            :class="{'is-invalid': submitted && formErrors.passwordError}"
                            class="form-control form-control-sm"
                            type="password"
                            name="password"
                            placeholder="Password"
                    >
                    <div class="invalid-feedback">
                        Password must contain 1 special character and be at least 8 characters long.
                    </div>
                </div>

                <div class="form-group row">
                    <input
                            id="login-password-again"
                            v-model="passwordAgain"
                            :class="{'is-invalid': submitted && !formErrors.passwordsMatch}"
                            class="form-control form-control-sm"
                            type="password"
                            name="password-again"
                            placeholder="Confirm Password"
                    >
                    <div class="invalid-feedback">Passwords don't match.</div>
                </div>

                <div class="action">
                    <a href="/login" class="pull-right">Already registered?</a>
                    <input class="btn btn-sm btn-outline-primary" type="submit" value="Register">
                </div>
            </form>

        </div>
        <div class="col"></div>
    </div>
</template>

<script>
  import axios from 'axios';
  import {validators} from "../../lib/helpers/validators";

  export default {
    name: "register-form",
    mixins:[validators],
    data: function(){
      return {
        formErrors: {
          emailErrors: [],
          otherErrors: []
        },
        submitted: false,
        formSuccessMessage: '',
        formSuccessType: 'alert-success',
        password: '',
        passwordAgain: '',
        email: '',
        csrfToken: document.querySelector('meta[name="csrf-token"]').content
      }
    },
    methods: {
      okToSubmit(){
        return Boolean(!this.formErrors.passwordError && this.formErrors.passwordsMatch && this.formErrors.emailErrors.length === 0)
      },
      validateRegistration(e){
        this.formErrors = {
          emailErrors: [],
          otherErrors: []
        };

          this.submitted = true;
          this.formSuccessMessage = '';

        if (this.email === ''){
          this.formErrors.emailErrors.push('Email address required.');
        } else {
          let validEmail = this.validateEmail(this.email);
          if (!validEmail){
            this.formErrors.emailErrors.push('Invalid email address.');
          }
        }

          let passwordErrors = this.validatePassword(this.password);

          this.formErrors.passwordError = passwordErrors.length > 0;
          this.formErrors.passwordsMatch = this.password === this.passwordAgain;

          if (this.okToSubmit()){
            this.submitForm();
          } else {
            document.querySelector('input[name="email"]').focus();
          }

    },
      async submitForm(){
        let res = '';

        try{
          res = await axios.post('/register', {
            'email': this.email,
            'password': this.password,
            'password-again': this.passwordAgain,
            '_csrf': this.csrfToken
          });
        } catch (err){
          this.formSuccessMessage = 'An unexpected error occurred, please try again.';
          this.formSuccessType = 'alert-danger';
          this.clearForm();
          return
        }



        this.formErrors = res.data;
        this.formSuccessMessage = this.formErrors.successMessage;

        // Vue Router - Redirect to home page

        if (!res.data.hasErrors){
            this.clearForm();
        }
      },
      clearForm() {
        this.submitted = false;
        this.formErrors = {
          emailErrors: [],
          otherErrors: []
        };

        this.password = '';
        this.passwordAgain = '';
        this.email = '';

        document.querySelector('input[name="email"]').focus();
      }
  }
  }
</script>

<style scoped>

</style>