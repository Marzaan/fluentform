<template>
    <el-form-item>
        <elLabel slot="label" :label="listItem.label" :helpText="listItem.help_text"></elLabel>
        <el-select v-loading="fetching" :element-loading-text="$t('Loading...')" element-loading-spinner="none" v-model="model" placeholder="Select" class="el-fluid ff-group-select">
            <el-option-group
                    v-for="group in options"
                    :key="group.label"
                    :label="group.label">
                <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-option-group>
        </el-select>
    </el-form-item>
</template>

<script>
    import elLabel from '../../includes/el-label.vue'
    export default {
        name: 'selectGroup',
        props: ['editItem', 'listItem', 'value'],
        components: {
            elLabel
        },
        data() {
            return {
                options: [],
                model: this.value,
                fetching: false,
            }
        },
        methods: {
            fetchRemoteData() {
                //if options is passed then no need to call ajax
                // fluentform/select_group_component_ajax_options filter can be used to pass data in this ajax call
                if (typeof this.listItem.options === 'object') {
                    this.options = this.listItem.options;
                    return;
                }
                this.fetching = true;

                FluentFormsGlobal.$post({
                    name: this.editItem.attributes.name,
                    element: this.editItem.element,
                    form_id: window.FluentFormApp.form.id,
                    action: 'fluentform_select_group_ajax_data',
                }).then(response => {
                    if (response.success) {
                        this.options = JSON.parse(JSON.stringify(response.data))
                    } else {
                        this.$notify.error({
                            offset: 32,
                            title: 'Error',
                            message: 'Failed! Please try again.'
                        });
                    }
                }).fail(response => {
                    this.$notify.error({
                        offset: 32,
                        title: 'Error',
                        message: 'Failed! Please try again.'
                    });
                }).always(() => {
                    this.fetching = false;
                });
            },
        },
        watch: {
            model() {
                this.$emit('input', this.model);
            }
        },
        mounted() {
            this.fetchRemoteData()
        }
    }
</script>
