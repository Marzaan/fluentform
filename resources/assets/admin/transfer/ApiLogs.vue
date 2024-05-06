  <template>
    <div class="ff_api_logs">
        <div class="ff_card">
            <div class="ff_card_head">
                <h5 class="title">{{$t('Api Logs')}}</h5>
                <p class="text" style="max-width: 700px;">
                    {{ $t('Get external CRM and API call logs here. Track api logs activity. (Last 2 months logs)') }}
                </p>
            </div><!-- .ff_card_head -->
            <div class="ff_card_body">
                <el-row :gutter="24">
                    <el-col :span="5">
                        <div class="ff_form_group">
                            <h6 class="fs-15 mb-3">Form</h6>
                            <el-select class="w-100" @change="getLogs()" multiple clearable v-model="selected_form" :placeholder="$t('Select Form')">
                                <el-option
                                    v-for="item in available_forms"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="ff_form_group">
                            <h6 class="fs-15 mb-3">Source</h6>
                            <el-select class="w-100"  @change="getLogs()" multiple clearable v-model="selected_component" :placeholder="$t('Select Component')">
                                <el-option
                                    v-for="item in available_components"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    style="text-transform:capitalize;"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="ff_form_group">
                            <h6 class="fs-15 mb-3">{{ $t('Status') }}</h6>
                            <el-select class="w-100" @change="getLogs()" multiple clearable v-model="selected_status" :placeholder="$t('Select Status')">
                                <el-option
                                    v-for="item in available_statuses"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="ff_form_group">
                            <h6 class="fs-15 mb-3">{{ $t('Date') }}</h6>
                            <el-date-picker
                                    v-model="filter_date_range"
                                    type="datetimerange"
                                    @change="getLogs()"
                                    :picker-options="pickerOptions"
                                    format="dd MMM yyyy HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="-"
                                    align="right"
                                    :default-time="['00:00:01', '23:59:59']"
                                    :start-placeholder="$t('Start date')"
                                    :end-placeholder="$t('End date')">
                            </el-date-picker>
                        </div>
                    </el-col>
                </el-row>

                <div class="ff_activity_logs_body mt-4">
                    <el-skeleton :loading="loading" animated :rows="10">
                        <div v-if="multipleSelection.length" class="logs_actions mb-3">
                            <btn-group size="sm">
                                <btn-group-item>
                                    <remove icon="el-icon-delete" @on-confirm="deleteItems()">
                                        <button type="button" class="el-button el-button--danger el-button--mini">
                                            <i class="el-icon-delete"></i>
                                            <span>{{ $t('Delete Selected Logs') }}</span>
                                        </button>
                                    </remove>
                                </btn-group-item>
                                <btn-group-item>
                                    <el-button @click="runActions()" type="info" size="mini">
                                        <i class="mr-1 ff-icon-refresh"></i>
                                        {{ $t('Run Selected Action') }}
                                    </el-button>
                                </btn-group-item>
                            </btn-group>
                        </div>

                        <el-table
                            :data="logs"
                            class="entry_submission_log ff_table_s2"
                            stripe
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column sortable type="selection" width="50"></el-table-column>
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <p v-html="props.row.note"></p>
                                </template>
                            </el-table-column>
                            <el-table-column sortable prop="id" width="100px" :label="$t('ID')">
                            </el-table-column>
                            <el-table-column sortable :label="$t('Submission ID')">
                                <template slot-scope="props">
                                    <a :href="props.row.submission_url">#{{props.row.submission_id}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column sortable prop="form_title" :label="$t('Form')"></el-table-column>
                            <el-table-column sortable prop="status" :label="$t('Status')" width="140">
                                <template slot-scope="props">
                                    <el-tag :type="`${props.row.status == 'failed' ? 'danger' : props.row.status == 'success' ? 'success' : 'info'}`" size="small" class="el-tag--pill text-capitalize">
                                        {{props.row.status}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column sortable :label="$t('Component')">
                                <template slot-scope="props">
                                    <div>{{getReadableName(props.row.component)}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="updated_at" :label="$t('Date')" width="180"></el-table-column>
                            <el-table-column width="115" fixed="right" align="center" :label="$t('Action')">
                                <template slot-scope="props">
                                    <btn-group size="sm">
                                        <btn-group-item v-if="hasPro">
                                            <el-tooltip  popper-class="ff_tooltip_wrap" :content="$t('Replay Action')" placement="top">
                                                <el-button v-loading="replaying[props.row.id] ==true" class="el-button--icon" icon="el-icon-refresh" @click="runActions(props.row)" type="info" size="mini">
                                                </el-button>
                                            </el-tooltip>
                                        </btn-group-item>
                                        <btn-group-item>
                                            <remove :plain="true" @on-confirm="deleteItems(props.row.id)">
                                                <el-button
                                                    class="el-button--icon"
                                                    size="mini"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                />
                                            </remove>
                                        </btn-group-item>
                                    </btn-group>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="ff_pagination_wrap text-right mt-4">
                            <el-pagination
                                class="ff_pagination"
                                background
                                @size-change="handleSizeChange"
                                @current-change="goToPage"
                                :current-page.sync="paginate.current_page"
                                :page-sizes="[5, 10, 20, 50, 100]"
                                :page-size="parseInt(paginate.per_page)"
                                layout="total, sizes, prev, pager, next"
                                :total="paginate.total">
                            </el-pagination>
                        </div>
                    </el-skeleton>
                </div>
            </div><!-- .ff_card_body -->

        </div><!-- .ff_card -->

    </div>
</template>

<script type="text/babel">
  import each from 'lodash/each';
  import remove from "../components/confirmRemove";
  import { scrollTop } from '@/admin/helpers';
  import BtnGroup from "@/admin/components/BtnGroup/BtnGroup.vue";
  import BtnGroupItem from "@/admin/components/BtnGroup/BtnGroupItem.vue";

  export default {
        name: 'ApiLogs',
        props: ['app'],
        components:{
            BtnGroupItem,
            BtnGroup,
            remove
        },
        data() {
            return {
                logs: [],
                loading: false,
                available_statuses: [],
                available_components: [],
                available_forms: [],
                selected_form: [],
                selected_status: [],
                selected_component: [],
                multipleSelection: [],
                replaying: {},
                paginate: {
                    total: 0,
                    current_page: 1,
                    last_page: 1,
                    per_page: localStorage.getItem('apiLogsPerPage') || 10
                },
                filter_date_range :[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() >= Date.now();
                    },
                    shortcuts: [
                        {
                            text: 'Today',
                            onClick(picker) {
	                            const todayStart = new Date(new Date().setHours(0, 0, 1, 0))
	                            const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))
                                picker.$emit('pick', [todayStart, todayEnd]);
                            }
                        },
                        {
                            text: 'Yesterday',
                            onClick(picker) {
                                const start = new Date();
	                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
	                            const yesterStart = new Date(start.setHours(0, 0, 1, 0))
	                            const yesterEnd = new Date(start.setHours(23, 59, 59, 999))
	                            picker.$emit('pick', [yesterStart, yesterEnd]);
                            }
                        },
                        {
                            text: 'Last week',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	                            const lastWeedStart = new Date(start.setHours(0, 0, 1, 0))
	                            const lastWeedEnd = new Date(end.setHours(23, 59, 59, 999))
                                picker.$emit('pick', [lastWeedStart, lastWeedEnd]);
                            }
                        },
                        {
                            text: 'Last month',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	                            const lastMonthStart = new Date(start.setHours(0, 0, 1, 0))
	                            const lastMonthEnd = new Date(end.setHours(23, 59, 59, 999))
                                picker.$emit('pick', [lastMonthStart, lastMonthEnd]);
                            }
                        }
                    ]
                },
            }
        },
        methods: {
            getLogs() {
                this.loading = true;

                const url = FluentFormsGlobal.$rest.route('getLogs');
                FluentFormsGlobal.$rest.get(url, {
                        page: this.paginate.current_page,
                        per_page: this.paginate.per_page,
                        form_id: this.selected_form,
                        status: this.selected_status,
                        component: this.selected_component,
                        date_range : this.filter_date_range,
                        type: 'api',
                    })
                    .then(response => {
                        this.logs = response.data;
                        this.total = response.total;
                        this.setPaginate(response);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            deleteItems(singlelogId = false) {
                this.loading = true;
                let logIds = [];

                if (singlelogId) {
                  logIds = [singlelogId]
                } else {
                  each(this.multipleSelection, (item) => {
                    logIds.push(item.id);
                  });
                }

                const url = FluentFormsGlobal.$rest.route('deleteLogs');

                FluentFormsGlobal.$rest.delete(url, {log_ids: logIds, type: 'api'})
                    .then(response => {
                        this.page_number = 1;
                        this.getLogs();
                        this.multipleSelection = [];
                        this.$success(response.message);
                    })
                    .catch(error => {
                        this.$fail(error.message);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            runActions(singlelog = false) {
                let logIds = [];

                if (singlelog) {
                    this.$set(this.replaying, singlelog.id, true);
                    logIds = [
                        {
                            action_id: singlelog.id,
                            feed_id: singlelog.feed_id,
                            form_id: singlelog.form_id,
                            entry_id: singlelog.submission_id,
                            integration_enabled: singlelog.integration_enabled
                        }
                    ];
                } else {
                    each(this.multipleSelection, (item) => {
                        logIds.push(
                            {
                                action_id: item.id,
                                feed_id: item.feed_id,
                                form_id: item.form_id,
                                entry_id: item.submission_id
                            }
                        );
                    });
                }
                let data = {
                    action: 'ffpro_post_integration_feed_replay',
                    verify_condition: 'yes',
                    multiple_actions: false,
                    logIds
                };

                if (logIds.length > 1) {
                    data.multiple_actions = true;
                }

                FluentFormsGlobal.$post(data)
                    .then(response => {
                        this.$success(response.data.message);
                    })
                    .fail(error => {
                        if (!error.responseJSON && !error.responseText || error.responseText == '0') {
                            alert(this.$t('Looks like you are using older version of fluent forms pro. Please update to latest version'));
                            return;
                        }
                        this.$fail(error.responseJSON.data.message);
                    })
                    .always(() => {
                        this.getLogs();
                        this.replaying[singlelog.id] = false;
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getAvailableFilters() {
                const url = FluentFormsGlobal.$rest.route('getLogFilters');

                FluentFormsGlobal.$rest.get(url, {type: 'api'})
                    .then(response => {
                        this.available_statuses = response.statuses;
                        this.available_forms = response.forms;
                        this.available_components = response.components;
                    })
            },
            getReadableName(actionName) {
                if(!actionName) {
                    return 'n/a';
                }
                let newName = actionName.replace('fluentform_integration_notify_', '')
                    .replace('fluentform_', '')
                    .replace('_notification_feed', '')
                    .replace('_', ' ');
                return newName;
            },
            goToPage(value) {
                scrollTop().then(_ => {
                    this.paginate.current_page = value;
                    this.getLogs();
                })
            },
            handleSizeChange(value) {
                scrollTop().then(_ => {
                    localStorage.setItem('apiLogsPerPage', value);
                    this.paginate.per_page = value;
                    this.getLogs();
                })
            },
            setPaginate(data = {}) {
                this.paginate = {
                    total: data.total || 0,
                    current_page: data.current_page || 1,
                    last_page: data.last_page || 1,
                    per_page: data.per_page || localStorage.getItem('apiLogsPerPage') || 10,
                }
            },
        },
        computed: {
            hasPro() {
                return !!window.FluentFormApp.hasPro;
            }
        },
        mounted() {
            this.getLogs();
            this.getAvailableFilters();
        },
        created() {
            if (this.app.status_query != ''){
                this.selected_status = [this.app.status_query];
            }
            if (this.app.source_query != ''){
                this.selected_component = [this.app.source_query];
            }
            if (this.app.date_start_query != '' && this.app.date_end_query != ''){
                this.filter_date_range = [this.app.date_start_query,this.app.date_end_query ]
            }
        }
  }
</script>
