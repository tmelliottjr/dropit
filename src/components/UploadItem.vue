<template>
        <div class="card card-dark">
            <div class="card-header card-dark upload-card-header">
                <a :href="upload.url">{{ upload.url }}</a>
            </div>
            <a target="_blank" :href="upload.path">
                <img class="card-img-top upload-card-img" :src="upload.path">
            </a>
            <div class="card-body">
                <div class="upload-info">
                    <div class="upload-date">
                        {{ upload.createdAt }}
                    </div>
                    <span><i class="fa fa-eye"></i> {{ upload.views }}</span>
                </div>
                <p class="card-text">
                </p>
            </div>
        </div>
</template>

<script>
  export default {
    name: 'upload-item',
    props: ['upload']
  }
</script>

<style>

    .card-body{
        padding: 0 !important;
    }

    .card:before, .effect6:after
    {
        content:"";
        position:absolute;
        z-index:-1;
        -webkit-box-shadow:0 0 20px rgba(0,0,0,0.8);
        -moz-box-shadow:0 0 20px rgba(0,0,0,0.8);
        box-shadow:0 0 20px rgba(0,0,0,0.8);
        top:50%;
        bottom:0;
        left:10px;
        right:10px;
        -moz-border-radius:100px / 10px;
        border-radius:100px / 10px;
    }
    .card:after
    {
        right:10px;
        left:auto;
        -webkit-transform:skew(8deg) rotate(3deg);
        -moz-transform:skew(8deg) rotate(3deg);
        -ms-transform:skew(8deg) rotate(3deg);
        -o-transform:skew(8deg) rotate(3deg);
        transform:skew(8deg) rotate(3deg);
    }
</style>