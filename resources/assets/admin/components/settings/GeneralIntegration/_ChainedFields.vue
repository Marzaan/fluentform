<template>
    <div v-loading="loading" class="ff_chained_filter">
        <el-select :class="select_class" @change="handleCategoryChange()" clearable v-model="chained_settings.category" :placeholder="field.category_label">
            <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>

        <el-select :class="select_class" v-show="chained_settings.category" v-model="chained_settings.sub_category" clearable :placeholder="field.subcategory_label">
            <el-option
                v-for="item in subcategories"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<script type="text/babel">
    export default {
        name: 'ListSelectFilter',
        props: ['settings', 'field', 'value', 'select_class'],
        computed: {
            listItems() {

            }
        },
        watch: {
            'settings.list_id'() {
                if(this.field.require_list) {
                    this.fetchSettings();
                }
            }
        },
        data() {
            return {
                loading : false,
                app_ready: false,
                categories: [],
                subcategories: [],
                chained_settings: {
                    category: '',
                    sub_category: ''
                },
                selected_subcategory: ''
            }
        },
        methods: {
            fetchSettings() {
                this.loading = true;
                FluentFormsGlobal.$get( {
                    settings: this.settings
                },this.field.remote_url)
                .then(response => {
                    this.categories = response.data.categories;
                    this.subcategories = response.data.subcategories;
                    if(response.data.reset_values) {
                        this.chained_settings = {
                            category: '',
                            sub_category: ''
                        }
                    }
                })
                .fail(error => {
                    console.log(error);
                })
                .always(() => {
                    this.loading = false;
                });
            },
            handleCategoryChange() {
                this.$set(this.settings, this.field['key'].category, this.selected_category);
                this.fetchSettings();
            }
        },
        mounted() {
            if(!this.settings[ this.field['key'] ]) {
                this.settings[ this.field['key'] ] = this.chained_settings;
            } else {
                this.chained_settings = this.settings[ this.field['key'] ];
            }
            this.app_ready = true;
            this.fetchSettings();
        }
    }
</script>
