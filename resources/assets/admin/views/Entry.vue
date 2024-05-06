<template>
    <div class="fluentform-wrapper">
        <section-head class="ff_section_head_between items-center" size="sm">
            <section-head-content>
                <h3>
                    <router-link :to="{ name: 'form-entries' }">{{$t('Entries')}}</router-link> <span role="presentation" class="el-breadcrumb__separator">/</span> {{$t('Details')}} #{{entry.serial_number}}
                </h3>
            </section-head-content>
            <section-head-content>
                <btn-group>
                    <btn-group-item>
                        <el-button size="medium" :loading="entry_changing_prev" @click="changeEntry('-')" :disabled="!prevId">
                            <i class="ff-icon ff-icon-arrow-left"/> <span>{{$t('Previous')}}</span>
                        </el-button>
                    </btn-group-item>
                    <btn-group-item>
                        <el-button size="medium" :loading="entry_changing_next" @click="changeEntry('+')" :disabled="!nextId">
                            <span>{{$t('Next')}} </span> <i class="ff-icon ff-icon-arrow-right"/>
                        </el-button>
                    </btn-group-item>
                    <btn-group-item>
                        <router-link :to="{ name: 'form-entries' }">
                            <span class="el-button el-button--default el-button--medium">
                                <i class="ff-icon ff-icon-eye fs-15"></i>
                                <span>{{$t('View All')}}</span>
                            </span>
                        </router-link>
                    </btn-group-item>
                </btn-group>
            </section-head-content>
        </section-head>

        <el-skeleton :loading="loading" animated :rows="10" :class="loading ? 'ff_card' : ''">
            <el-row :gutter="20" style="min-height: 400px;">
                <el-col :lg="16">
                    <div v-loading="entry_changing_next || entry_changing_prev" class="ff_entry_detail_wrap">
                        <card class="entry_info_box entry_input_data">
                            <card-head>
                                <card-head-group class="justify-between">
                                    <div class="entry_info_box_title">
                                        <span title="json code" @click="view_as_json = !view_as_json" class="dashicons dashicons-editor-code json_action"></span>
                                        {{$t('Form Entry Data')}}
                                    </div>
                                    <div class="entry_info_box_actions">
                                        <span
                                            @click="changeFavorite()"
                                            :title="$t('Remove from Favorites')"
                                            v-if="entry.is_favourite != '0' || entry.is_favourite == '1'"
                                            class="el-icon-star-on star_big action_button text-warning"></span>
                                        <span
                                            @click="changeFavorite()"
                                            :title="$t('Mark as Favorite')"
                                            v-else
                                            class="el-icon-star-off star_big action_button text-warning"></span>

                                        <el-checkbox true-label="yes" false-label="no" v-model="show_empty">{{$t('Show empty fields')}}</el-checkbox>
                                    </div>
                                </card-head-group>
                            </card-head>
                            <card-body>
                                <el-skeleton :loading="resources_loading" animated :rows="6">
                                    <div v-if="entry.serial_number">
                                        <div v-show="!view_as_json" class="wpf_entry_details">
                                            <div
                                                v-for="(label, label_index) in labels"
                                                :key="label_index"
                                                v-show="show_empty == 'yes' || entry.user_inputs[label_index]"
                                                class="wpf_each_entry"
                                            >

                                                <div class="wpf_entry_label">
                                                    {{label}}
                                                </div>

                                                <template v-if="formFields[label_index]['element'] == 'input_email'">
                                                    <div v-show="entry.user_inputs[label_index]" class="wpf_entry_value">
                                                        <a :href="'mailto:'+entry.user_inputs[label_index]">{{
                                                            entry.user_inputs[label_index] }}</a>
                                                    </div>
                                                </template>
                                                <template v-else-if="formFields[label_index]['element'] == 'input_file'">
                                                    <entry-file-list :itemKey="label_index" :dataItems="original_data"></entry-file-list>
                                                </template>
                                                <template
                                                    v-else-if="['input_image', 'signature'].indexOf(formFields[label_index]['element']) != -1">
                                                    <entry-image-list :itemKey="label_index" :dataItems="original_data"></entry-image-list>
                                                </template>
                                                <template
                                                    v-else-if="['input_checkbox', 'select'].indexOf(formFields[label_index]['element']) != -1">
                                                    <div class="wpf_entry_value" v-html="maybeExtractCommaArrayInfo(entry.user_inputs[label_index], formFields[label_index]['raw'])"></div>
                                                </template>
                                                <template v-else>
                                                    <div class="wpf_entry_value" v-html="entry.user_inputs[label_index]"></div>
                                                </template>
                                            </div>
                                        </div>
                                        <div v-show="view_as_json">
                                            <textarea class="show_code" readonly :value="prettifyJson(entry)"></textarea>
                                        </div>
                                    </div>
                                </el-skeleton>
                            </card-body>
                        </card>

                        <card v-for="(card, cardKey) in extraCards" class="entry_info_box" :key="cardKey">
                            <card-head>
                                <h6>{{card.title}}</h6>
                            </card-head>
                            <card-body>
                                <div class="narrow_items">
                                    <div v-html="card.content"></div>
                                </div>
                            </card-body>
                        </card>


                        <payment-summary
                            @reload_payments="getEntry()"
                            v-if="order_data"
                            :submission="entry"
                            :order_data="order_data"
                        />

                        <template v-if="hasPermission('fluentform_manage_entries')">
                            <entry_notes :entry_id="entry_id" :form_id="form_id"/>

                            <submission_logs  :entry_id="entry_id" />
                            <btn-group as="div">
                                <btn-group-item as="div">
                                    <email-resend :form_id="form_id" :entry_id="entry_id" />
                                </btn-group-item>
                                <btn-group-item as="div">
                                    <manual-entry-actions :form_id="form_id" :entry_id="entry_id" />
                                </btn-group-item>
                            </btn-group>
                        </template>
                    </div><!-- .ff_entry_detail_wrap -->
                </el-col>
                <el-col :lg="8">
                    <card class="entry_info_box">
                        <card-head>
                            <div class="entry_info_box_title">
                                {{$t('Submission Info')}}
                            </div>
                        </card-head>
                        <card-body>
                            <ul class="ff_submission_info_list ff_list_border_bottom">
                                <li>
                                    <div class="lead-title">{{$t('Entity ID')}}:</div>
                                    <div class="lead-text">#{{ entry.id }}</div>
                                </li>
                                <li>
                                    <div class="lead-title"> {{$t('User IP')}}:</div>
                                    <a class="lead-text" target="_blank" rel="noopener" :href="'https://ipinfo.io/' + entry.ip">
                                        {{ entry.ip }}
                                    </a>
                                </li>
                                <li>
                                    <div class="lead-title">{{$t('Source URL')}}:</div>
                                    <a class="lead-text lead-url" target="_blank" :href="entry.source_url">
                                        {{ entry.source_url }}
                                    </a>
                                </li>
                                <li>
                                    <div class="lead-title">{{$t('Browser')}}:</div>
                                    <div class="lead-text">{{ entry.browser }}</div>
                                </li>
                                <li>
                                    <div class="lead-title">{{$t('Device')}}:</div>
                                    <div class="lead-text"> {{ entry.device }}</div>
                                </li>
                                <li>
                                    <template  v-if="entry.user">
                                        <div class="lead-title">{{$t('User')}}:</div>
                                        <a class="lead-text" target="_blank" rel="noopener" :href="entry.user.permalink">{{ entry.user.name }}</a>
                                    </template>

                                    <template v-else>
                                        <div class="lead-title">{{$t('User')}}:</div>
                                        <div class="lead-text">{{$t('Guest')}}</div>
                                    </template>

                                    <user-change v-if="hasPermission('fluentform_manage_entries')" :submission="entry" />
                                </li>
                                <li>
                                    <div class="lead-title">{{$t('Status')}}:</div>
                                    <div class="lead-text">{{ entry_statuses[entry.status] || entry.status }}</div>
                                </li>
                                <li>
                                    <div class="lead-title">{{$t('Submitted On')}}:</div>
                                    <div class="lead-text"> {{ entry.created_at }}</div>
                                </li>
                            </ul>
                            <div class="entry-footer" v-if="hasPermission('fluentform_manage_entries')">
                                <btn-group>
                                    <btn-group-item>
                                        <el-button @click="editTable = true" size="small" type="primary" icon="el-icon-edit">
                                            {{$t('Edit')}}
                                        </el-button>
                                    </btn-group-item>
                                    <btn-group-item>
                                        <el-dropdown trigger="click" @command="handleStatusChange">
                                            <el-button size="small" type="primary" class="el-button--soft">
                                                {{$t('Change status to')}} <i class="el-icon-arrow-down el-icon--right"></i>
                                            </el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item
                                                    v-for="(statusName, statusKey) in entry_statuses"
                                                    :command="statusKey"
                                                    :key="statusKey"
                                                >
                                                    {{statusName}}
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </btn-group-item>
                                </btn-group>
                            </div>
                        </card-body>
                    </card>

                    <card v-for="(widget, widgetKey) in widgets" class="entry_info_box" :key="widgetKey">
                        <card-head>
                            <div class="entry_info_box_title">
                                {{widget.title}}
                            </div>
                        </card-head>
                        <card-body>
                            <div v-html="widget.content"></div>
                        </card-body>
                    </card>
                </el-col>
            </el-row>
        </el-skeleton>

        <el-dialog
            top="42px"
            :append-to-body="true"
            :visible.sync="editTable"
            width="60%"
        >
            <template slot="title">
                <h4>{{$t('Edit Entry Data')}}</h4>
            </template>
            <edit-entry
                @reloadData="getEntry()"
                :form_id="form_id"
                :entry_id="entry_id"
                @close="editTable = false"
                v-if="editTable"
                :labels="labels"
                :submission="entry"
                :fields="formFields"
            ></edit-entry>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
    import remove from '../components/confirmRemove';
    import entry_notes from './EntryNotes';
    import submission_logs from './SubmissionLogs';
    import editEntry from './EditEntry';
    import each from 'lodash/each';
    import EntryFileList from './Helpers/FilesList.vue';
    import EntryImageList from './Helpers/ImageList.vue';
    import EmailResend from './Helpers/_ResentEmailNotification';
    import ManualEntryActions from './Helpers/_ManualEntryActions';
    import PaymentSummary from './Payments/PaymentSummary';
    import UserChange from './_UserChange';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import SectionHead from '@/admin/components/SectionHead/SectionHead.vue';
    import SectionHeadContent from '@/admin/components/SectionHead/SectionHeadContent.vue';

    export default {
        name: 'Entry',
        props: ['has_pdf'],
        components: {
            remove: remove,
            entry_notes: entry_notes,
            submission_logs,
            editEntry,
            EntryFileList,
            EntryImageList,
            EmailResend,
            PaymentSummary,
            ManualEntryActions,
            UserChange,
            BtnGroup,
            BtnGroupItem,
            Card,
            CardHead,
            CardHeadGroup,
            CardBody,
            SectionHead,
            SectionHeadContent
        },
        data() {
            return {
                loading: true,
                editTable: false,
                entry: false,
                view_as_json: false,
                entry_type: this.$route.query.type || 'all',
                developer_mode: true,
                form_id: window.fluent_form_entries_vars.form_id,
                entry_id: Number.parseInt(this.$route.params.entry_id),
                nextId: null,
                prevId: null,
                order_data: null,
                sort_by: this.$route.query.sort_by,
                paginate: {
                    total: null,
                    current_page: this.$route.query.current_page
                },
                entry_position: this.$route.query.pos,
                operator: null,
                currentSerialNo: null,
                formFields: {},
                original_data: {},
                show_empty: 'no',
                widgets: {},
                labels: {},
                extraCards :{},
                entry_changing_next : false,
                entry_changing_prev : false,
                resources_loading : false,
            }
        },
        computed: {
            entry_statuses() {
                let statuses = {...window.fluent_form_entries_vars.entry_statuses}

                delete statuses['favorites'];

                return statuses;
            }
        },
        methods: {
            getEntry() {
                const url = FluentFormsGlobal.$rest.route('findSubmission', this.entry_id);
                FluentFormsGlobal.$rest.get(url)
                    .then(submission => {
                        this.entry = submission;
                        this.original_data = JSON.parse(submission.response);
                        this.currentSerialNo = this.entry.myRowSerial;
                        this.entry_id = this.entry.id;

                        if (this.entry_id != this.$route.params.entry_id) {
                            this.$router.push({
                                name: 'form-entry', params: {entry_id: this.entry.id},
                                query: this.$route.query
                            });
                        }

                        ffEntriesEvents.$emit(
                            'change-title',
                            `Entry ${ this.entry.serial_number || '' }`
                        );
                    })
                    .then(() => {
                        this.getEntryResources();
						const statusUpdate = window.fluent_form_entries_vars.update_status;
						if (
							statusUpdate && this.entry_statuses.hasOwnProperty(statusUpdate) &&
							statusUpdate !== this.entry.status
						) {
							this.handleStatusChange(statusUpdate);
							this.getEntryResources();
						}
                    })
                    .catch(error => {
                        this.$fail(error.message);
                    })
                    .finally(() => {
                        this.entry_changing_next = this.entry_changing_prev = false;
                        this.loading = false;

                    });
            },
            changeFavorite() {
                const url = FluentFormsGlobal.$rest.route('toggleSubmissionIsFavorite', this.entry_id);

                FluentFormsGlobal.$rest.post(url)
                    .then(response => {
                        this.entry.is_favourite = response.is_favourite;
                        this.$success(response.message);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleStatusChange(status) {
                let data = {status: status};

                const url = FluentFormsGlobal.$rest.route('updateSubmissionStatus', this.entry_id);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.entry.status = status;
                        this.$success(response.message);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            changeEntry(operator) {
                let entryId = (operator === '+' && this.nextId) || (operator === '-' && this.prevId);

                if (entryId) {
                    if (operator === '+'){
                        this.entry_changing_next = true;
                    }else{
                        this.entry_changing_prev = true;
                    }
                    this.entry_id = entryId;
                    this.getEntry();

                }
            },
            explodeFileUrls(value, chunkSize = 4) {
                return value ? _ff.chunk(value.split(', '), chunkSize) : [];
            },
            maybeExtractCommaArrayInfo(dataValue, field) {

                if (typeof dataValue == 'string' && field.element == 'input_checkbox') {
                    return dataValue;
                }

                if(field.element == 'select' && field.attributes && !field.attributes.multiple) {
                    return dataValue;
                }
                if (!dataValue) {
                    return;
                }

                let itemArray = [];

                if(typeof dataValue == 'string') {
                    itemArray = dataValue.split(',');
                }


                let options = field.options;

                if(!options) {
                    let advancedOptions = field.settings.advanced_options;
                    if(advancedOptions) {
                        options = {};
                        each(advancedOptions, (optionItem) => {
                            options[optionItem.value] = optionItem.label;
                        });
                    }
                }

                if (!options) {
                    return dataValue;
                }


                if(itemArray.length == 1) {
                    return `<div class="wpf_entry_value">${options[dataValue] || dataValue}</div>`;
                }

                let itemHtml = '<ul class="entry_item_list">';
                each(itemArray, (item) => {
                    item = item.trim();
                    itemHtml += `<li>${options[item] || item}</li>`;
                });
                itemHtml += '</ul>';
                return itemHtml;
            },
            dataType(data) {
                return typeof data;
            },
            prettifyJson(entry) {
                let data = {
                    id: entry.id,
                    form_id: entry.form_id,
                    original: this.original_data,
                    formatted: entry.user_inputs
                };

                return JSON.stringify(data, null, 8);
            },
            getEntryResources() {
                this.resources_loading = true;
                let data = {
                    form_id: this.form_id,
                    entry_id: this.entry_id,
                    fields: true,
                    labels: true,
                    next: true,
                    previous: true,
                    cards: true,
                    widgets: true,
                    orderData: true,
                };

                const url = FluentFormsGlobal.$rest.route('getSubmissionsResources');

                FluentFormsGlobal.$rest.get(url, data)
                    .then((response) => {
                        this.labels = response.labels;
                        this.formFields = response.fields;
                        this.order_data = response.orderData;
                        this.widgets = response.widgets;
                        this.extraCards = response.cards;

                        this.nextId = response.next && response.next.id;
                        this.prevId = response.previous && response.previous.id;

                    })
                    .catch((error) => {
                        this.$fail(error.message);
                    })
                    .finally(() => {
                        this.resources_loading = false;
                    });
            },
        },
        mounted() {
            this.getEntry();
            (new ClipboardJS('.copy')).on('success', (e) => {
                this.$copy();
            });
        }
    };
</script>
