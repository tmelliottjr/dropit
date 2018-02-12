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
            <form v-on:submit.prevent="validateLogin">
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
                        {{formErrors.passwordError}}
                    </div>
                </div>

                <div class="action">
                    <input class="btn btn-sm btn-outline-primary" type="submit" value="Log In">

                    <div class="login-action-2">
                    <a href="/register" class="mb10">Need an account?</a>
                    <a href="/forgot" class="">Forgot password?</a>
                    </div>
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
    name: 'login-form',
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
        email: '',
        csrfToken: document.querySelector('meta[name="csrf-token"]').content
      }
    },
    methods: {
      okToSubmit(){
        return Boolean(!this.formErrors.passwordError && this.formErrors.emailErrors.length === 0)
      },
      validateLogin(e){
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

        if (this.password === ''){
          this.formErrors.passwordError = 'Password is required.';
        }

        if (this.okToSubmit()){
          this.submitForm();
        } else {
          document.querySelector('input[name="email"]').focus();
        }

      },
      async submitForm(){
        let res = '';

        try{
          res = await axios.post('/login', {
            'email': this.email,
            'password': this.password,
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

        console.log(res.data)

        if (!res.data.hasErrors){
          window.location.href = "/";
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