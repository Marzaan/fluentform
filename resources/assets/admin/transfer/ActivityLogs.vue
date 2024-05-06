<template>
    <div class="ff_activity_logs">
        <card>
            <card-head>
                <h5 class="title">{{ $t('Activity Logs') }}</h5>
                <p class="text">
                    {{ ('Get all form submissions and general activity logs here. Track activity of your forms.') }}
                </p>
            </card-head>
            <card-body>
                <el-row :gutter="24">
                    <el-col :span="5">
                        <div class="ff_form_group">
                            <h6 class="mb-3 fs-15">Form</h6>
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
                            <h6 class="mb-3 fs-15">{{ $t('Source') }}</h6>
                            <el-select class="w-100" @change="getLogs()" multiple clearable v-model="selected_component" :placeholder="$t('Select Component')">
                                <el-option
                                    v-for="item in available_components"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="ff_form_group">
                            <h6 class="mb-3 fs-15">{{ $t('Status') }}</h6>
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
				                :default-time="['00:00:01', '23:59:59']"
				                range-separator="-"
                                align="right"
				                :start-placeholder="$t('Start date')"
				                :end-placeholder="$t('End date')">
			                </el-date-picker>
		                </div>
	                </el-col>
                </el-row>

                <div class="ff_activity_logs_body mt-4">
                    <el-skeleton :loading="loading" animated :rows="10">
                        <div v-if="multipleSelection.length" class="logs_actions mb-3">
                            <remove icon="el-icon-delete" @on-confirm="deleteItems()">
                                <button type="button" class="el-button el-button--danger el-button--mini">
                                    <i class="el-icon-delete"></i>
                                    <span>{{ $t('Delete Selected Logs') }}</span>
                                </button>
                            </remove>
                        </div>

                        <el-table
                            :data="logs"
                            stripe
                            class="entry_submission_log ff_table_s2"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column sortable type="selection" width="50"></el-table-column>
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <p v-html="props.row.description"></p>
                                </template>
                            </el-table-column>
                            <el-table-column sortable prop="id" width="100px" :label="$t('ID')"></el-table-column>
                            <el-table-column sortable width="140px" :label="$t('Submission ID')">
                                <template slot-scope="props">
                                    <a v-if="props.row.submission_url" :href="props.row.submission_url">#{{props.row.source_id}}</a>
                                    <span v-else>n/a</span>
                                </template>
                            </el-table-column>
                            <el-table-column sortable :label="$t('Form')">
                                <template slot-scope="props">
                                    <span v-if="props.row.form_title">{{props.row.form_title}}</span>
                                    <span v-else>{{ $t('General Log') }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column sortbale prop="title" :label="$t('Title')"></el-table-column>
                            <el-table-column sortable prop="status" :label="$t('Status')" width="100">
                                <template slot-scope="props">
                                    <el-tag :type="getStatusClass(props.row.status)" size="small" class="el-tag--pill text-capitalize">
                                        {{props.row.status}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column sortable :label="$t('Component')">
                                <template slot-scope="props">
                                    <div>{{ props.row.component }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="created_at" :label="$t('Date')" width="180"></el-table-column>
                            <el-table-column width="115" fixed="right" align="center" :label="$t('Action')">
                                <template slot-scope="props">
                                    <btn-group size="sm">
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
            </card-body>
        </card>
    </div>
</template>

<script type="text/babel">
    import each from 'lodash/each';
    import remove from "../components/confirmRemove";
    import Card from '@/admin/components/Card/Card.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import { scrollTop } from '@/admin/helpers';
    import BtnGroup from "@/admin/components/BtnGroup/BtnGroup.vue";
    import BtnGroupItem from "@/admin/components/BtnGroup/BtnGroupItem.vue";

    export default {
        name: 'ActivityLogs',
	    props: ['app'],
        components:{
            remove,
            Card,
            CardHead,
            CardBody,
            BtnGroup,
            BtnGroupItem
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
                paginate: {
                    total: 0,
                    current_page: 1,
                    last_page: 1,
                    per_page: localStorage.getItem('activityLogsPerPage') || 10
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
			            }, {
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

                FluentFormsGlobal.$rest.delete(url, {log_ids: logIds})
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getAvailableFilters() {
                const url = FluentFormsGlobal.$rest.route('getLogFilters');

                FluentFormsGlobal.$rest.get(url)
                    .then(response => {
                        this.available_statuses = response.statuses;
                        this.available_forms = response.forms;
                        this.available_components = response.components;
                    })
            },
            goToPage(value) {
                scrollTop().then(() => {
                    this.paginate.current_page = value;
                    this.getLogs();
                })
            },
            handleSizeChange(value) {
                scrollTop().then((res) => {
                    localStorage.setItem('activityLogsPerPage', value)
                    this.paginate.per_page = value;
                    this.getLogs();
                })
            },
            setPaginate(data = {}) {
                this.paginate = {
                    total: data.total || 0,
                    current_page: data.current_page || 1,
                    last_page: data.last_page || 1,
                    per_page: data.per_page || localStorage.getItem('activityLogsPerPage') || 10,
                }
            },
            getStatusClass(status) {
                if (status == 'failed') {
                    return 'danger';
                }else if (status == 'success') {
                    return 'success';
                }else if (status == 'warning') {
                    return 'warning';
                }else  {
                    return 'info';
                }
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
			    this.filter_date_range = [this.app.date_start_query, this.app.date_end_query]
		    }
	    }
    }
</script>
