<template>
    <div class="entry-repeat-field">
	    <template v-if="hasRepeaterValue" >
	        <table class="editor_table">
	            <thead>
	            <tr>
	                <th v-for="(fieldItem, fieldKey) in field.raw.fields" :key="fieldKey">{{fieldItem.settings.label}}</th>
	                <th>{{ $t('Action') }}</th>
	            </tr>
	            </thead>
	            <tbody>
	            <tr v-for="(rowValue, rowIndex) in repeaters" :key="rowIndex">
	                <td v-for="(fieldItem, fieldIndex) in field.raw.fields" :key="fieldIndex">
		                <el-select
			                v-if="fieldItem.attributes.type === 'select'"
			                v-model="model[rowIndex][fieldIndex]" size="mini"
		                >
			                <el-option
				                v-for="option in fieldItem.settings.advanced_options"
				                :key="option.value"
				                :label="option.label"
				                :value="option.value">
			                </el-option>
		                </el-select>
	                    <el-input
		                    v-else
	                        v-model="model[rowIndex][fieldIndex]"
	                        size="mini"
	                        :placeholder="fieldItem.settings.label"
	                        :type="fieldItem.attributes.type"/>
	                </td>
	                <td>
		                <div class="action-buttons-group">
			                <el-button @click="addRow(rowIndex)" size="mini" icon="el-icon-plus"></el-button>
			                <el-button @click="removeRow(rowIndex)" size="mini" icon="el-icon-minus"></el-button>
		                </div>
	                </td>
	            </tr>
	            </tbody>
	        </table>
	    </template>
        <el-button v-else @click="initNewRow()" type="success" size="mini" icon="el-icon-plus">{{ $t('Add Item') }}
        </el-button>
    </div>
</template>

<script type="text/babel">

    export default {
        name: 'multi-repeat-line',
        props: ['value', 'field'],
        data() {
            return {
                appReady: false,
                model: this.value
            }
        },
        watch: {
            model() {
                this.$emit('input', this.model);
            }
        },
        methods: {
            addRow(index) {
                if (!this.model) {
                    this.initNewRow();
                }
                this.model.splice(index + 1, 0, new Array(this.field.raw.fields.length).fill(''));
            },
            removeRow(index) {
	            this.$delete(this.model, index);
            },
            initNewRow() {
                this.model = [new Array(this.field.raw.fields.length).fill('')];
            }
        },
        computed: {

            repeaters() {
                // find the rows
                var rows = 1;
                if (this.model && this.model[0]) {
                    rows = this.model.length;
                }

                var columns = this.field.raw.fields.length;

                var x = new Array(rows);

                for (var i = 0; i < x.length; i++) {
                    x[i] = new Array(columns).fill('');
                }

                return x;
            },

            hasRepeaterValue() {
                return (this.model && typeof this.model === 'object' && this.model.length);
            }
        }
    }
</script>