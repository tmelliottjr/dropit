<template>
    <div class="upload-grid-container vert-sp">
        <div class="upload-grid">
            <UploadItem v-for="upload in uploads" :upload="upload"></UploadItem>
        </div>
    </div>
</template>


<script>
    import UploadItem from './UploadItem.vue'
    import axios from 'axios';

    export default {
      data: function(){
        return {
          uploads: []
        }
      },
      components: {
        UploadItem
      },
      async created(){
        let url = window.location.toString();
        let endpoint = url.substr(url.indexOf('uploads'));
        let response = await axios.get(`/api/${endpoint}`);
        this.uploads = response.data.uploads
      }
    }

</script>

<style>

</style>