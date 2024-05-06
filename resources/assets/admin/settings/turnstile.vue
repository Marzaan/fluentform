<template>
    <div class="ff_turnstile_wrap">
        <el-form label-position="top">
            <card>
                <card-head>
                    <h5 class="title">{{ $t('Cloudflare Turnstile Settings') }}</h5>
                        <p class="text">
                        {{
                            $t('Fluent Forms integrates with Cloudflare Turnstile, a free service that protects your website from spam and abuse. Please note, these settings are required only if you decide to use the Turnstile field.')
                        }}
                        <a href="https://www.cloudflare.com/en-gb/products/turnstile/" target="_blank">
                            {{ $t('Read more about Cloudflare Turnstile.') }}
                        </a>
                    </p>
                    <p class="text"><b>{{ $t('Please generate API key and API secret using Cloudflare Turnstile') }}</b></p>
                </card-head>
                <card-body>
                    <!--Site key-->
                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Site Key') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enter your Turnstile Site Key, if you do not have a key you can register for one at the provided link Turnstile is a free service.') }}
                                    </p>
                                </div>


                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>

                        <el-input v-model="turnstile.siteKey" @change="load"></el-input>
                    </el-form-item>

                    <!--Secret key-->
                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Secret Key') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enter your Turnstile Secret Key, if you do not have a key you can register for one at the provided link, Turnstile is a free service.') }}
                                    </p>
                                </div>

                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>

                        <el-input type="password" v-model="turnstile.secretKey" @change="load"></el-input>
                    </el-form-item>

                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Appearance Mode') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('You can select how the turnstile will appear') }}
                                    </p>
                                </div>

                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>

                        <el-radio class="mr-3" v-model="turnstile.appearance" label="always">{{$t('Always (Default)')}}</el-radio>
                        <el-radio class="mr-3" v-model="turnstile.appearance" label="execute">{{$t('Execute')}}</el-radio>
                        <el-radio class="mr-3" v-model="turnstile.appearance" label="interaction-only">{{$t('Interaction-only (Hidden)')}}</el-radio>
                    </el-form-item>

                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Theme') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Choose a theme for the field') }}
                                    </p>
                                </div>

                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>

                        <el-radio v-model="turnstile.theme" label="auto">{{ $t('Auto') }}</el-radio>
                        <el-radio v-model="turnstile.theme" label="light">{{ $t('Light') }}</el-radio>
                        <el-radio v-model="turnstile.theme" label="dark">{{ $t('Dark') }}</el-radio>
                    </el-form-item>

                    <!--Validate Keys-->
                    <el-form-item :label="$t('Validate Keys')" v-if="siteKeyChanged">
                        <div
                            class="cf-turnstile"
                            id="turnstile"
                            :data-sitekey="turnstile.siteKey"
                        ></div>
                    </el-form-item>

                    <notice v-if="turnstile_status && !disabled" size="sm" type="success-soft">
                        <p>{{ $t('Your Cloudflare Turnstile is valid') }}</p>
                    </notice>
                </card-body>
            </card>

            <div class="mt-4">
                <el-button
                    type="primary"
                    icon="el-icon-success"
                    @click="save"
                    :disabled="disabled"
                    :loading="saving"
                >{{ $t('Save Settings') }}
                </el-button>

                <el-button
                    type="danger"
                    icon="ff-icon ff-icon-trash"
                    @click="clearSettings"
                    :loading="clearing"
                >{{ $t('Clear Settings') }}
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import Card from '@/admin/components/Card/Card.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import CardHead from '@/admin/components/Card/CardHead.vue';
import Notice from '@/admin/components/Notice/Notice.vue';

export default {
    components: { 
        Card, 
        CardHead, 
        CardBody,
        Notice
    },
    name: "turnstile",
    props: ["app"],
    data() {
        return {
            turnstile: {
                siteKey: "",
                secretKey: "",
                invisible: "no",
                appearance: 'always',
                theme: 'auto'
            },
            turnstile_status: false,
            siteKeyChanged: false,
            disabled: false,
            saving: false,
            clearing: false,
        };
    },
    methods: {
        load() {
            if (!this.validate()) {
                this.disabled = false;
                this.siteKeyChanged = false;
                return;
            } else {
                this.disabled = true;
                this.siteKeyChanged = true;
                this.turnstile_status = false;
            }

            this.$nextTick(() => {
                let id = '#turnstile';
                let $turnstile = jQuery(id);
                let siteKey = this.turnstile.siteKey;
                $turnstile.html('');

                let widgetID = turnstile.render(id, {
                    sitekey: siteKey,
                    theme: this.turnstile.theme,
                    callback: (token) => {
                        this.turnstile.token = token;
                    }
                });

                this.disabled = false;
            })
        },
        save() {
            if (!this.validate()) {
                return this.$fail(this.$t('Missing required fields.'));
            }
            this.saving = true;

            const url = FluentFormsGlobal.$rest.route('storeGlobalSettings');
            let data = {
                key: 'turnstile',
                turnstile: this.turnstile
            }

            FluentFormsGlobal.$rest.post(url, data)
                .then(response => {
                    this.turnstile_status = response.status;
                    this.$success(response.message);
                    this.siteKeyChanged = false;
                    this.turnstile.token = null;
                })
                .catch(error => {
                    this.turnstile_status = parseInt(error.status, 10);
                    let method = this.turnstile_status === 1 ? '$warning' : '$error';
                    this[method](error.message);
                })
                .finally(r => {
                    this.saving = false;
                });
        },
        clearSettings() {
            this.clearing = true;

            const url = FluentFormsGlobal.$rest.route('storeGlobalSettings');
            let data = {
                key: 'turnstile',
                turnstile: 'clear-settings'
            }

            FluentFormsGlobal.$rest.post(url, data)
                .then(response => {
                    this.turnstile_status = response.status;
                    this.turnstile = {siteKey: '', secretKey: ''};
                    this.$success(response.message);
                })
                .catch(error => {
                    this.turnstile_status = error.status;
                    this.$fail(this.$t('Something went wrong.'));
                })
                .finally(r => {
                    this.clearing = false;
                });
        },
        validate() {
            return !!(this.turnstile.siteKey && this.turnstile.secretKey);
        },
        getTurnstileSettings() {
            const url = FluentFormsGlobal.$rest.route('getGlobalSettings');
            let data = {
                key: [
                    '_fluentform_turnstile_details',
                    '_fluentform_turnstile_keys_status'
                ]
            }

            FluentFormsGlobal.$rest.get(url, data)
                .then(response => {
                    const turnstile = response._fluentform_turnstile_details;
                    this.turnstile = turnstile;
                    if (this.turnstile?.invisible == 'yes') {
                        this.turnstile.appearance = 'interaction-only';
                    }
                    this.turnstile_status = response._fluentform_turnstile_keys_status;
                });
        }
    },
    mounted() {
        this.getTurnstileSettings();
    },
    created() {
        let turnstileScript = document.createElement('script');

        turnstileScript.setAttribute('src', 'https://challenges.cloudflare.com/turnstile/v0/api.js');

        document.body.appendChild(turnstileScript);
    },
};
</script>
