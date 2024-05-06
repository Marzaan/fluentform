<template>
    <div class="ff_entries_wrapper">
        <section-head class="ff_section_head_between mb-0">
            <section-head-content>
                <h1 class="ff_section_title">{{$t('Entries from All Forms')}}</h1>
            </section-head-content>
            <section-head-content>
                <btn-group as="div">
                    <btn-group-item as="div">
                        <el-button @click="showImportEntriesModal = true" type="primary" class="el-button">
                            {{ $t('Import Entries') }}
                        </el-button>
                    </btn-group-item>
                    <btn-group-item as="div">
                        <el-button @click="toggleChart()" type="primary" class="el-button--soft-2">
                            {{ chart_status == 'yes' ? $t('Hide Chart') : $t('Show Chart')}}
                        </el-button>
                    </btn-group-item>
                    <btn-group-item as="div">
                        <div class="ff_advanced_filter_wrap">
                            <el-button @click="advancedFilter = !advancedFilter" :class="this.filter_date_range && 'ff_filter_selected'">
                                <span>{{ $t('Filter') }}</span>
                                <i v-if="advancedFilter" class="ff-icon el-icon-circle-close"></i>
                                <i v-else class="ff-icon ff-icon-filter"></i>
                            </el-button>
                            <div v-if="advancedFilter" class="ff_advanced_search">
                                <div class="ff_advanced_search_radios">
                                    <el-radio-group v-model="radioOption" class="el-radio-group-column">
                                        <el-radio label="all">All</el-radio>
                                        <el-radio label="today">Today</el-radio>
                                        <el-radio label="yesterday">Yesterday</el-radio>
                                        <el-radio label="last-week">Last Week</el-radio>
                                        <el-radio label="last-month">Last Month</el-radio>
                                    </el-radio-group>
                                </div>
                                <div class="ff_advanced_search_date_range">
                                    <p>{{$t('Filter By Date Range')}}</p>
                                    <el-date-picker
                                        v-model="filter_date_range"
                                        type="daterange"
                                        @change="filterDateRangedPicked"
                                        :picker-options="pickerOptions"
                                        format="dd MMM, yyyy"
                                        value-format="yyyy-MM-dd"
                                        range-separator="-"
                                        :start-placeholder="$t('Start date')"
                                        :end-placeholder="$t('End date')">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                    </btn-group-item>
                </btn-group>
            </section-head-content>
        </section-head>

        <div v-if="chart_status == 'yes'" ref="entry_chart" class="entry_chart mt-4 mb-4">
            <entry-chart :form_id="selectedFormId" :date_range="filter_date_range" :entry_status="entry_status" ></entry-chart>
        </div>

        <ImportEntriesModal :app="app" :visibility.sync="showImportEntriesModal" />

        <div class="ff_entries_details">
            <div class="ff_section_head sm">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <div class="lead-title mb-3">Form</div>
                    </el-col>
                    <el-col :span="17">
                        <el-row :gutter="18">
                            <el-col :span="8">
                                <div class="ff_entries_select">
                                    <el-select
                                        class="ff_filter_form_select ff-input-s1 w-100"
                                        @change="fetchEntries()"
                                        clearable
                                        filterable
                                        v-model="selectedFormId"
                                        :placeholder="$t('Select Form')"
                                    >
                                        <el-option
                                            v-for="item in available_forms"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="13">
                                <div class="ff_radio_group_wrap">
                                    <el-radio-group class="ff_radio_group_s2" @change="fetchEntries('reset')" v-model="entry_status">
                                        <el-radio-button label="">{{ $t('All') }}</el-radio-button>
                                        <el-radio-button label="unread">{{ $t('Unread Only') }}</el-radio-button>
                                        <el-radio-button label="read">{{ $t('Read Only') }}</el-radio-button>
                                    </el-radio-group>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="7">
                        <div class="ff_entries_search_wrap">
                            <el-input
                                @keyup.enter.native="fetchEntries()"
                                clearable
                                v-model="search"
                                :placeholder="$t('Search Forms')"
                                prefix-icon="el-icon-search"
                                class="ff-input-s1"
                            >
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="ff_table_wrap">
                <div class="ff_table">
                    <el-skeleton :loading="loading" animated :rows="10">
                        <el-table :data="entries">
                            <el-table-column width="200" prop="id" sortable :label="$t('Submission ID')">
                                <template slot-scope="scope">
                                    <a :href="scope.row.entry_url" >
                                        <span>#{{scope.row.id}}</span>
                                        <span class="ff_payment_badge" v-if="scope.row.total_paid">{{formatMoney(scope.row)}}</span>
                                    </a>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('Form')" sortable prop="form.title" width="400"></el-table-column>
                            <el-table-column width="150" prop="status" sortable :label="$t('Status')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status ==  'read' ">{{$t('Read')}}</span>
                                    <span v-else-if="scope.row.status ==  'unread' ">{{$t('Unread')}}</span>
                                    <span v-else>{{scope.row.status|ucFirst}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :label="$t('Browser')" prop="browser"></el-table-column>
                            <el-table-column width="150" :label="$t('Time')">
                                <template slot-scope="scope">
                                    {{scope.row.human_date}} {{$t('ago')}}
                                </template>
                            </el-table-column>
                            <el-table-column width="150" :label="$t('Action')">
                                <template slot-scope="scope">
                                    <a :href="scope.row.entry_url" class="el-button el-button--primary el-button--soft el-button--small">
                                        <i class="ff-icon ff-icon-eye"></i>
                                        <span>{{$t('View')}}</span>
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-skeleton>
                </div><!-- .ff_table -->
                <div class="ff_pagination_wrap text-right mt-4">
                    <el-pagination
                        class="ff_pagination"
                        background
                        @size-change="handleSizeChange"
                        @current-change="goToPage"
                        :hide-on-single-page="false"
                        :current-page.sync="paginate.current_page"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        :page-size="parseInt(paginate.per_page)"
                        layout="total, sizes, prev, pager, next"
                        :total="paginate.total"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import EntryChart from './chartView';
import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
import SectionHead from '@/admin/components/SectionHead/SectionHead.vue';
import SectionHeadContent from '@/admin/components/SectionHead/SectionHeadContent.vue';
import {scrollTop} from '@/admin/helpers';
import ImportEntriesModal from "@/admin/components/modals/ImportEntriesModal.vue";

export default {
    name: 'AllEntries',
    components: {
        EntryChart,
        BtnGroup,
        BtnGroupItem,
        SectionHead,
        SectionHeadContent,
        ImportEntriesModal
    },
    data() {
        return {
            entries: [],
            loading: false,
            selectedFormId: '',
            available_forms: [],
            advancedFilter: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() >= Date.now();
                },
                shortcuts: [
                    {
                        text: 'Today',
                        onClick(picker) {
                            const start = new Date();
                            picker.$emit('pick', [start, start]);
                        }
                    },
                    {
                        text: 'Yesterday',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, start]);
                        }
                    },
                    {
                        text: 'Last week',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last month',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            filter_date_range: null,
            selectedPaymentMethods: [],
            selectedPaymentStatuses: [],
            paginate: {
                total: 0,
                current_page: +(localStorage.getItem('entriesCurrentPage') || 1),
                last_page: 1,
                per_page: localStorage.getItem('entriesPerPage') || 10
            },
            chart_status: 'yes',
            entry_status: '',
            search: '',
            radioOption: 'all',
            showImportEntriesModal: false,
            app: window.fluent_forms_global_var
        }
    },
    methods: {
        fetchEntries(type) {
            if (type == 'reset') {
                this.paginate.current_page = 1;
            }
	        if (this.advancedFilter) {
		        this.advancedFilter = false;
	        }
            this.loading = true;
            const url = FluentFormsGlobal.$rest.route('getAllSubmissions');
            let data = {
                form_id: this.selectedFormId,
                page: this.paginate.current_page,
                per_page: this.paginate.per_page,
                search: this.search,
                entry_type: this.entry_status
            }
            if (this.hasEnabledDateFilter) {
                data.date_range = this.filter_date_range;
            }
            FluentFormsGlobal.$rest.get(url, data)
                .then(response => {
                    this.entries = response.data;
                    this.setPaginate(response);
                    this.available_forms = response.available_forms;
                })
                .catch(error => {
                    this.$fail(error.message);
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        setPaginate(data = {}) {
            this.paginate = {
                total: data.total || 0,
                current_page: data.current_page || +(localStorage.getItem('entriesCurrentPage') || 1),
                last_page: data.last_page || 1,
                per_page: data.per_page || localStorage.getItem('entriesPerPage') || 20,
            }
        },
        goToPage(value) {
            let top = this.chart_status === 'yes' ? this.$refs?.entry_chart.clientHeight : 100;
            scrollTop(top).then((_) => {
	            localStorage.setItem('entriesCurrentPage', value);
                this.paginate.current_page = value;
                this.fetchEntries();
            })
        },
        handleSizeChange(val) {
            let top = this.chart_status === 'yes' ? this.$refs?.entry_chart.clientHeight : 100;
            scrollTop(top).then((_) => {
                localStorage.setItem('entriesPerPage', val)
                this.paginate.per_page = val;
                this.fetchEntries();
            })
        },
        formatMoney(row) {
            let amount = row.total_paid / 100;
            if (parseFloat(amount) % 1) {
                amount = parseFloat(amount).toFixed(2);
            }
            return amount + ' ' + row.currency;
        },
        toggleChart() {
            if (this.chart_status == 'yes') {
                this.chart_status = 'no';
            } else {
                this.chart_status = 'yes';
            }
            localStorage.setItem('ff_chart_status', this.chart_status);
        },
	    filterDateRangedPicked() {
			this.radioOption = '';
			this.fetchEntries();
        },
        resetAdvancedFilter() {
            this.radioOption = "";
			this.filter_date_range = null;
            this.fetchEntries();
        }
    },
    computed: {
	    hasEnabledDateFilter() {
			return !!(this.radioOption && this.radioOption != 'all' ||
				(Array.isArray(this.filter_date_range) && this.filter_date_range.join(''))
            );
        }
    },
    watch: {
        radioOption() {
            const start = new Date();
            const end = new Date();
            let number = 1;
            switch (this.radioOption) {
                case 'today' :
					number = 0;
					break;
                case 'yesterday':
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * number);
                    break;
                case 'last-week':
                    number = 7;
                    break;
                case 'last-month':
                    number = 30;
                    break;
                case 'all':
                    this.filter_date_range = null;
                    this.fetchEntries();
                    return;
                default:
                    return;
            }
            start.setTime(start.getTime() - 3600 * 1000 * 24 * number);
            const startDate = start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate();
            const endDate = end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate();
            this.filter_date_range = [startDate, endDate];
            this.fetchEntries();
        }
    },
    filters: {
        ucFirst: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    mounted() {
        let status = localStorage.getItem('ff_chart_status');
        if (status) {
            this.chart_status = status;
        }
        this.fetchEntries();
    }
};
</script>

