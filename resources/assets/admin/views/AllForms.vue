<template>
    <div>
        <section-head size="sm">
            <h1 class="ff_section_title">{{ $t('Forms') }}</h1>
        </section-head>
        <el-row class="ff_all_forms_action_row">
            <el-col :sm="12">
                <btn-group as="div">
                    <btn-group-item as="div">
                        <el-select
                            clearable
                            v-model="filter_by"
                            :placeholder="$t('All Types')"
                            @change="filterFormType()"
                            class="ff-input-s1 all-forms-select"
                        >
                            <el-option
                                v-for="(status, status_key) in form_statuses"
                                :key="status_key"
                                :value="status_key"
                                :label="$t(status)"
                            >
                                {{ $t(status) }}
                            </el-option>
                        </el-select>
                    </btn-group-item>
                    <btn-group-item as="div">
                        <el-button
                            v-if="hasPermission('fluentform_forms_manager')"
                            type="primary"
                            @click.prevent="showAddFormModal = true"
                        >
                            <i class="el-icon-plus el-icon-left el-icon"></i>
                            <span>{{ $t('Add New Form') }}</span>
                        </el-button>
                    </btn-group-item>
                </btn-group>
            </el-col>
            <el-col :sm="12">
                <div class="ff_filter_wrap ff_row justify-end">
                    <btn-group as="div">
                        <btn-group-item as="div">
                            <el-form @submit.native.prevent="searchForms">
                                <el-input
                                    clearable
                                    @clear="refetchItems"
                                    v-model="searchFormsKeyWord"
                                    :placeholder="$t('Search Forms')"
                                    prefix-icon="el-icon-search"
                                    class="all-forms-search"
                                >
                                </el-input>
                            </el-form>
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
                                            <el-radio label="all">{{$t('All')}}</el-radio>
                                            <el-radio label="today">{{$t('Today')}}</el-radio>
                                            <el-radio label="yesterday">{{$t('Yesterday')}}</el-radio>
                                            <el-radio label="last-week">{{$t('Last Week')}}</el-radio>
                                            <el-radio label="last-month">{{$t('Last Month')}}</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="ff_advanced_search_date_range">
                                        <p>{{$t('Select a Timeframe')}}</p>
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
                            </div><!-- .ff_advanced_filter_wrap -->
                        </btn-group-item>
                    </btn-group>
                </div><!--.ff_row -->
            </el-col>
        </el-row>

        <div class="ff_forms_table mt-4">
            <template v-if="app.formsCount > 0">
                <div class="ff_table">
                    <el-skeleton :loading="loading" animated :rows="10">
                        <el-table
                            :data="items"
                            :stripe="true"
                            @sort-change="handleTableSort"
                            @selection-change="handleSelectionChange"
                            :row-class-name="tableRowClass"
                        >
                            <el-table-column sortable="custom" :label="$t('ID')" prop="id" width="40"></el-table-column>

                            <el-table-column sortable="custom" :label="$t('Title')" prop="title" min-width="400">
                                <template slot-scope="scope">
                                    <strong>
                                        {{ scope.row.title }}
                                    </strong>
                                    <span v-show="scope.row.has_payment == '1'" class="el-icon el-icon-money"></span>
                                    <div class="row-actions">
                                        <template v-if="hasPermission('fluentform_forms_manager')">
                                            <span class="row-actions-item ff_edit">
                                                <a :href="scope.row.edit_url"> {{ $t('Edit') }}</a>
                                            </span>
                                            <span class="row-actions-item ff_edit">
                                                <a :href="scope.row.settings_url"> {{ $t('Settings') }}</a>
                                            </span>
                                        </template>
                                        <span v-if="hasPermission('fluentform_entries_viewer')" class="row-actions-item ff_entries">
                                                <a :href="scope.row.entries_url"> {{ $t('Entries') }}</a>
                                        </span>
                                        <span v-if="scope.row.conversion_preview" class="row-actions-item ff_entries">
                                                <a target="_blank" :href="scope.row.conversion_preview"> {{ $t('Conversational Preview') }}</a>
                                        </span>
                                        <span class="row-actions-item ff_entries">
                                            <a target="_blank" :href="scope.row.preview_url"> {{ $t('Preview') }}</a>
                                        </span>

                                        <template v-if="hasPermission('fluentform_forms_manager')">
                                            <span class="row-actions-item ff_duplicate">
                                                <a href="#" @click.prevent="duplicateForm(scope.row.id)"> {{
                                                        $t('Duplicate')
                                                }}</a>
                                            </span>
                                            <span class="row-actions-item ff_export">
                                                <a href="#" @click.prevent="exportForm(scope.row.id)"> {{
                                                        $t('Export')
                                                    }}</a>
                                            </span>
                                            <span class="row-actions-item ">
                                                <a href="#" @click.prevent="findShortCodeLocation(scope.row.id)"> {{
                                                        $t('Find')
                                                    }}
                                                <i class="el-icon-loading" v-if="loadingLocations"></i></a>
                                            </span>
                                            <span class="row-actions-item trash">
                                                <remove @on-confirm="removeForm(scope.row.id, scope.$index)">
                                                    <a href="#" @click.prevent>{{ $t('Delete') }}</a>
                                                </remove>
                                            </span>
                                            <el-switch
                                                class="el-switch--small"
                                                :active-text="scope.row.status === 'published' ? $t('Active') : $t('Inactive')"
                                                @change="toggleStatus(scope.row.id, scope.row.title, scope.row.status)"
                                                active-value="published"
                                                inactive-value="unpublished"
                                                v-model="scope.row.status"
                                            />

                                        </template>
                                        <div class="form-locations" v-if="Object.keys(formLocations).includes(scope.row.id) && formLocations[scope.row.id].length >= 1">
                                            {{$t('Found in')}}
                                            <ul class="ff_inline_list">
                                                <li v-for="(location, index) in formLocations[scope.row.id] " :key="index">
                                                    <a target="_blank" :href="location.edit_link">
                                                        <code class="item ">{{location.title}}</code>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div v-if="Object.keys(formLocations).includes(scope.row.id) && formLocations[scope.row.id].length == 0 ">
                                            {{$t('Could not find anywhere')}}
                                        </div>

                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('ShortCode')" width="240">
                                <template slot-scope="scope">
                                    <div class="ff_shortcode_wrap">
                                        <code class="copy ff_shortcode_btn ff_shortcode_btn_thin" title="Click to copy" :data-clipboard-text='`[fluentform id="${scope.row.id}"]`'>
                                            <span><i class="el-icon el-icon-document-copy"></i> [fluentform id="{{ scope.row.id }}"]</span>
                                        </code>
                                    </div>

                                    <div class="ff_shortcode_wrap ff_conversational_shortcode" v-if="scope.row.conversion_preview">
                                        <code class="copy ff_shortcode_btn ff_shortcode_btn_thin" title="Click to copy" :data-clipboard-text='`[fluentform type="conversational" id="${scope.row.id}"]`'>
                                            <span><i class="el-icon el-icon-document-copy"></i> [fluentform type="conversational" id="{{
                                            scope.row.id }}"]</span>
                                        </code>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column width="120" align="center">
                                <template slot="header">
                                    {{$t('Entries')}}
                                    <el-tooltip class="item" placement="bottom" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <h6>{{ $t('Numbers of entries') }}</h6>
                                            <p>
                                                {{ $t('Unread / Total Entries') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-gray ff-icon-info-filled"/>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="scope">
                                    <a :href="scope.row.entries_url"><span
                                        v-show="scope.row.unread_count">{{ scope.row.unread_count }} / </span>{{
                                        scope.row.total_Submissions
                                        }}</a>
                                </template>
                            </el-table-column>

                            <el-table-column v-if="!isDisabledAnalytics" :label="$t('Views')" width="60" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.total_views }}
                                </template>
                            </el-table-column>

                            <el-table-column v-if="!isDisabledAnalytics" width="130" align="center">
                                <template slot="header">
                                    {{$t('Conversion')}}
                                    <el-tooltip class="item" placement="bottom" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>{{ $t('Percentage of total submission and Total views') }}</p>
                                        </div>

                                        <i class="ff-icon ff-icon-gray ff-icon-info-filled"/>
                                    </el-tooltip>
                                </template>

                                <template slot-scope="scope">
                                    {{ scope.row.conversion }}%
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-skeleton>
                </div>
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
            </template>
            <template v-else>
                <el-row :gutter="24">
                    <el-col :lg="12">
                        <card class="fluent_form_intro" style="height: 390px;">
                            <card-body>
                                <h2 class="mb-3">{{ $t('Welcome to WP Fluent Forms') }}</h2>
                                <p class="mb-4 fs-17">{{ $t('Thank you for installing WP Fluent Forms - The Most Advanced Form Builder Plugin for WordPress.') }}
                                </p>
                                <el-button type="primary" size="large" @click="showAddFormModal = true">
                                    {{$t('Click Here to Create Your First Form')}}
                                </el-button>
                            </card-body>
                        </card>
                    </el-col>
                    <el-col :lg="12">
                        <card class="fluent_form_intro_video">
                            <h2 class="mb-4">{{$t('Check the Video Intro')}}</h2>
                            <iframe src="https://www.youtube.com/embed/AqVr0l1JrGE"
                                frameborder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                        </card>
                    </el-col>
                </el-row>
            </template>
        </div>

        <CreateNewFormModal
            v-if="hasPermission('fluentform_forms_manager')"
            ref="predefinedFormsModal"
            :visibility.sync="showAddFormModal"
        />
    </div>
</template>

<script type="text/babel">
import Clipboard from 'clipboard';
import remove from '@/admin/components/confirmRemove'
import CreateNewFormModal from '@/admin/components/modals/CreateNewFormModal';
import moment from "moment";
import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
import SectionHead from '@/admin/components/SectionHead/SectionHead.vue';
import Card from '@/admin/components/Card/Card.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import {scrollTop} from '@/admin/helpers';

export default {
    name: 'AllForms',
    components: {
        CreateNewFormModal,
        remove,
        BtnGroup,
        BtnGroupItem,
        SectionHead,
        Card,
        CardBody
    },
    data() {
        return {
            has_post_feature: !!window.FluentFormApp.has_post_feature,
            app: window.FluentFormApp,
            paginate: {
                total: 0,
                current_page: +(localStorage.getItem('formItemsCurrentPage') || 1),
                last_page: 1,
                per_page: localStorage.getItem('formItemsPerPage') || 10
            },
            loading: true,
            items: [],
            search_string: '',
            selectAll: 0,
            showAddFormModal: false,
            checkedItems: [],
            showSelectFormModal: false,
            advancedFilter: false,
            filter_date_range: null,
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
            filter_by:'all',
            form_statuses: {
                all: 'All',
                published: 'Active',
                unpublished: 'Inactive',
                is_payment: 'Payment Form',
                post: 'Post Form',
                conv_form: 'Conversational Form',
                step_form: 'Multi-Step Form'
            },
            searchFormsKeyWord: '',
            clearingSearchKeyword: false,
            postTypeSelectionDialogVisibility: false,
            isDisabledAnalytics: !!window.FluentFormApp.isDisableAnalytics,
            sort_column: 'id',
            sort_by: 'DESC',
            formLocations: {},
            loadingLocations: false,
            radioOption: 'all'
        }
    },
    methods: {
        toggleStatus(id, title, status) {
            this.loading = true;

            let data = {
                title,
                status,
            };

            const url = FluentFormsGlobal.$rest.route('updateForm', id);

            FluentFormsGlobal.$rest.post(url, data)
                .then((response) => {
                    this.$success(response.message);
                })
                .catch(error => {
                    this.$fail(error.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        goToPage(val) {
            scrollTop().then(_ => {
	            localStorage.setItem('formItemsCurrentPage', val);
                this.paginate.current_page = val
                this.fetchItems();
            });
        },
        handleSizeChange(val) {
            scrollTop().then(_ => {
                localStorage.setItem('formItemsPerPage', val);
                this.paginate.per_page = val;
                this.fetchItems();
            })
        },
        fetchItems() {
	        if (this.advancedFilter) {
		        this.advancedFilter = false;
	        }
            this.loading = true;
            let data = {
                search: this.searchFormsKeyWord,
                filter_by: this.filter_by,
                per_page: this.paginate.per_page,
                page: this.paginate.current_page,
                sort_column: this.sort_column,
                sort_by: this.sort_by
            };
            if (this.hasEnabledDateFilter) {
              data.date_range = this.filter_date_range;
            }

            const url = FluentFormsGlobal.$rest.route('getForms');
            FluentFormsGlobal.$rest.get(url, data)
                .then((response) => {
                    this.items = response.data;
                    this.paginate.total = response.total;
                    this.paginate.current_page = response.current_page;
                    this.paginate.last_page = response.last_page;
                })
                .catch(error => {
                    this.$fail(this.$t('Something went wrong, please try again.'));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        refetchItems() {
            this.paginate.current_page = 1;
            this.clearingSearchKeyword = true;
            this.fetchItems();
            this.$nextTick(() => {
                this.clearingSearchKeyword = false;
            });
        },
        removeForm(id, index) {
            const url = FluentFormsGlobal.$rest.route('deleteForm', id);

            FluentFormsGlobal.$rest.delete(url)
                .then(res => {
                    this.items.splice(index, 1);
                    this.$success(res.message);
                })
                .catch(error => {
                    this.$fail(error.message);
                });
        },
        duplicateForm(id) {
            const url = FluentFormsGlobal.$rest.route('duplicateForm', id);

            FluentFormsGlobal.$rest.post(url)
                .then(res => {
                    this.$success(res.message);
                    if (res.redirect) {
                        window.location.href = res.redirect;
                    } else {
                        this.$fail(this.$t('Something is wrong! Please try again'));
                    }
                })
                .catch(error => {
                    this.$fail(error.message);
                });
        },
        handleTableSort(column) {
            if (column.order) {
                this.sort_column = column.prop;
                this.sort_by = (column.order === 'ascending') ? 'ASC' : 'DESC';
                this.fetchItems();
            }
        },
        handleSelectionChange(val) {
            this.entrySelections = val;
        },
        searchForms(event) {
            this.paginate.current_page = 1;
            this.fetchItems();
        },
        createForm({key, form}) {
            if (key === 'post') {
                return this.createPostForm(key, form);
            }

            this.$refs.predefinedFormsModal.createForm(
                key, // formType
                form // form
            );
        },
        createPostForm(key, form) {
            this.postTypeSelectionDialogVisibility = true;
        },
        onPostTypeSelctionEnd(post_type) {
            this.postTypeSelectionDialogVisibility = false;

            if (post_type) {
                this.$refs.predefinedFormsModal.doCreateForm({
                    post_type,
                    type: 'post',
                    title: 'Post Form',
                    predefined: 'blank_form',
                    action: 'fluentform-predefined-create'
                });
            }
        },
        resetAdvancedFilter() {
		  this.radioOption = "";
		  this.filter_date_range = null;
          this.fetchItems();
        },
	    filterDateRangedPicked() {
		    this.radioOption = "";
			this.fetchItems();
        },
        filterFormType() {
          this.search_string = '';
          this.setDefaultPaginate();
          this.fetchItems();
        },
        setDefaultPaginate() {
          this.paginate = {
            total: 0,
            current_page: +(localStorage.getItem('formItemsCurrentPage') || 1),
            last_page: 1,
            per_page: localStorage.getItem('formItemsPerPage') || 10
          }
        },
        tableRowClass({row}) {
            return row.status == 'unpublished' ? 'inactive_form' : '';
        },
        findShortCodeLocation(formId){

            this.loadingLocations = true;
            const url = FluentFormsGlobal.$rest.route('findFormShortCodePage',formId);
            FluentFormsGlobal.$rest.get(url)
                .then(res => {
                    console.log(res)
                    if (res.status === true){
                        this.$set(this.formLocations, formId, res.locations);
                    }else{
                        this.$set(this.formLocations, formId, []);
                    }
                })
                .catch(error => {
                    this.$fail(this.$t('Something went wrong, please try again.'));
                })
                .finally(()=>{
                    this.loadingLocations = false;
                })
            ;
        },
        exportForm(id) {
            const data = {
	            action: 'fluentform-export-forms',
                forms: [id],
                format: 'json',
	            fluent_forms_admin_nonce: window.fluent_forms_global_var.fluent_forms_admin_nonce
            };
	        location.href = ajaxurl + '?' + jQuery.param(data);
        }
    },
    computed: {
	    hasEnabledDateFilter() {
		    return !!(this.radioOption && this.radioOption != 'all' ||
			    (Array.isArray(this.filter_date_range) && this.filter_date_range.join(''))
		    );
        }
    },
    mounted() {
        this.fetchItems();
        (new Clipboard('.copy')).on('success', event => {
            this.$copy();
        });
    },
    created() {
        let hash = window.location.hash;

        if (hash.indexOf('add=1') != -1) {
            this.showAddFormModal = true;
        }

        if (hash.indexOf('entries') != -1) {
            this.showSelectFormModal = true;
        }

        jQuery('a[href="admin.php?page=fluent_forms#add=1"]').on('click', event => {
            this.showAddFormModal = true;
            this.showSelectFormModal = false;
        });

        jQuery('a[href="admin.php?page=fluent_forms#entries"]').on('click', event => {
            this.showAddFormModal = false;
            this.showSelectFormModal = true;
        });


    },
    watch: {
        searchFormsKeyWord: function (newVal, oldVal) {
            if ((oldVal && !newVal) && !this.clearingSearchKeyword) {
                this.paginate.current_page = 1;
                this.fetchItems();
            }
        },
        radioOption() {
            const start = new Date();
            const end = new Date();
            let number = 1;
            switch (this.radioOption) {
                case 'today':
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
                    this.fetchItems();
                    return;
                default:
                    return;
            }
            start.setTime(start.getTime() - 3600 * 1000 * 24 * number);
            const startDate = start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate();
            const endDate = end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate();
            this.filter_date_range = [startDate, endDate];
            this.fetchItems();
        }
    }
};
</script>
<style scoped>
.el-dropdown-menu{
  z-index: 9999 !important;
}
</style>

