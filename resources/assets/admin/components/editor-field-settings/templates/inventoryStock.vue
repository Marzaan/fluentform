<template>
    <div>
        <el-form-item v-if="isInventoryEnabled">
            <elLabel slot="label" :label="listItem.label" :helpText="listItem.help_text"></elLabel>

            <div v-if="optionsToRender.length" class="ff_advnced_options_wrap">
                <div class="vddl-list__handle optionsToRender"
                     v-for="(option, index) in editItem.settings[getOptionsKey]" :key="option.id">

                    <div class="">
	                    <!-- Multiple Type Inventory -->
	                    <template v-if="!isSingleInput">
		                    <el-row :gutter="10" style="align-items: center;">
			                    <el-col :span="12">
				                    <!-- Global Inventory -->
				                    <el-select v-if="isGlobalInventory" class="el-fluid" v-model="editItem.settings[getOptionsKey][index].global_inventory" :filterable="true" clearable>
					                    <el-option
						                    v-for="item in listItem.options"
						                    :key="item.value"
						                    :label="item.label"
						                    :value="item.value">
					                    </el-option>
				                    </el-select>

				                    <!-- Simple Inventory -->
				                    <el-input v-else :min="1" type="number"
				                              v-model.number="editItem.settings[getOptionsKey][index].quantity"></el-input>
			                    </el-col>
			                    <el-col :span="12">
				                    <span >
					                    {{ option.label }}
				                    </span>
			                    </el-col>
		                    </el-row>
	                    </template>

						<!-- Single Type Inventory -->
	                    <template v-else>
		                    <!-- Global Inventory -->
		                    <el-select v-if="isGlobalInventory" class="el-fluid" v-model="editItem.settings.global_inventory" :filterable="true" clearable>
			                    <el-option
				                    v-for="item in listItem.options"
				                    :key="item.value"
				                    :label="item.label"
				                    :value="item.value">
			                    </el-option>
		                    </el-select>

		                    <!-- Simple Inventory -->
		                    <el-input v-else :min="1" class="el-fluid" type="number" style="width: 30%"
		                              v-model.number="editItem.settings.single_inventory_stock"></el-input>
	                    </template>
                    </div>

                </div>
            </div>
        </el-form-item>

    </div>
</template>

<script>
    import elLabel from '../../includes/el-label.vue'

    export default {
        name: 'inventoryStock',
        props: ['listItem', 'value', 'editItem'],
        data() {
            return {
                optionsToRender: [],
                bulkEditVisible: false,
                value_key_pair_text: '',
                has_pro: !!window.FluentFormApp.hasPro,
            }
        },
        components: {
            elLabel
        },
        methods: {
            createOptionsToRender() {
                this.optionsToRender = this.editItem.settings[this.getOptionsKey];
            },

        },
        computed: {
            getOptionsKey () {
                if (this.editItem.element == 'multi_payment_component') {
                    return 'pricing_options';
                } else {
                    return 'advanced_options';
                }
            },
            isSingleInput(){
                if (this.editItem.element == 'multi_payment_component' && this.editItem.attributes.type == 'single'){
                    return true;
                }
                return  false;
            },
            isInventoryEnabled(){
				return ['simple', 'global'].includes(this.editItem.settings.inventory_type);
            },
	        isGlobalInventory(){
				return this.editItem.settings.inventory_type === 'global';
            },
        },
        mounted() {
            let items = this.editItem.settings[this.getOptionsKey];
            items.forEach((item, i) => {
                if (item.quantity === undefined) {
                    this.$set(this.editItem.settings[this.getOptionsKey][i], 'quantity', 1)
                }
                this.editItem.settings[this.getOptionsKey][i].quantity = parseInt(item.quantity)
            })
            this.createOptionsToRender();

        }

    };
</script>
