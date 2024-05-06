<template>
    <div class="ff_general_integration_wrap">
        <card v-if="settings.hide_on_valid && integration.status">
            <card-head>
                <h5 class="title">{{ settings.menu_title }}</h5>
                <p class="text" v-html="settings.menu_description"></p>
            </card-head>
            <card-body>
                <div class="el-alert el-alert--success is-light ff_state_box">
                    <div class="mb-4 ff_icon_btn mx-auto success">
                        <i class="el-icon el-icon-check"></i>
                    </div>
                    <h6 class="mb-4" v-html="settings.discard_settings.section_description"></h6>
                    <el-button v-if="settings.discard_settings.show_verify" v-loading="saving" @click="save()" type="primary"
                        icon="el-icon-success">
                        {{ $t('Verify Connection Again') }}
                    </el-button>
                    <el-button @click="disconnect(settings.discard_settings.data)" type="danger">
                        {{ settings.discard_settings.button_text }}
                    </el-button>
                </div>
            </card-body>
        </card>
        <div v-else class="ff_general_integration_body">
            <el-skeleton :loading="loading" animated :rows="10" :class="loading ? 'ff_card' : ''">
                <template v-if="settings.config_instruction && !integration.status">
                    <div class="integration_instraction" v-html="settings.config_instruction"></div>
                </template>
                <el-form label-position="top">
                    <card>
                        <card-head>
                            <h5 class="title">{{ settings.menu_title }}</h5>
                            <p class="text" v-html="settings.menu_description"></p>
                        </card-head>
                        <card-body>
                            <!--Site key-->
                            <el-form-item class="ff-form-item" v-for="(field,fieldKey) in settings.fields" :key="fieldKey" v-if="dependancyPass(field, integration)">
                                <template slot="label" v-if="field.label">
                                    {{ field.label }}
                                    <el-tooltip v-if="field.label_tips" class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <div v-html="field.label_tips">
                                            </div>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <template v-if="field.type == 'select'">
                                    <el-select class="w-100 ff-input-s1" v-model="integration[fieldKey]">
                                        <el-option
                                            v-for="(optionName, optionValue) in field.options"
                                            :key="optionValue"
                                            :label="optionName"
                                            :value="optionValue"></el-option>
                                    </el-select>
                                </template>
                                <template v-else-if="field.type == 'link'">
                                    <a :target="field.target" :class="field.btn_class" :href="field.link">{{ field.link_text }}</a>
                                    <p class="mt-2">{{ field.tips }}</p>
                                </template>
                                <template v-else-if="field.type == 'dynamic_link'">
                                    <a :target="field.target" :disabled="!getDynamicAuthLink(field)" :class="field.btn_class" :href="getDynamicAuthLink(field)">{{ field.link_text }}</a>
                                    <p>{{ field.tips }}</p>
                                </template>
                                <template v-else-if="field.type == 'checkbox-single'">
                                    <el-checkbox v-model="integration[fieldKey]">
                                        {{field.checkbox_label}}
                                    </el-checkbox>
                                </template>
                                <template v-else-if="field.type == 'checkbox_yes_no'">
                                    <el-checkbox true-label="yes" false-label="no" v-model="integration[fieldKey]">
                                        {{field.checkbox_label}}
                                    </el-checkbox>
                                </template>
                                <template v-else-if="field.type == 'radio_choice'">
                                    <el-radio-group v-model="integration[fieldKey]">
                                        <el-radio
                                                v-for="(fieldLabel, fieldValue) in field.options"
                                                :key="fieldValue"
                                                :label="fieldValue"
                                        >{{ fieldLabel }}
                                        </el-radio>
                                    </el-radio-group>
                                </template>
                                <template v-else-if="field.type == 'wp_editor'">
                                    <wp-editor :height="120" v-model="integration[fieldKey]"/>
                                    <div class="mt-3" v-if="field.info"><span v-html="field.info"></span></div>
                                </template>
                                <template v-else-if="field.type == 'input_number'">
                                    <el-input-number v-model="integration[fieldKey]" :min="1"></el-input-number>
                                </template>
                                <template v-else>
                                    <el-input :placeholder="field.placeholder" :type="field.type"
                                            v-model="integration[fieldKey]"></el-input>
                                    <p class="text-note mt-2" v-if="field.tips">{{ field.tips }}</p>
                                </template>
                            </el-form-item>
                            <!--Validate Keys-->

                            <div v-if="integration.status">
                                <p><i class="el-icon-success"></i> {{ settings.valid_message }}</p>
                            </div>
                            <div v-else>
                                <p><i class="ff-icon ff-icon-close-circle-filled"></i> {{ settings.invalid_message }}</p>
                            </div>

                            <p v-if="error_message">{{ error_message }}</p>
                        </card-body>
                    </card>

                    <div class="mt-4">
                        <el-button v-loading="saving" type="primary" icon="el-icon-success" @click="save">
                            {{ settings.save_button_text }}
                        </el-button>
                    </div>
                </el-form>
            </el-skeleton>
        </div>
    </div>
</template>

<script type="text/babel">
import VideoDoc from '@/common/VideoInstruction.vue';
import Errors from '@/common/Errors';
import ErrorView from '@/common/errorView';
import Card from '@/admin/components/Card/Card.vue';
import CardHead from '@/admin/components/Card/CardHead.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import wpEditor from '@/common/_wp_editor';


export default {
    name: "generalIntegration",
    props: ['app', 'settings_key'],
    components: {
        Errors ,
        ErrorView,
        VideoDoc,
        Card,
        CardHead,
        CardBody,
        wpEditor,

    },
    data() {
        return {
            integration: {},
            loading: false,
            saving: false,
            settings: {},
            error_message: '',
            errors : new Errors()
        }
    },
    watch: {
        settings_key() {
            this.integration = {};
            this.settings = {};
            this.getIntegrationSettings();
        }
    },
    methods: {
        getDynamicAuthLink(field){
            if (field.link && this.integration[field.dynamic_key_field_name]){
                let link = field.link;
                return link.replace("dynamic_key_placeholder", this.integration[field.dynamic_key_field_name]);
            }
            return false;

        },
        save() {
            this.saving = true;
            const url = FluentFormsGlobal.$rest.route('updateGlobalIntegration')
            FluentFormsGlobal.$rest.post(url,{
                settings_key: this.settings_key,
                integration: this.integration
            })
                .then(response => {
                    this.$success(response.data.message);
                    if (response.data.redirect_url) {
                        window.location.href = response.data.redirect_url;
                        return;
                    }

                    this.integration.status = response.data.status;

                    if (this.settings.reload_on_save) {
                        this.getIntegrationSettings();
                    }
                })
                .catch(error => {

                    this.integration.status = false;
                    const message = error?.message || error?.data?.message
                    this.$fail(message);

                })
                .finally(() => {
                    this.saving = false;
                });
        },
        getIntegrationSettings() {
            this.loading = true;
            const url = FluentFormsGlobal.$rest.route('getGlobalIntegration')
            FluentFormsGlobal.$rest.get(url, {
                settings_key: this.settings_key
            })
                .then(response => {
                    this.integration = response.integration;
                    this.settings = response.settings;
                })
                .catch(error => {
                    this.error_message = error?.responseJSON?.data.message ||error?.message;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        dependancyPass(inputItem, settings) {
            if (inputItem.dependency) {
                let status = true;
                let continueLoop = true;
                inputItem.dependency.forEach((item) => {
                    if (!continueLoop){
                        return;
                    }
                    let optionItem = item.depends_on;
                    let dependencyVal = settings[optionItem];

                    if (!this.compare(item.value, item.operator, dependencyVal)) {
                        status = false;
                        continueLoop = false;
                    } else {
                        status = true;
                    }
                });

                return status;

            }
            return true;
        },
        compare(operand1, operator, operand2) {
            switch(operator) {
                case '==':
                    return operand1 == operand2
                    break;
                case '!=':
                    return operand1 != operand2
                    break;
            }
        },
        disconnect(data) {
            this.integration = data;
            this.save();
        }
    },
    mounted() {
        this.getIntegrationSettings();
    }
}
</script>
