<template>
    <div>
        <template v-if="item.settings.date_type === 'single'">
            <component :is="guessElTemplate(item.single_field)" :item="item" :field="item.single_field"></component>
        </template>
        <template v-if="item.settings.date_type === 'multiple'">
            <label v-if="label" :class="{'is-required' : required}">{{ label }}</label>
            <el-row :gutter="30">
                <template v-for="(field, key) in getOrderFields">
                    <el-col :key="key" :md="Math.floor(24/columns)" :class="'ff-el-form-'+labelPlacement" class="dates-field-wrapper">
                        <component :is="guessElTemplate(getField(field))" :item="getField(field)"></component>
                    </el-col>
                </template>
            </el-row>
        </template>
    </div>
</template>
    
<script type="text/babel">
    import inputDate from './inputDate.vue';
    import select from './select.vue';
    
    export default {
        name: 'dateFields',
        props: ['item'],
        components: {
            'ff_inputDate': inputDate,
            'ff_select': select
        },
        data() {
            return {
                columns: 0,
                fieldSettings: this.item.multi_field?.settings,
                formatMapping: FluentFormApp.element_customization_settings.custom_format.format_mapping,
            }
        },
        computed: {
            label() {
                return this.item.multi_field?.settings?.label;
            },
            labelPlacement() {
                return this.item.multi_field?.settings?.label_placement;
            },
            required() {
                return this.item.multi_field?.settings?.validation_rules?.required?.value;
            },
            getOrderFields() {
                const orderFields = [];
                let dateFormat = this.item.multi_field?.settings?.date_format;
                let customFormat = this.item.multi_field?.settings?.custom_format;

                if (dateFormat === 'custom') {
                    dateFormat = customFormat;
                }
                const dateOrder = this.getDateOrder(dateFormat);
                dateOrder?.forEach((field) => {
                    orderFields.push(field);
                });
                this.$set(this.fieldSettings, 'field_order', dateOrder);
                this.columns = orderFields.length;
                return orderFields;
            }
        },
        methods: {
            getField(field) {
                return this.item.multi_field.fields[field];
            },
            getDateOrder(dateFormat) {
                return this.formatMapping[dateFormat] || ['year'];
            },
        }
    }
</script>