<template>
    <div class='row mt50'>
        <div class="col"></div>
        <div class="col-md-5 col-sm-6 col-lg-4 form-container">
            <form id="login-form" v-on:submit.prevent="validateForgotPassword">

                <div class="row justify-content-center">
                    <div
                            :class="formSuccessType"
                            class="alert"
                            v-if="formSuccessMessage">{{formSuccessMessage}}
                    </div>
                </div>

                <div class="form-group row">
                    <input
                            id="reset-email"
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


                <div class="action">
                    <input class="btn btn-sm btn-outline-primary" type="submit" value="Reset Password">

                    <div class="login-action-2">
                        <a href="/login" class="mb10">Login</a>
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
    name: "forgot-password-form",
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
        email: '',
        csrfToken: document.querySelector('meta[name="csrf-token"]').content
      }
    },
    methods: {
      okToSubmit(){
        return Boolean(this.formErrors.emailErrors.length === 0)
      },
      validateForgotPassword(e){
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

        if (this.okToSubmit()){
          this.submitForm();
        } else {
          document.querySelector('input[name="email"]').focus();
        }

      },
      async submitForm(){
        let res = '';

        try{
          res = await axios.post('/forgot', {
            'email': this.email,
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

      },
      clearForm() {
        this.submitted = false;
        this.formErrors = {
          emailErrors: [],
          otherErrors: []
        };

        this.email = '';

        document.querySelector('input[name="email"]').focus();
      }
    }
  }
</script>

<style scoped>
    .alert{
        text-align: center;
    }

</style>