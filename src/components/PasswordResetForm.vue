<template>
    <div class='row mt50'>


        <div class="col"></div>
        <div class="col-md-5 col-sm-6 col-lg-4 form-container">
            <form id="login-form" v-on:submit.prevent="validatePasswordReset">

                <div class="row justify-content-center">
                    <div
                            :class="formSuccessType"
                            class="alert"
                            v-if="formSuccessMessage">{{formSuccessMessage}}
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
                    <input class="btn btn-sm btn-outline-primary" type="submit" value="Reset Password">

                    <div class="login-action-2">
                        <a href="/reset" class="mb10">Login</a>
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
    name: "password-reset-form",
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
        csrfToken: document.querySelector('meta[name="csrf-token"]').content
      }
    },
    methods: {
      okToSubmit(){
        return Boolean(!this.formErrors.passwordError && this.formErrors.passwordsMatch)
      },
      validatePasswordReset(e){
        this.formErrors = {
          emailErrors: [],
          otherErrors: []
        };

        this.submitted = true;
        this.formSuccessMessage = '';

        let passwordErrors = this.validatePassword(this.password);

        this.formErrors.passwordError = passwordErrors.length > 0;
        this.formErrors.passwordsMatch = this.password === this.passwordAgain;

        if (this.okToSubmit()){
          this.submitForm();
        } else {
          document.querySelector('input[name="password"]').focus();
        }

      },
      async submitForm(){
        let res = '';

        try{

          res = await axios.post(location.pathname, {
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
          this.formSuccessType = 'alert-success';
          window.location.href = "/login";
        } else {
          this.formSuccessType = 'alert-danger';
          if (this.formErrors.otherErrors.length > 0){
            this.formSuccessMessage = this.formErrors.otherErrors[0];
          }
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

        document.querySelector('input[name="password"]').focus();
      }
    }
  }
</script>

<style scoped>

</style>