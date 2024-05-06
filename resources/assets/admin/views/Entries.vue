<template>
    <div class="ff_entries_wrap">
        <section-head class="ff_section_head_between items-center" size="sm">
            <section-head-content>
                <h1 class="ff_section_title">{{$t('Entries')}}</h1>
            </section-head-content>
            <section-head-content>
                <btn-group>
                    <btn-group-item as="div">
                        <el-button @click="gotoVisualReport()" type="primary">
                            <i class="ff-icon ff-icon-donut-chart"></i>
                            <span>{{ $t('View Visual Report') }}</span>
                        </el-button>
                    </btn-group-item>
                    <btn-group-item as="div">
                        <el-button @click="showImportEntriesModal = true"  class="el-button">
                            {{ $t('Import') }}
                        </el-button>
                    </btn-group-item>
                    <btn-group-item as="div">
                        <el-dropdown @command="selectFieldsToExport" trigger="click">
                            <el-button>
                                {{ $t('Export') }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="csv">{{ $t('Export as') }} CSV</el-dropdown-item>
                                <el-dropdown-item command="xlsx">{{ $t('Export as') }} Excel (xlsv)</el-dropdown-item>
                                <el-dropdown-item command="ods">{{ $t('Export as') }} ODS</el-dropdown-item>
                                <el-dropdown-item command="json">{{ $t('Export as') }} JSON Data</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </btn-group-item>
                    <btn-group-item as="div">
                        <el-dropdown
                            @command="handleSwitchForm"
                            class="current_form_name"
                            trigger="click"
                        >
                            <el-button>
                                {{ current_form_title }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" style="max-height:300px; overflow-y:scroll;">
                                <el-dropdown-item
                                        v-for="form in forms"
                                        :key="'form_switch_'+form.id"
                                        :command="form.id"
                                        :disabled="form.id == form_id"
                                >{{ form.title }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </btn-group-item>
                </btn-group>
            </section-head-content>
        </section-head>

        <div class="separator mb-4"></div>

        <section-head class="ff_form_editor_entries_actions ff_section_head_between items-center" size="sm">
            <section-head-content>
                 <btn-group class="ff_entries_select_wrap" as="div">
                    <template v-if="entrySelections.length">
                        <btn-group-item as="div">
                            <label for="bulk-action-selector-top" class="screen-reader-text">
                                {{ $t('Select bulk action') }}
                            </label>
                            <el-select
                                    clearable
                                    :placeholder="$t('Bulk Actions')"
                                    id="bulk-action-selector-top"
                                    name="action"
                                    popper-class="el-big-items"
                                    v-model="bulkAction"
                            >
                                <el-option-group
                                        v-for="(group,groupKey) in bulkActions"
                                        :key="groupKey"
                                        :label="groupKey"
                                >
                                    <el-option
                                            v-for="item in group"
                                            :key="item.action"
                                            :label="$t(item.label)"
                                            :value="item.action"
                                    >
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </btn-group-item>
                        <btn-group-item as="div">
                            <el-button type="primary" @click.prevent="handleBulkAction">{{ $t('Apply') }}</el-button>
                        </btn-group-item>
                    </template>
                    <btn-group-item as="div">
                        <el-select
                                clearable
                                v-model="entry_type"
                                :placeholder="$t('All Types')"
                                filterable
                                @change="filterEntryType()"
                        >
                            <el-option
                                    v-for="(status, status_key) in entry_statuses"
                                    :key="status_key"
                                    :value="status_key"
                                    :label="status"
                            >
                                {{ status }}
                                <span v-show="counts[status_key]">({{ counts[status_key] }})</span>
                            </el-option>
                        </el-select>
                    </btn-group-item>
                    <btn-group-item v-if="has_payment" as="div">
                        <el-select
                                clearable
                                multiple
                                v-model="selectedPaymentStatuses"
                                :placeholder="$t('All Payments')"
                                @change="filterPaymentStatuses()"
                        >
                            <el-option
                                    v-for="(status, status_key) in payment_statuses"
                                    :key="status_key"
                                    :value="status_key"
                                    :label="status"
                            >
                                {{ status }}
                            </el-option>
                        </el-select>
                    </btn-group-item>
                </btn-group>
            </section-head-content>
            <section-head-content>
                <btn-group class="ff_entries_report_wrap" as="div">
                    <btn-group-item as="div">
                        <label for="search_bar" class="screen-reader-text">
                            {{ $t('Search Entry') }}
                        </label>
                        <el-input
                                v-on:keyup.enter.native="handleSearch"
                                :placeholder="$t('Search')"
                                v-model="search_string"
                                prefix-icon="el-icon-search"
                                class="ff_entries_report_search"
                        >
                        </el-input>
                    </btn-group-item>

                    <btn-group-item as="div">
                        <el-dropdown trigger="click" class="current_form_name_column" :hide-on-click="false">
                            <el-button>
                                 {{ $t('Columns') }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu class="ff-dropdown-menu" slot="dropdown"
                                style="max-height:300px; overflow-y:scroll;">
                                <el-dropdown-item v-for="(column, column_name) in columns" :key="column_name">
                                    <el-checkbox @change="handleColumnChange" :key="column" :label="column_name"
                                                 v-model="visibleColumns">
                                        {{ column }}
                                    </el-checkbox>
                                </el-dropdown-item>
                                <el-dropdown-item key="column_order" command="column_order">
                                    <el-button @click="visibleColReorderModal = true" type="primary" size="small">
                                        {{ $t('Reorder Column') }}
                                    </el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
                                    <p>{{ $t('Select a Timeframe') }}</p>
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
	                <btn-group-item as="div">
		                <el-button @click="getData" v-loading="loading && visibleColumns">
			                <i class="ff-icon el-icon-refresh"></i>
		                </el-button>
	                </btn-group-item>
                </btn-group>
            </section-head-content>
        </section-head>

        <ImportEntriesModal :app="app" :form_id="form_id" :visibility.sync="showImportEntriesModal" />

        <el-dialog :visible.sync="visibleColReorderModal">
            <template slot="title">
                <h4>{{$t('Change Column Display Order')}}</h4>
            </template>
            <div class="mt-4">
                <ColumnDragAndDrop
                    :columns="columns"
                    :columns_order ="columnsOrder"
                    @save="refreshColumnsOrder"
                    :form_id="form_id"
                    :visible_columns="visibleColumns" >
                </ColumnDragAndDrop>
            </div>
        </el-dialog>

        <el-alert
            v-if="autoDeleteStatus"
            :title="$t('Auto delete entry on form submission is enabled! No new entry data will be saved for this form.')"
            :description="$t('You can disable the auto delete option from Settings & Integrations Tab')"
            type="error">
        </el-alert>

        <div style="min-height: 300px;" class="entries_table">
            <div class="ff_table">
                <el-skeleton :loading="loading" animated :rows="6">
                    <el-table
                         :size="isCompact? 'mini':''"
                        :data="entries"
                        :stripe="true"
                        :class="{'compact': isCompact}"
                        @sort-change="handleTableSort"
                        @selection-change="handleSelectionChange"
                    >

                        <el-table-column type="selection" width="30"></el-table-column>
                        <el-table-column label="#" sortable="custom" prop="id" width="100px" :class-name="idShortByClassName">
                            <template slot-scope="scope">
                                <div class="has_hover_item">
                                    <router-link :to="{
                                            name: 'form-entry',
                                            params: {
                                                form_id: scope.row.form_id,
                                                entry_id: scope.row.id
                                            },
                                            query: {
                                                sort_by: sort_by,
                                                current_page: paginate.current_page,
                                                pos: scope.$index,
                                                type: entry_type
                                            }
                                        }">
                                        {{ scope.row.serial_number }}
                                    </router-link>
                                    <div v-if="scope.row.status != 'trashed'" class="show_on_hover inline_actions">
                                        <span v-if="scope.row.is_favourite != '0'"
                                            @click="changeFavorite(scope.row.id, scope.$index, 0)"
                                            :title="$t('Remove from Favorites')"
                                            class="icon-favorite el-icon-star-on action_button"
                                        />
                                        <span v-else
                                            @click="changeFavorite(scope.row.id, scope.$index, 1)"
                                            :title="$t('Mark as Favorites')"
                                            class="icon-favorite el-icon-star-off action_button"
                                        />

                                        <span v-if="scope.row.status == 'read'"
                                            @click="changeStatus(scope.row.id, scope.$index, 'unread')"
                                            :title="$t('Mark as Unread')"
                                            class="icon-status el-icon-circle-check action_button"
                                        />
                                        <span v-else
                                            @click="changeStatus(scope.row.id, scope.$index, 'read')"
                                            :title="$t('Mark as Read')"
                                            class="icon-status el-icon-finished action_button"
                                        />
                                    </div>

                                    <div class="inline_actions inline_item" v-else>
                                            <span @click="restoreEntry(scope.row.id, scope.$index)" title="Restore"
                                                class="el-icon-circle-check action_button">{{ $t(' Restore') }}</span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column
                                v-for="(column, index) in formattedColumn"
                                :label="column.label"
                                :show-overflow-tooltip="isCompact"
                                min-width="200"
                                sortable="custom"
                                :prop="'user_inputs_column_field-' + column.field"
                                :key="index">
                            <template slot-scope="scope">
                                <span v-html="scope.row.user_inputs[column.field]"></span>
                            </template>
                        </el-table-column>

                        <el-table-column
                                label="Entry Status"
                                sortable
                                prop="status"
                                width="120px">
                            <template slot-scope="scope">
                                {{ getStatusName(scope.row.status) }}
                            </template>
                        </el-table-column>

                        <template v-if="has_payment">
                            <el-table-column
                                    :label="$t('Amount')"
                                    sortable="custom"
                                    prop="payment_total"
                                    min-width="120px">
                                <template slot-scope="scope">
                                    <span v-html="formatMoney(scope.row.payment_total, scope.row.currency)"></span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="$t('Payment Status')"
                                    sortable
                                    prop="payment_status"
                                    min-width="140px">
                                <template slot-scope="scope">
                                    <span class="ff_badge"
                                        :class="'ff_badge_'+scope.row.payment_status"
                                        v-if="scope.row.payment_status"
                                    >
                                        {{ scope.row.payment_status }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="$t('Payment Method')"
                                    sortable
                                    prop="payment_method"
                                    min-width="140px">
                                <template slot-scope="scope">
                                    <span class="ff_badge" v-if="scope.row.payment_method"
                                        :class="`ff_badge_${
                                        scope.row.payment_method == 'stripe' ? 'stripe' :
                                        scope.row.payment_method == 'paypal' ? 'paypal' :
                                        scope.row.payment_method == 'mollie' ? 'mollie' :
                                        scope.row.payment_method == 'razorpay' ? 'razorpay' :
                                        scope.row.payment_method == 'paystack' ? 'paystack' : 'default' }`">
                                        {{ getPaymentMethodName(scope.row.payment_method) }}
                                    </span>
                                </template>
                            </el-table-column>
                        </template>

                        <el-table-column
                                :label="$t('Submitted at')"
                                sortable
                                prop="created_at"
                                width="120px">
                            <template slot-scope="scope">
                                {{ dateFormat(scope.row.created_at) }}
                            </template>
                        </el-table-column>

                        <el-table-column
                                fixed="right"
                                :label="$t('Actions')"
                                :width="115"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <btn-group size="sm">
                                    <btn-group-item>
                                        <router-link :to="{
                                            name: 'form-entry',
                                            params: {
                                                form_id: scope.row.form_id,
                                                entry_id: scope.row.id
                                            },
                                            query: {
                                                sort_by: sort_by,
                                                current_page: paginate.current_page,
                                                pos: scope.$index,
                                                type: entry_type
                                            }
                                        }">
                                            <span class="el-button el-button--primary el-button--mini el-button--icon">
                                                <i class="ff-icon ff-icon-eye-filled"></i>
                                            </span>
                                        </router-link>
                                    </btn-group-item>
                                    <btn-group-item>
                                        <confirm
                                            v-if="hasPermission('fluentform_manage_entries')"
                                            @on-confirm="removeEntry(scope.row.id, scope.$index)">
                                            <el-button
                                                class="el-button--icon"
                                                size="mini"
                                                type="danger"
                                                icon="ff-icon ff-icon-trash"
                                            />
                                        </confirm>
                                    </btn-group-item>
                                </btn-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-skeleton>
            </div><!-- .ff_table -->

            <el-row class="mt-4 items-center">
                <el-col :span="12">
                    <div class="bulkactions">
                        <email-resend
                                v-if="entrySelections.length"
                                :btn_text="$t('Bulk Resend Notifications')"
                                :entry_ids="selection_ids"
                                :form_id="form_id">
                        </email-resend>
                        <el-checkbox class="compact_input" v-model="isCompact" @change="handleCompactView">{{ $t('Compact View') }}</el-checkbox>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="ff_pagination_wrap text-right">
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
                </el-col>
            </el-row>

            <!-- Modal for field select -->
            <div :class="{'ff_backdrop': input_selection_visibility}">
                <el-dialog
                        top="50px"
                        width="70%"
                        element-loading-spinner="el-icon-loading"
                        :loading="exportingEntries"
                        :visible="input_selection_visibility"
                        :before-close="closeInputSelection"
                >
                    <template slot="title">
                        <div class="el-dialog__header_group">
                            <h4 class="mr-3">{{ $t('Select fields for export') }}</h4>
                        </div>
                    </template>

                    <el-checkbox v-if="has_pro" class="mt-5" :indeterminate="isIndeterminateFieldsSelection" v-model="checkAllFields" @change="handleCheckAllFieldsChange">{{$t('Check all')}}</el-checkbox>

                    <div class="ff_card_wrap mt-5 mb-4">

                        <el-checkbox-group class="ff_2_col_items mb15" v-model="fieldsToExport" @change="handleCheckedFieldsChange" >
                           <div>
                               <p><b>{{ $t('Form Inputs') }}</b></p>
                               <div class="separator mb-4"></div>
                               <el-checkbox :disabled="!has_pro"  v-for="(label,name) in input_labels" :label="name" :key="name" >{{ label }}</el-checkbox>
                           </div>
                        </el-checkbox-group>

                        <el-checkbox-group class="ff_2_col_items " v-model="shortcodesToExport" @change="handleCheckedFieldsChange">
                            <div >
                                <p><b>{{ $t('Submission Info') }}</b></p>
                                <div class="separator mb-4"></div>
                                <el-checkbox :disabled="!has_pro" v-for="(label,name) in editor_shortcodes"   :label="name" :key="name" >{{ label }}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                    <div  class="text-center" v-if="!has_pro">
                        {{$t('Field selection is available only in Pro version.') }}
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeInputSelection" type="info" class="el-button--soft">
                            {{ $t('Cancel') }}
                        </el-button>
                        <el-button type="primary" icon="el-icon-download" @click="exportEntries()">
                            {{ $t('Export') }}
                        </el-button>
                    </span>
                </el-dialog>
            </div>

        </div>
    </div>
</template>

<script type="text/babel">
    import Confirm from "@/admin/components/confirmRemove.vue";
    import moment from 'moment';
    import each from 'lodash/each';
    import EmailResend from './Helpers/_ResentEmailNotification'
    import ColumnDragAndDrop from "./ColumnDragAndDrop";
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import SectionHead from '@/admin/components/SectionHead/SectionHead.vue';
    import SectionHeadContent from '@/admin/components/SectionHead/SectionHeadContent.vue';
    import ImportEntriesModal from "@/admin/components/modals/ImportEntriesModal.vue";

    export default {
        name: 'FormEntries',
        props: ['form_id', 'has_pdf'],
        components: {
            Confirm,
            EmailResend,
            ColumnDragAndDrop,
            BtnGroup,
            BtnGroupItem,
            SectionHead,
            SectionHeadContent,
            ImportEntriesModal
        },
        watch: {
            search_string() {
                if (!this.search_string.length) {
                    this.getData();
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
                        this.getData();
                        return;
                    default:
                        return;
                }
                start.setTime(start.getTime() - 3600 * 1000 * 24 * number);
                const startDate = start.getFullYear() + "/" + (start.getMonth() + 1) + "/" + start.getDate();
                const endDate = end.getFullYear() + "/" + (end.getMonth() + 1) + "/" + end.getDate();
                this.filter_date_range = [startDate, endDate];
                this.getData();
            }
        },
        data() {
            return {
                loading: true,
                entry_type: this.$route.query.type || '',
                sort_by: this.$route.query.sort_by || "DESC",
                selectedPaymentStatuses: [],
                entries: [],
                entrySelections: [],
                columns: [],
                bulkAction: '',
	            idShortByClassName: '',
                paginate: {
                    total: 0,
                    current_page: parseInt(this.$route.query.page) || 1,
                    last_page: 1,
                    per_page: localStorage.getItem('entriesPerPage') || 10
                },
                search_string: '',
                forms: window.fluent_form_entries_vars.forms,
                current_form_title: window.fluent_form_entries_vars.current_form_title,
                counts: {},
                no_found_text: window.fluent_form_entries_vars.no_found_text,
                entry_statuses: window.fluent_form_entries_vars.entry_statuses,
                payment_statuses: window.fluent_form_entries_vars.payment_statuses,
                has_payment: !!window.fluent_form_entries_vars.has_payment,
                isCompact: true,
                advancedFilter: false,
                filter_date_range: null,
                autoDeleteStatus: window.fluent_form_entries_vars.enabled_auto_delete,
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
                show_favorites: 'no',
                available_pdf: null,
                pdf_dropdown: null,
                visibleColReorderModal: false,
                visibleColumns: null,
                columnsOrder: null,
                radioOption: 'all',
                input_selection_visibility : false,
                exportingEntries : false,
                fieldsToExport : [],
                shortcodesToExport : [],
                selectExportFormat : 'csv',
                editor_shortcodes : window.fluent_form_entries_vars.editor_shortcodes,
                input_labels : window.fluent_form_entries_vars.input_labels,
                has_pro : window.fluent_form_entries_vars.has_pro,
                isIndeterminateFieldsSelection: true,
                checkAllFields : false,
                showImportEntriesModal: false,
                app: window.fluent_forms_global_var
            }
        },
        computed: {
            /**
             * Compute bulk action options
             * @return {Array}
             */
            bulkActions() {
                let bulk_actions = {
                    'statuses': [],
                    'other': [
                        {
                            label: 'Mark as Favorites',
                            action: 'other.make_favorite'
                        },
                        {
                            label: 'Remove from Favorites',
                            action: 'other.unmark_favorite'
                        }
                    ]
                };

                if (this.hasPermission('fluentform_manage_entries')) {
                    bulk_actions['other'].push(
                        {
                            label: 'Delete Permanently',
                            action: 'other.delete_permanently'
                        }
                    );
                }

                each(this.entry_statuses, (status_name, status_key) => {
                    if (this.entry_type != status_key && status_key != 'favorites') {
                        bulk_actions.statuses.push({
                            label: 'Mark as ' + status_name,
                            action: status_key
                        });
                    }
                });

                return bulk_actions;
            },
            /**
             * Compute selected entry IDs
             * @return {Array}
             */
            selection_ids() {
                let selectedEntries = [];

                this.entrySelections.forEach(function (element) {
                    selectedEntries.push(element.id);
                });
                return selectedEntries;
            },

            /**
             * Compute columns order
             * @return {Array}
             */
            formattedColumn() {
                let columnsOrder = [];

                if (this.columnsOrder) {
                    each(this.columnsOrder, (column) => {
                        columnsOrder.push({
                            field: column.value,
                            label: this.columns[column.value],
                        });
                    })
                } else {
                    each(this.columns, (label, field) => {
                        columnsOrder.push({field, label});
                    })
                }

                if (this.visibleColumns) {
                    columnsOrder = columnsOrder.filter(column => this.visibleColumns.includes(column.field));
                }

                return columnsOrder;
            },
	        hasEnabledDateFilter() {
				return !!(this.radioOption && this.radioOption != 'all' ||
					(Array.isArray(this.filter_date_range) && this.filter_date_range.join(''))
                );
            }
        },
        methods: {
            getStatusName(status) {
                if (this.entry_statuses[status]) {
                    return this.entry_statuses[status];
                }
                return status;
            },
            setPaginate(data = {}) {
                this.paginate = {
                    total: data.total || 0,
                    current_page: data.current_page || 1,
                    last_page: data.last_page || 1,
                    per_page: data.per_page || localStorage.getItem('entriesPerPage') || 20
                }
            },
            getEntryResources() {
                let data = {
                    form_id: this.form_id,
                    counts: true,
                    labels: true,
                    visibleColumns: true,
                    columnsOrder: true,
                };

                const url = FluentFormsGlobal.$rest.route('getSubmissionsResources');

                FluentFormsGlobal.$rest.get(url, data)
                    .then((response) => {
                        this.counts = response.counts;
                        this.columns = response.labels;

                        this.visibleColumns = response.visibleColumns;
                        this.columnsOrder = response.columnsOrder;
                    })
                    .catch((error) => {

                    })
                    .finally(() => {
                        this.getData();
                    });
            },
            getData() {
                let data = {
                    form_id: this.form_id,
                    entry_type: this.entry_type,
                    page: this.paginate.current_page,
                    per_page: this.paginate.per_page,
                    search: this.search_string,
                    sort_by: this.sort_by,
                    payment_statuses: this.selectedPaymentStatuses,
                    parse_entry: true,
                };

                if (this.hasEnabledDateFilter) {
                    data.date_range = this.filter_date_range;
                }
	            if (this.advancedFilter) {
		            this.advancedFilter = false;
	            }

                this.loading = true;

                const url = FluentFormsGlobal.$rest.route('getSubmissions');

                FluentFormsGlobal.$rest.get(url, data)
                    .then((response) => {
                        this.entries = response.data;
                        this.setPaginate(response);
                        this.resetUrlParams();
	                    this.idShortByClassName = this.sort_by === 'ASC' ? 'ascending' : 'descending';
                    })
                    .catch((error) => {

                    })
                    .finally(() => {
                        this.getVisibleColumns();
                        this.loading = false;
                    });
            },
            handleTableSort(column) {
                if (column.order) {
                    if (column.prop === 'id') {
                        this.sort_by = (column.order === 'ascending') ? 'ASC' : 'DESC';
                        this.getData();
                    } else if (column.prop.includes('user_inputs_column_field-')) {
						let field = column.prop.split('user_inputs_column_field-')[1];
	                    this.entries.sort((a, b) => {
		                    a = a.user_inputs[field] || "";
		                    b = b.user_inputs[field] || "";
		                    return this.getSortOrder(a, b, column.order);
	                    });
						this.idShortByClassName = '';
                    } else if (column.prop === 'payment_total') {
	                    this.entries.sort((a, b) => {
		                    return this.getSortOrder(a.payment_total, b.payment_total, column.order);
	                    });
	                    this.idShortByClassName = '';
                    }
                }
            },

            getSortOrder(a, b, sortBy) {
                let order;
				try {
					a = a.toString();
					b = b.toString();
					const isNumber = (a !== '' && !isNaN(a)) && (b !== '' && !isNaN(b));
					if (isNumber) {
						order = Number(a) - Number(b);
					} else {
						order = a.localeCompare(b);
                    }
					if (sortBy === 'descending') {
						order ||= -1;
						order *= -1;
					}
                } catch (e) {
                    order = 0;
				}
	            return order;
            },
            handleSelectionChange(val) {
                this.entrySelections = val;
            },
            removeEntry(entryId, index) {
                let action = 'post';
                let route = 'updateSubmissionStatus';

                if (this.entry_type === 'trashed') {
                    action = 'delete';
                    route = 'deleteSubmission';
                }

                const url = FluentFormsGlobal.$rest.route(route, entryId);

                const data = {
                    status: 'trashed'
                };

                FluentFormsGlobal.$rest[action](url, data)
                    .then(response => {
                        const statusToBeDecreased = this.entries[index].status;
                        this.counts[statusToBeDecreased] -= 1;

                        this.counts.trashed += 1;

                        this.entries.splice(index, 1);

                        this.$success(response.message);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleBulkAction() {
                if (this.bulkAction) {
                    this.operationOnSelectedEntries(this.bulkAction);
                }
            },
            operationOnSelectedEntries(actionType) {
                let data = {
                    form_id: this.form_id,
                    entries: this.selection_ids,
                    action_type: actionType
                };

                const url = FluentFormsGlobal.$rest.route('handleSubmissionsBulkActions');

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.$success(response.message);
                        this.getEntryResources();
                    })
                    .catch(error => {
                        this.$fail(error.message);
                        console.log(error);
                    });

            },
            goToPage(value) {
                this.paginate.current_page = value;
                this.getData();
            },
            handleSizeChange(val) {
                this.paginate.per_page = val;
                localStorage.setItem('entriesPerPage', val);
                this.getData();
            },
            filterEntryType() {
                this.bulkAction = '';
                this.search_string = '';
                this.setPaginate();
                this.getData();
            },
            filterPaymentStatuses() {
                this.bulkAction = '';
                this.search_string = '';
                this.setPaginate();
                this.getData();
            },
            handleSearch() {
                this.setPaginate();
                this.getData();
            },
            resetUrlParams() {
                this.$router.push({
                    name: 'form-entries',
                    params: {
                        form_id: this.form_id
                    },
                    query: {
                        sort_by: this.sort_by,
                        type: this.entry_type,
                        page: this.paginate.current_page
                    }
                })
                    .catch(failure => {

                    });
            },
            changeFavorite(entryId, index, is_favourite) {
                let data = {
                    is_favourite
                };

                const url = FluentFormsGlobal.$rest.route('toggleSubmissionIsFavorite', entryId)

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.entries[index].is_favourite = response.is_favourite;

                        const amount = is_favourite ? 1 : -1;
                        this.counts.favorites += amount;

                        if (this.entry_type === 'favorites') {
                            this.entries.splice(index, 1);
                        }

                        this.$success(response.message);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            changeStatus(entryId, index, status) {
                let data = {
                    status
                };

                const url = FluentFormsGlobal.$rest.route('updateSubmissionStatus', entryId);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.counts[status] += 1;

                        const statusToBeDecreased = this.entries[index].status;
                        this.counts[statusToBeDecreased] -= 1;

                        this.entries[index].status = response.status;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            restoreEntry(entryId, index) {
                let data = {
                    status: 'read'
                };

                const url = FluentFormsGlobal.$rest.route('updateSubmissionStatus', entryId);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.counts.trashed -= 1;
                        this.counts.read += 1;
                        this.entries.splice(index, 1);

                        this.$success(this.$t('The Entry has been restored'));
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleSwitchForm(formId) {
                window.location.href = window.fluent_form_entries_vars.entries_url_base + formId;
            },
            closeInputSelection(){
                this.input_selection_visibility  = false;
            },
            selectFieldsToExport(format = 'csv'){
                this.selectExportFormat = format;

                if (format == 'json'){
                    //@todo add json column selection support
                    this.exportEntries();
                }else{
                    this.input_selection_visibility  = true;
                }
            },
            exportEntries() {

                this.input_selection_visibility  = false;

                let selectedShortcodes = [];
                this.shortcodesToExport.forEach( (element)=> {
                    selectedShortcodes.push({
                        label: this.editor_shortcodes[element],
                        value: element,
                    });
                });
                let selectedEntries = [];
                this.entrySelections.forEach(function (element) {
                    selectedEntries.push(element.id);
                });

                let data = {
	                action: 'fluentform-form-entries-export',
	                form_id: this.form_id,
                    format:  this.selectExportFormat || 'csv',
                    entry_type: this.entry_type,
                    entries: selectedEntries,
                    sort_by: this.sort_by,
                    search: this.search_string,
                    payment_statuses: this.selectedPaymentStatuses,
                    fields_to_export: this.fieldsToExport,
                    shortcodes_to_export: selectedShortcodes,
	                fluent_forms_admin_nonce: window.fluent_forms_global_var.fluent_forms_admin_nonce
                };
                if (this.hasEnabledDateFilter) {
                    data.date_range = this.filter_date_range;
                    data.is_favourite = this.show_favorites;
                }
	            location.href = ajaxurl + '?' + jQuery.param(data);
            },
            dateFormat(date, format) {
                if (!format) {
                    format = 'MMM DD, YYYY';
                }
                let dateString = (date === undefined) ? null : date;
                let dateObj = moment(dateString);
                return dateObj.isValid() ? dateObj.format(format) : null;
            },
	        filterDateRangedPicked() {
			    this.radioOption = "";
				this.getData();
            },
            resetAdvancedFilter() {
                this.radioOption = "";
				this.filter_date_range = null;
                this.getData();
            },
            gotoVisualReport() {
                this.$router.push({
                    name: 'form-reports'
                });
            },
            getPaymentMethodName(status) {
                if (status == 'test') {
                    return 'Offline';
                }
                return status;
            },
            handleColumnChange() {
                const data = {
                    meta_key: '_visible_columns',
                    settings: JSON.stringify(this.visibleColumns)
                };

                const url = FluentFormsGlobal.$rest.route('storeEntryColumns', this.form_id);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            getVisibleColumns() {
                if (this.visibleColumns === null) {
                    //visibleColumns is not set initially so set all columns to visible
                    this.visibleColumns = Object.keys(this.columns);
                }
            },
            refreshColumnsOrder(columnsOrder) {
                this.columnsOrder = columnsOrder ? [...columnsOrder] : null;
                this.visibleColReorderModal = false;
            },
            handleCompactView() {
                localStorage.setItem('compactView', this.isCompact);
            },
            handleCheckAllFieldsChange(val) {
                const fields = Object.keys(this.input_labels);
                const shortCodes= Object.keys(this.editor_shortcodes);

                this.fieldsToExport = val ? fields : [];
                this.shortcodesToExport = val ? shortCodes : [];

                this.isIndeterminateFieldsSelection = false;
            },
            handleCheckedFieldsChange(value){
                let checkedCount = value.length;
                const fieldsCount = Object.keys(this.input_labels).length
                const shortCodeCountCount = Object.keys(this.editor_shortcodes).length
                this.checkAll = checkedCount === shortCodeCountCount + fieldsCount;

                this.isIndeterminateFieldsSelection = checkedCount > 0 && checkedCount <  shortCodeCountCount + fieldsCount;
            }
        },
        mounted() {
            this.getEntryResources();
            (new ClipboardJS('.copy')).on('success', (e) => {
                this.$copy();
            });
            this.isCompact = ( localStorage.getItem('compactView') == 'true' || localStorage.getItem("compactView") === null) ? true : false;
            this.fieldsToExport = Object.keys(this.input_labels)
            this.shortcodesToExport = ['{submission.id}','{submission.created_at}','{submission.status}']
        },
        beforeCreate() {
            ffEntriesEvents.$emit('change-title', 'All Entries');
        },
    };
</script>

