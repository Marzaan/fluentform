<template>
    <div class="edit_integration">
        <card>
            <card-head>
                <card-head-group class="justify-between">
                    <h5 class="title">{{ title }}</h5>
                    <btn-group>
                        <btn-group-item>
                            <router-link class="el-button el-button--info el-button--medium"
                                         :to="{name: 'allIntegrations'}">
                                <i class="ff-icon ff-icon-eye"></i>
                                <span>{{ $t('View All') }}</span>
                            </router-link>
                        </btn-group-item>
                        <btn-group-item>
                            <video-doc btn_size="medium" :route_id="integration_name" :btn_text="$t('Learn More')"/>
                        </btn-group-item>
                    </btn-group>
                </card-head-group>
            </card-head>
            <card-body>
                <el-skeleton :loading="loading_app" animated :rows="6" class="integration_edit">
                    <el-form v-if="!loading_app" label-position="top">
                        <template v-for="(field, fieldIndex) in settings_fields.fields">
                            <el-form-item
                                    class="ff-form-item"
                                    v-if="(field.require_list && merge_fields) || !field.require_list"
                                    :required="field.required"
                                    :key="fieldIndex"
                            >
                                <template slot="label">
                                    {{ field.label }}
                                    <el-tooltip v-if="field.tips" class="item" popper-class="ff_tooltip_wrap"
                                                placement="bottom-start">
                                        <div slot="content">
                                            <p v-html="field.tips"></p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <template v-if="field.component == 'text'">
                                    <el-input :placeholder="field.placeholder" v-model="settings[field.key]"></el-input>
                                </template>

                                <template v-else-if="field.component == 'list_ajax_options'">
                                    <el-select
                                            class="w-100"
                                            v-loading="loading_list"
                                            @change="loadMergeFields()"
                                            v-model="settings.list_id"
                                            :placeholder="field.placeholder">
                                        <el-option
                                                v-for="(list_name, list_key) in field.options"
                                                :key="list_key"
                                                :value="list_key"
                                                :label="list_name"
                                        ></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="field.component == 'refresh'">
                                    <el-select
                                            class="w-100"
                                            v-loading="loading_list"
                                            @change="refresh()"
                                            v-model="settings.list_id"
                                            :placeholder="field.placeholder">
                                        <el-option
                                                v-for="(list_name, list_key) in field.options"
                                                :key="list_key"
                                                :value="list_key"
                                                :label="list_name"
                                        ></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="field.component == 'select'">
                                    <el-select
                                            class="w-100"
                                            filterable
                                            clearable
                                            :multiple="field.is_multiple"
                                            v-model="settings[field.key]"
                                            :placeholder="field.placeholder">
                                        <el-option
                                                v-for="(list_name, list_key) in field.options"
                                                :key="list_key"
                                                :value="list_key"
                                                :label="list_name"
                                        ></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="field.component == 'map_fields'">
                                    <merge-field-mapper
                                            :errors="errors"
                                            :inputs="inputs"
                                            :field="field"
                                            :settings="settings"
                                            :editorShortcodes="editorShortcodes"
                                            :merge_model="settings[field.key]"
                                            @merge-model="setMergeModel(field.key)"
                                            :merge_fields="merge_fields"/>
                                </template>

                                <template v-else-if="field.component == 'checkbox-single'">
                                    <el-checkbox v-model="settings[field.key]">
                                        {{ field.checkbox_label }}
                                    </el-checkbox>
                                </template>

                                <template v-else-if="field.component == 'checkbox-multiple'">
                                    <el-checkbox-group v-model="settings[field.key]">
                                        <el-checkbox
                                                v-for="(fieldValue, i) in field.options"
                                                :key="i"
                                                :label="Number(i)"
                                        >{{ fieldValue }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </template>

                                <template v-else-if="field.component == 'checkbox-multiple-text'">
                                    <el-checkbox-group v-model="settings[field.key]">
                                        <el-checkbox
                                                v-for="(fieldValue, i) in field.options"
                                                :key="i"
                                                :label="i"
                                        >{{ fieldValue }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </template>

                                <template v-else-if="field.component == 'conditional_block'">
                                    <filter-fields
                                            :fields="inputs"
                                            :conditionals="settings[field.key]"
                                            :hasPro="has_pro"/>

                                    <notice class="ff_alert_between" type="danger-soft" v-if="!has_pro">
                                        <div>
                                            <h6 class="title">{{ $t('Conditional Logics is a Pro Feature') }}</h6>
                                            <p class="text">
                                                {{ $t('Please upgrade to pro to unlock this feature.') }}</p>
                                        </div>
                                        <a target="_blank"
                                           href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree"
                                           class="el-button el-button--danger el-button--small">
                                            {{ $t('Upgrade to Pro') }}
                                        </a>
                                    </notice>
                                </template>

                                <template v-else-if="field.component == 'value_text'">
                                    <filed-general
                                            :editorShortcodes="editorShortcodes"
                                            v-model="settings[field.key]"
                                    />
                                </template>

                                <template v-else-if="field.component == 'value_textarea'">
                                    <filed-general
                                            field_type="textarea"
                                            :editorShortcodes="editorShortcodes"
                                            v-model="settings[field.key]"
                                    />
                                </template>

                                <template v-else-if="field.component == 'list_select_filter'">
                                    <list-select-filter :settings="settings" :field="field"/>
                                </template>

                                <template v-else-if="field.component == 'dropdown_label_repeater'">
                                    <drop-down-label-repeater
                                            :errors="errors"
                                            :inputs="inputs"
                                            :field="field"
                                            :settings="settings"
                                            :editorShortcodes="editorShortcodes"
                                    />
                                </template>

                                <template v-else-if="field.component == 'dropdown_many_fields'">
                                    <drop-down-many-fields
                                            :errors="errors"
                                            :inputs="inputs"
                                            :field="field"
                                            :settings="settings"
                                            :editorShortcodes="editorShortcodes"
                                    />
                                </template>

                                <template v-else-if="field.component == 'radio_choice'">
                                    <el-radio-group v-model="settings[field.key]">
                                        <el-radio
                                                v-for="(fieldLabel, fieldValue) in field.options"
                                                :key="fieldValue"
                                                :label="fieldValue"
                                        >{{ fieldLabel }}
                                        </el-radio>
                                    </el-radio-group>
                                </template>

                                <template v-else-if="field.component == 'number'">
                                    <el-input-number v-model="settings[field.key]"></el-input-number>
                                </template>

                                <template v-else-if="field.component == 'chained_fields'">
                                    <chained-fields
                                            select_class="flex-grow-1"
                                            v-if="has_pro"
                                            :settings="settings"
                                            v-model="settings[field.key]"
                                            :field="field"
                                    ></chained-fields>

                                    <notice class="ff_alert_between" type="danger-soft" v-else>
                                        <div>
                                            <h6 class="title">{{ $t('Interest Group is a Pro Feature') }}</h6>
                                            <p class="text">
                                                {{ $t('Please upgrade to pro to unlock this feature.') }}</p>
                                        </div>
                                        <a target="_blank"
                                           href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree"
                                           class="el-button el-button--danger el-button--small">
                                            {{ $t('Upgrade to Pro') }}
                                        </a>
                                    </notice>
                                </template>

                                <div class="ff_chained_ajax_field" v-else-if="field.component == 'chained-ajax-fields'">
                                    <template v-for="(optionValue, optionKey) in field.options_labels">
                                        <el-select
                                                v-loading="loading_list"
                                                @change="chainedAjax(optionKey)"
                                                v-model="settings.chained_config[optionKey]"
                                                :placeholder="optionValue.placeholder"
                                                :key="optionKey"
                                        >
                                            <el-option
                                                    v-for="(list_name, list_key) in optionValue.options"
                                                    :key="list_key"
                                                    :value="list_key"
                                                    :label="list_name"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                </div>

                                <template v-else-if="field.component == 'chained_select'">
                                    <chained-selects
                                            v-if="has_pro"
                                            :settings="settings"
                                            v-model="settings[field.key]"
                                            :field="field"
                                    ></chained-selects>

                                    <notice class="ff_alert_between" type="danger-soft" v-else>
                                        <div>
                                            <h6 class="title">{{ $t('This is a Pro Feature') }}</h6>
                                            <p class="text">
                                                {{ $t('Please upgrade to pro to unlock this feature.') }}</p>
                                        </div>
                                        <a target="_blank"
                                           href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree"
                                           class="el-button el-button--danger el-button--small">
                                            {{ $t('Upgrade to Pro') }}
                                        </a>
                                    </notice>
                                </template>

                                <template v-else-if="field.component == 'html_info'">
                                    <div v-html="field.html_info"></div>
                                </template>

                                <template v-else-if="field.component == 'selection_routing'">
                                    <selection-routing
                                            :inputs="inputs"
                                            :field="field"
                                            :editorShortcodes="editorShortcodes"
                                            :settings="settings"/>
                                </template>

                                <template v-else-if="field.component == 'datetime'">
                                    <el-date-picker
                                            v-model="settings[field.key]"
                                            type="datetime"
                                            format="yyyy/MM/dd HH:mm:ss"
                                            :placeholder="field.placeholder"
                                            v-on:change="handleChange($event, field.key)"
                                    >
                                    </el-date-picker>
                                </template>

                                <template v-else-if="field.component == 'wp_editor'">
                                    <wp_editor
                                        :editorShortcodes="editorShortcodes"
                                        :height="field.height || 200"
                                        v-model="settings[field.key]">
                                    </wp_editor>
                                </template>

                                <template v-else>
                                    <p>{{
                                            $t('No Template found. Please make sure you are using latest version of Fluent Forms')
                                        }}</p>
                                    <pre>{{ field.component }}</pre>
                                    <pre>{{ field }}</pre>
                                </template>

                                <p class="mt-1 fs-14" v-if="field.inline_tip" v-html="field.inline_tip"></p>
                                <error-view :field="field.key" :errors="errors"></error-view>

                            </el-form-item>
                        </template>


                        <template v-if="maybeShowSaveButton">
                            <hr class="mt-3 mb-4">
                            <el-button
                                    type="primary"
                                    :loading="saving"
                                    @click="saveNotification"
                                    icon="el-icon-success"
                            >
                                {{ $t('Save Feed') }}
                            </el-button>
                        </template>
                    </el-form>
                </el-skeleton>
            </card-body>
        </card>
    </div>
</template>

<script type="text/babel">
    import Errors from "@/common/Errors";
    import inputPopover from '../../input-popover.vue';
    import ErrorView from '@/common/errorView';
    import FilterFields from '../Includes/FilterFields.vue';
    import MergeFieldMapper from './_field_maps';
    import FiledGeneral from './_FieldGeneral';
    import ListSelectFilter from './_ListSelectFilter';
    import DropDownLabelRepeater from './_DropdownLabelRepeater';
    import DropDownManyFields from './_DropdownManyFields';
    import ChainedFields from './_ChainedFields';
    import ChainedSelects from './_ChainedSelects';
    import VideoDoc from '@/common/VideoInstruction.vue';
    import SelectionRouting from './_SelectionRouting';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import Notice from '@/admin/components/Notice/Notice.vue';
    import wpEditor from '@/common/_wp_editor';

    export default {
        name: 'general_notification_edit',
        components: {
            SelectionRouting,
            ErrorView,
            inputPopover,
            FilterFields,
            MergeFieldMapper,
            FiledGeneral,
            ListSelectFilter,
            DropDownLabelRepeater,
            DropDownManyFields,
            ChainedFields,
            ChainedSelects,
            VideoDoc,
            Card,
            CardHead,
            CardHeadGroup,
            CardBody,
            BtnGroup,
            BtnGroupItem,
            Notice,
            'wp_editor' : wpEditor
        },
        props: ['form_id', 'inputs', 'has_pro', 'editorShortcodes'],
        watch: {},
        data() {
            return {
                loading_app: false,
                loading_list: false,
                errors: new Errors(),
                integration_id: parseInt(this.$route.params.integration_id),
                integration_name: this.$route.params.integration_name,
                saving: false,
                merge_fields: false,
                settings: {},
                settings_fields: {},
                attachedForms: [],
                fromChainedAjax: false,
                refreshQuery: null
            }
        },
        computed: {
            title() {
                let integrationName = this.settings_fields.integration_title || '';
                if (this.integration_id) {
                    return `Update ${integrationName} Integration Feed`;
                } else {
                    return `Add New ${integrationName} Integration Feed`;
                }
            },
            maybeShowSaveButton() {
                let fields = this.settings_fields;
                let mergeFields = this.merge_fields;
                return (fields.button_require_list && mergeFields) || !fields.button_require_list;
            }
        },
        methods: {
            loadIntegrationSettings() {
                this.loading_app = true;
                let data = {
                    integration_id: this.integration_id,
                    integration_name: this.integration_name,
                    form_id: this.form_id
                };

                // add chained ajax configs query
                if (this.fromChainedAjax) {
                    data = {...data, configs: this.settings.chained_config}
                }

                if (this.refreshQuery) {
                    data = {...data, ...this.refreshQuery}
                }
                const url = FluentFormsGlobal.$rest.route('getFormIntegrationSettings', this.form_id);

                FluentFormsGlobal.$rest.get(url, data)
                    .then(response => {
                        this.settings_fields = response.settings_fields;
                        this.settings = response.settings;
                        if (!this.settings.name) {
                            this.settings.name = response.settings_fields.integration_title + ' Integration Feed' || '';
                        }
                        this.merge_fields = response.merge_fields;
                        jQuery('head title').text(this.title + ' - Fluent Forms');

                    })
                    .catch(error => {
                        // when failed show default field if available
                        if (this.fromChainedAjax && error.data?.settings_fields) {
	                        this.settings_fields = error.data.settings_fields;
                        }
                        this.$fail(error.data?.message || 'Error on integration settings');
                    })
                    .finally(() => {
                        this.loading_app = false;
                    });
            },
            refresh() {
                this.refreshQuery = {
                    serviceName: this.settings['name'],
                    serviceId: this.settings['list_id']
                };
                this.loadIntegrationSettings();
            },
            chainedAjax(key) {
                for (const key in this.settings.chained_config) {
                    if (this.settings.chained_config[key] == '') {
                        return;
                    }
                }
                if (key == 'base_id') {
                    this.settings.chained_config['table_id'] = '';
                }
                this.fromChainedAjax = true;
                this.loadIntegrationSettings();
            },
            loadMergeFields() {
                this.loading_list = true;
                const url = FluentFormsGlobal.$rest.route('getFormIntegrationList', this.form_id, this.integration_id)
                FluentFormsGlobal.$rest.get(url, {
                    integration_id: this.integration_id,
                    list_id: this.settings.list_id,
                    form_id: this.form_id,
                    integration_name: this.integration_name
                })
                    .then(response => {
                        const result = response?.merge_fields || response?.data?.merge_fields
                        this.merge_fields = result
                    })
                    .catch(error => {
                        const message = error?.message || error?.data?.message
                        this.$fail(message);
                    })
                    .finally(() => {
                        this.loading_list = false;
                    });
            },
            saveNotification() {
                this.errors.clear();
                this.saving = true;
                let data = {
                    form_id: this.form_id,
                    integration_id: this.integration_id,
                    integration_name: this.integration_name,
                    integration: JSON.stringify(this.settings),
                    data_type: 'stringify',
                };
                const url = FluentFormsGlobal.$rest.route('updateFormIntegrationSettings', this.form_id, this.integration_id);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        if (response.created) {
                            this.$router.push({
                                name: 'allIntegrations'
                            });
                        }
                        this.$success(response.message);
                    })
                    .catch((error) => {
                        const getError = error?.errors || error?.data?.errors
                        const message = error?.message || error?.data?.message

                        this.errors.record(getError)
                        this.$fail(message);
                    })
                    .finally(() => this.saving = false);
            },
            setMergeModel(key) {
                this.settings[key] = {};
            }
        },
        mounted() {
            this.loadIntegrationSettings();
        }
    }
</script>

