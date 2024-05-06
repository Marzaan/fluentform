<template>
    <div :class="{'ff_backdrop': visibility}" class="disabled-info" v-if="modal">
        <el-dialog
            :visible.sync="isVisible"
            :before-close="close"
            :width="modal.video || modal.image ? '74%' : '50%'"
        >
            <div slot="title">
                <h4>{{!modal ? $t('Field disabled') : ''}}</h4>
            </div>

            <template v-if="contentComponent">
                <component :is="contentComponent"></component>
            </template>

            <template v-else-if="modal && !modal.disable_html">
                <el-row :gutter="25" class="items-center">
                    <el-col v-if="modal.video || modal.image" :span="12">
                        <div v-if="modal.video" class="video-wrapper mr-3">
                            <iframe
                                style="width: 100%; height: 300px; border-radius: 10px;"
                                :src="modal.video"
                                :title="$t('YouTube video player')"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            />
                        </div>
                        <div v-else class="mr-3">
                            <img class="w-100 img-thumb" :src="modal.image" :alt="modal.title" />
                        </div>
                    </el-col>

                    <el-col :span="modal.video || modal.image ? 12 : 24">
                        <div class="video-content">
                            <div class="ff_icon_btn mb-4" v-if="!modal.hidePro">
                                 <i class="ff-edit-password el-icon"/>
                            </div>
                            <h3 class="mb-3 title">{{ modal.title }}</h3>
                            <p class="text">{{ modal.description }}</p>
                            <a class="el-button mt-2 el-button--primary" v-if="!modal.hidePro" target="_blank" :href="campaignUrl">
                                {{ $t('Upgrade to PRO') }}
                            </a>
                        </div>
                    </el-col>
                </el-row>
            </template>

            <div v-else-if="modal && modal.disable_html">
                <div v-html="modal.disable_html"></div>
            </div>

            <div v-else>
                <p>{{ $t('This field is only available on pro add - on') }}</p>
                <a target="_blank"
                   class="el-button el-button--danger"
                   :href="campaignUrl" >
                    {{ $t('Upgrade to Pro Now') }}
                </a>
            </div>

            <template v-if="false">
                <div>
                    <div v-if="modal && modal.is_payment">
                        <h2 class="mb-3">{{ $t('Fluent Forms Payment Module') }}</h2>
                        <p>{{ $t('Accept Payment online as part of the Forms submission process.With Fluent Forms Powerful payment integration, you can easily accept and process payments in your Fluent Forms via Stripe / PayPal.Payment Module is available on Pro Version.') }}</p>
                        <a  target="_blank"
                            class="el-button el-button--danger"
                            :href="campaignUrl" >
                            {{ $t('Upgrade to Pro Now') }}
                        </a>
                    </div>
                    <div v-else-if="modal && modal.disable_html">
                        <div v-html="modal.disable_html"></div>
                    </div>
                    <div v-else>
                        <p>{{ $t('This field is only available on pro add - on') }}</p>
                        <a target="_blank"
                            class="el-button el-button--danger"
                            :href="campaignUrl" >
                            {{ $t('Upgrade to Pro Now') }}
                        </a>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import recaptcha from './Recaptcha.vue';
    import hcaptcha from './Hcaptcha.vue';
    import turnstile from './Turnstile.vue';

    export default {
        name: 'ItemDisabled',
        props: ['visibility', 'modal', 'value'],
        components: { hcaptcha, recaptcha, turnstile },
        data() {
            return {
                contentComponent: '',
            }
        },
        watch: {
            modal() {
                if (this.modal && this.modal.contentComponent) {
                    this.contentComponent = this.modal.contentComponent
                }
            }
        },
        computed: {
            isVisible() {
                return !!this.visibility || !!this.value;
            },

	        campaignUrl() {
				return this.modal?.is_payment ? (
                        window.FluentFormApp.upgrade_url ||
                        'https://wpmanageninja.com/downloads/fluentform-pro-add-on/?utm_source=fluentform&utm_medium=wp_payment&utm_campaign=wp_plugin&utm_term=upgrade&utm_content=pop'
					) : (
						window.FluentFormApp.upgrade_url ||
                        'https://wpmanageninja.com/downloads/fluentform-pro-add-on/?utm_source=fluentform&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade&utm_content=pop'
				    );
            },

	        hasPro() {
				return !!window.FluentFormApp.hasPro;
            }
        },
        methods: {
            close() {
                this.$emit('update:visibility', false);
                this.$emit('input', false);
                setTimeout(() => {
                    this.contentComponent = '';
                }, 350);
            }
        }
    }
</script>
