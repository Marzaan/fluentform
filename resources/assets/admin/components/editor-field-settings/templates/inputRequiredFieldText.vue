<template>
	<div v-if="editItem.settings.validation_rules.required.value" class="ff_validation_rule_error_choice mb-3">
		<ff_input-radio
			:listItem="{label: listItem.label,
                        options:[{label:'Global', value:true},{label:'Custom', value:false}],
                        help_text: listItem.help_text}"
			v-model="editItem.settings.validation_rules.required.global"
		/>
		<el-form-item>
			<el-input v-if="!editItem.settings.validation_rules.required.global" v-model="editModel" type="text"></el-input>
			<el-input v-else disabled readonly v-model="editItem.settings.validation_rules.required.global_message" type="text"></el-input>
		</el-form-item>
	</div>
</template>

<script type="text/babel">
import elLabel from '../../includes/el-label.vue'
import inputRadio from './inputRadio.vue'

export default {
    name: 'inputRequiredFieldText',
    props: ['listItem', 'editItem'],
    data() {
        return {
            editModel: this.editItem.settings.validation_rules.required.message
        }
    },
    watch: {
        editModel() {
            this.editItem.settings.validation_rules.required.message = this.editModel;
        }
    },
    components: {
	    ff_inputRadio: inputRadio,
        elLabel
    }
}
</script>