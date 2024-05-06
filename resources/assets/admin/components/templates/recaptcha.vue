<template>
    <withLabel :item="item">
      <div class="ff-el-form-captcha-img-wrapper">
        <img :src="plugin_url+'img/recaptcha-placeholder.png'" :alt="$t('recaptcha-placeholder')">
      </div>
    </withLabel>
</template>

<script>
import withLabel from './withLabel.vue';

export default {
    name: 'recaptcha',
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
