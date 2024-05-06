<template>
    <card class="ff_inventory_settings">
        <card-head>
            <h5 class="title">{{ $t('Inventory Manager') }}</h5>
        </card-head>
        <card-body>
            <el-row :gutter="6">
                <el-col :md="18">
                    <h6 class="ff_block_title mb-1">{{ $t('Global Inventory') }}</h6>
                    <p class="ff_block_text">{{ $t('Global Inventories can be used across different forms. You can manage tickets, items, event registration etc.') }}</p>
                </el-col>
                <el-col :md="6" class="text-right">
                    <el-button
                            type="primary"
                            icon="ff-icon ff-icon-plus"
                            @click="showForm()"
                            size="medium"
                    >
                        {{ $t('Add Inventory') }}
                    </el-button>
                </el-col>
            </el-row>

            <div class="ff_inventory_list mt-4">
                <div class="ff_table_wrap">
                    <el-skeleton :loading="loading" animated :rows="6">
                        <el-table class="ff_table_s2" :data="pagedTableData">


                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-table  v-if="scope.row.details" :data="formatTableData(scope.row.details)" border style="width: 100%">
                                        <el-table-column prop="name" label="Name"  />
                                        <el-table-column prop="used" label="Used" />
                                    </el-table>
                                    <span v-else>
                                      <div class="text-center">   No data available yet </div>
                                    </span>

                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('Name')" prop="name"  />
                            <el-table-column :label="$t('Slug')" prop="slug"  />

                            <el-table-column :label="$t('Quantity')" prop="quantity" width="80" />

                            <el-table-column :label="$t('Stock')" prop="remaining">
		                        <template slot-scope="scope">
			                        <span v-html="stockFormatHtml(scope.row.remaining)"></span>
		                        </template>
                            </el-table-column>

                            <el-table-column :label="$t('Items in Use')" width="150">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.details">
                                          <el-tag
                                                  type="info"
                                                  size="mini"
                                                  v-for="(count, name) in scope.row.details"
                                                  :key="name"
                                                  class="mr-1"
                                          >
                                            {{ name }}
                                        </el-tag>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('Action')" width="160">
                                <template slot-scope="scope">

                                    <el-button
                                            class="el-button--icon"
                                            size="mini"
                                            type="primary"
                                            icon="ff-icon ff-icon-edit"
                                            @click="edit(scope.row)"
                                    />
                                    <confirm @on-confirm="remove(scope.row)">
                                        <el-button
                                                class="el-button--icon"
                                                size="mini"
                                                type="danger"
                                                icon="ff-icon ff-icon-trash"
                                        />
                                    </confirm>
                                    <el-button
                                            v-if="scope.row.details"
                                            class="el-button--icon"
                                            size="mini"
                                            type="default"
                                            icon="el-icon-refresh-left"
                                            @click="resetConfirm(scope.row)"
                                    >
                                        Reset
                                    </el-button>
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
                            :current-page.sync="pagination.current_page"
                            :page-sizes="[5, 10, 20, 50, 100]"
                            :page-size="pagination.per_page"
                            layout="total, sizes, prev, pager, next"
                            :total="pagination.total">
                    </el-pagination>
                </div>
            </div>

            <el-dialog
                    :visible.sync="modal"
                    :append-to-body="true"
                    width="36%"
                    class="ff_inventory_form"
            >
                <div slot="title">
                    <h5>{{getModalTitle()}}</h5>
                </div>

                <el-form :data="inventory" label-position="top" class="mt-4">
                    <el-form-item>
                        <template slot="label">
                            <h6>{{$t('Inventory Name')}}</h6>
                        </template>
                        <el-input
                                type="email"
                                :placeholder="$t('Item Name')"
                                v-model="inventory.name"
                        />
                        <error-view field="name" :errors="errors"/>
                    </el-form-item>

                    <el-form-item>
                        <template slot="label">
                            <h6>{{$t('Total Quantity')}}</h6>
                        </template>
                        <el-input
                                type="number"
                                :placeholder="$t('Amount')"
                                v-model="inventory.quantity"
                        />


                        <error-view field="quantity" :errors="errors"/>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <btn-group class="ff_btn_group_half">
                        <btn-group-item>
                            <el-button @click="modal = false" type="info" class="el-button--soft">
                                {{$t('Cancel')}}
                            </el-button>
                        </btn-group-item>
                        <btn-group-item>
                            <el-button type="primary" @click="store">
                                {{ $t('Save') }}
                            </el-button>
                        </btn-group-item>
                    </btn-group>
                </div>
            </el-dialog>

            <el-dialog
                    :title="$t('Reset used Inventory Item Quantity')"
                    :visible.sync="show_reset_form"
                    v-if="reset_item"
                    v-loading="reseting"
                    :append-to-body="true"

                    width="50%">
                <p>{{ $t('You are about to reset this inventory used count to zero') }}</p>
                <div>

                </div>
                <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="this.show_reset_form=false">{{ $t('Close') }}</el-button>
                <el-button type="primary" @click="reset()"> {{ $t('Yes, Reset this Item') }}</el-button>
            </span>
            </el-dialog>
        </card-body>
    </card>
</template>

<script>
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import ErrorView from "@/common/errorView.vue";
    import Confirm from "@/admin/components/confirmRemove.vue";
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';

    export default {
        name: "InventoryManager",
        data() {
            return {
                loading: false,
                modal: false,
                inventory_list: [],
                inventory: {},
                pagination: {
                    total: 0,
                    current_page: 1,
                    per_page: 10
                },
                reset_item: {},
                show_reset_form: false,
                reseting: false,
                errors: new Errors()
            };
        },
        components: {
            Card,
            CardHead,
            CardBody,
            ErrorView,
            Confirm,
            BtnGroup,
            BtnGroupItem,
        },
        methods: {
            fetchInventoryList() {
                this.loading = true;
                FluentFormsGlobal.$get({
                    action: 'fluentform_get_global_inventory_list',
                })
                    .then(response => {
                        this.inventory_list = response.data.inventory_list;
                        this.pagination.total = Object.keys(response.data.inventory_list).length
                    })
                    .fail((errors) => {
                        if (errors.status == 400) {
                            this.need_update = true;
                        }
                    })
                    .always(() => {
                        this.loading = false;
                    });
            },

            showForm() {
                this.inventory = {
                    name: "",
                    slug: "",
                    quantity: ""
                };
                this.modal = true;
                this.errors.clear();
            },

            getModalTitle() {
                return this.inventory.slug ? "Edit Inventory" : "Add Inventory";
            },

            store() {
                this.loading = true;
                FluentFormsGlobal.$post({
                    action: 'fluentform_store_global_inventory_list',
                    inventory: this.inventory
                })
                    .then(response => {
                        if(response.data.success){
                            this.modal = false;
                            this.$success(response.data.message);
                            this.fetchInventoryList();
                        }
                        else{
                            this.errors.record(response.data.errors);
                        }
                    })
                    .fail((errors) => {
                        this.errors.record(errors.responseJSON.data.errors);
                    })
                    .always(() => {
                        this.loading = false;
                    });
            },

            edit(inventory) {
                this.modal = true;
                this.inventory = Object.assign({}, inventory);
                this.errors.clear();
            },

            remove(inventory) {

                FluentFormsGlobal.$post({
                    action: 'fluentform_delete_global_inventory_list',
                    slug: inventory.slug
                })
                    .then(response => {
                        if(response.data.success){
                            this.$success(response.data.message);
                            this.fetchInventoryList();
                        }
                        else{
                            this.$fail(response.data.errors);
                        }
                    })
                    .fail((errors) => {
                        console.log(errors)
                        this.$fail(this.$t('Error, please reload and try again'));
                    })
                    .always(() => {
                        this.loading = false;
                        this.modal = false;
                    });
            },

            goToPage(value) {
                this.pagination.current_page = value;
            },

            handleSizeChange(value) {
                this.pagination.per_page = value;
            },
            resetConfirm(item){
                this.reset_item = item
                this.show_reset_form = true;
                this.confirm_reset_modal = item;
            },
            reset(){
                this.reseting = true
                FluentFormsGlobal.$post({
                    action: 'fluentform_reset_global_inventory_item',
                    slug: this.reset_item.slug
                })
                    .then(response => {
                        if(response.data.success){
                            this.$success(response.data.message);
                            this.fetchInventoryList();
                        }
                        else{
                            this.$fail(response.data.errors);
                        }
                    })
                    .fail((errors) => {
                        this.$fail(this.$t('Error, please reload and try again'));
                    })
                    .always(() => {
                        this.show_reset_form = false
                        this.reseting = false
                        this.reset_item = {};
                    });
            },
            formatTableData(usedItems) {
                let items = [];
	            let sum = {
		            'name': 'Total',
		            'used': 0,
	            };
                for (const [name, used_count] of Object.entries(usedItems)) {
                    let item = {
                        'name': name,
                        'used': parseInt(used_count),
                    }
                    items.push(item);
                    sum.used += item.used;
                }
                items.push(sum)
                return items;
            },
            stockFormatHtml(stock){
                const inStock = this.$t('In Stock');
                const outOfStock =  this.$t('Out of Stock');

                return stock > 0
                    ? `<span class="text-success">${inStock}</span><span> (${stock})</span>`
                    : `<span class="text-danger">${outOfStock}</span><span> (${stock})</span>`;
            }

        },
        computed: {
            pagedTableData() {

                const startIndex = this.pagination.per_page * (this.pagination.current_page - 1);
                const endIndex = startIndex + this.pagination.per_page;

                return Object.values(this.inventory_list).slice(startIndex, endIndex)
            }
        },
        mounted() {
            this.fetchInventoryList();
        }
    };


</script>
