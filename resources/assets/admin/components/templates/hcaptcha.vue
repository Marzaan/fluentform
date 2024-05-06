<template>
    <withLabel :item="item">
      <div class="ff-el-form-captcha-img-wrapper">
        <img :src="plugin_url+'img/hcaptcha-placeholder.png'" :alt="$t('hcaptcha-placeholder')">
      </div>
    </withLabel>
</template>

<script>

import withLabel from './withLabel.vue';


export default {
    name: 'hcaptcha',
    props: ['item'],
    components: {
        withLabel
    },
    data() {
        return {
            plugin_url: window.FluentFormApp.plugin_public_url
        }
    }
}
</script>
