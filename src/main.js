const Uploader = function(){

  let allowedFileType;
  let uploads = [];

  function init(dragArea = document.body, fileType = '.') {
    allowedFileType = fileType;
    dragArea.ondragover = dragOverHandler;
    dragArea.ondrop = dropHandler;
  }

  function uploadImage(file) {
    const loaderArea = $('.loader-area');
    loaderArea.addClass('loader');
    let formData = new FormData();
    formData.append('image', file, file.name);

    $.ajax({
      url: 'api/upload',
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: postUploadHandler
    }).done((err) => {
      setTimeout(() => {
        loaderArea.removeClass('loader');
      }, 1000);
    });
  }

  function dragOverHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }

  function dropHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    let files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      const reader = new FileReader();
      if (file.type.match(allowedFileType)) {
        reader.onload = imageReaderHandler;
        uploadImage(file);
      } else {

      }
      reader.readAsDataURL(file);
    });
  }

  function imageReaderHandler(e) {
    const image = document.createElement('img');
    image.src = e.target.result;
  }

  function postUploadHandler(result) {
    if (result.status !== 200) {
      // Do nothing
      return
    }

    uploads.unshift(result)

  }

  return {
    init: init,
    uploadImage: uploadImage,
    uploads: uploads
  }

}();

Uploader.init(document.body, 'image.*');

import UploadItem from './components/UploadItem.vue'
import UploadList from './components/UploadList.vue'
import RegisterForm from './components/RegisterForm.vue'
import LoginForm from './components/LoginForm.vue'
import ForgotPasswordForm from './components/ForgotPasswordForm.vue'
import PasswordResetForm from './components/PasswordResetForm.vue'
import { validators } from '../lib/helpers/validators'

const vm = new Vue({
  el: '#uploads',
    mixins: [validators],
  data: {
    uploads: Uploader.uploads,
  },
  delimiters: ['${','}'],
  components: {
    UploadItem,
    UploadList,
    RegisterForm,
    LoginForm,
    ForgotPasswordForm,
    PasswordResetForm
  }
});

$("#upload-manual").on("change", function(e){
  Array.from(e.target.files).forEach(file => Uploader.uploadImage(file))
});

$('.copy-btn').on('click', function(e){
  let text = $(e.target).prev('a').attr('href');
  copyToClipboard(text);
});

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);

  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    let textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}