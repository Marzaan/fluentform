<template>
    <div class="ff_block_item">
        <el-row :gutter="6">
            <el-col :md="18">
                <h6 class="ff_block_title mb-1">{{ $t('Advanced') }}</h6>
                <p class="ff_block_text">{{ $t('Administrators have full access to Fluent Forms. Add other managers giving specific permissions.') }}</p>
            </el-col>
            <el-col :md="6" class="text-right">
                <el-button
                        type="primary"
                        icon="ff-icon ff-icon-plus"
                        @click="showForm()"
                        size="medium"
                >
                    {{ $t('Add Manager') }}
                </el-button>
            </el-col>
        </el-row>

        <div class="ff_managers_list mt-4">
            <div class="ff_table_wrap">
                <el-skeleton :loading="loading" animated :rows="6">
                    <el-table class="ff_table_s2" :data="managers">
                        <el-table-column :label="$t('ID')" prop="id" width="70"/>
                        <el-table-column :label="$t('Name')" width="180">
                            <template slot-scope="scope">
                                {{ scope.row.first_name }} {{ scope.row.last_name }}
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('Email')" prop="email" width="240" />

                        <el-table-column :label="$t('Roles')" prop="roles" width="120" />

                        <el-table-column :label="$t('Permissions')">
                            <template slot-scope="scope">
                                <el-tag
                                        type="info"
                                        size="mini"
                                        v-for="permission in scope.row.permissions"
                                        :key="permission"
                                        class="mr-1"
                                >
                                    {{ permissions[permission].title }}
                                </el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('Action')" width="90">
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
                class="ff_managers_form"
        >
            <div slot="title">
                <h5>{{$t(getModalTitle())}}</h5>
            </div>

            <el-form :data="manager" label-position="top" class="mt-4">
                <el-form-item>
                    <template slot="label">
                        <h6>{{$t('User Email')}}</h6>
                    </template>
                    <el-input
                            type="email"
                            :placeholder="$t('User Email Address')"
                            v-model="manager.email"
                    />

                    <error-view field="email" :errors="errors"/>

                    <p class="text-note mt-2" v-show="!manager.id">
                        {{ $t('Please provide email address of your existing user.') }}
                    </p>
                </el-form-item>

                <el-form-item>
                    <template slot="label">
                        <h6>{{$t('Permissions')}}</h6>
                    </template>

                    <el-checkbox-group v-model="manager.permissions" class="ff_checkbox_group_col_2">
                        <el-checkbox
                                v-for="(permission, permissionKey) in permissions"
                                :label="permissionKey"
                                :key="permissionKey"
                        >
                            {{ permission.title }}
                        </el-checkbox>
                    </el-checkbox-group>

                    <error-view field="permissions" :errors="errors"/>
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
    </div>
</template>

<script>
    import ErrorView from "@/common/errorView.vue";
    import Confirm from "@/admin/components/confirmRemove.vue";
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';

    export default {
        name: "Managers",

        components: {
            ErrorView,
            Confirm,
            BtnGroup,
            BtnGroupItem
        },

        data() {
            return {
                loading: false,
                modal: false,
                managers: [],
                permissions: [],
                manager: {},
                pagination: {
                    total: 0,
                    current_page: 1,
                    per_page: 10
                },
                errors: new Errors()
            };
        },

        methods: {
            fetchManagers() {
                this.loading = true;

                const url = FluentFormsGlobal.$rest.route('getManagers');
                let data = {
                    per_page: this.pagination.per_page,
                    page: this.pagination.current_page,
                }

                FluentFormsGlobal.$rest.get(url, data)
                    .then(response => {
                        this.managers = response.managers;
                        this.permissions = response.permissions;
                        this.pagination.total = response.total;
                    })
                    .catch(e => {

                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },

            showForm() {
                this.manager = {
                    email: "",
                    permissions: []
                };
                this.modal = true;
                this.errors.clear();
            },

            getModalTitle() {
                return this.manager.id ? "Edit Manager" : "Add Manager";
            },

            store() {
                this.loading = true;

                const url = FluentFormsGlobal.$rest.route('storeManager');
                let data = {
                    manager: this.manager
                }

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.modal = false;
                        this.$success(response.message);
                        this.fetchManagers();
                    })
                    .catch(e => {
                        this.errors.record(e.errors);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },

            edit(manager) {
                this.modal = true;
                this.manager = Object.assign({}, manager);
                this.fetchManagers();
                this.errors.clear();
            },

            remove(manager) {
                const url = FluentFormsGlobal.$rest.route('deleteManager');
                let data = {
                    id: manager.id
                }

                FluentFormsGlobal.$rest.delete(url, data)
                    .then(response => {
                        this.modal = false;
                        this.$success(response.message);
                        this.fetchManagers();
                    })
                    .catch(e => {
                        this.errors.record(e.errors);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },

            goToPage(value) {
                this.pagination.current_page = value;
                this.fetchManagers();
            },

            handleSizeChange(value) {
                this.pagination.per_page = value;
                this.fetchManagers();
            }
        },
        mounted() {
            this.fetchManagers();
        }
    };
</script>
