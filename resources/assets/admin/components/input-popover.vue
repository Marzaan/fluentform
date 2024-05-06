<template>
<div>
    <el-popover
        ref="input-popover"
        :placement="placement"
        width="200"
        popper-class="el-dropdown-list-wrapper"
        trigger="click">
            <ul class="el-dropdown-menu el-dropdown-list">
                <li v-for="(item, item_index) in data" :key="item_index">
                    <span v-if="data.length > 1" class="group-title">{{ item.title }}</span>
                    <ul>
                        <li v-for="(title, code, index) in item.shortcodes" :key="index"
                            @click="insertShortcode(code)"
                            class="el-dropdown-menu__item">
                            {{ title }}
                        </li>
                    </ul>
                </li>
            </ul>
    </el-popover>

    <div v-if="fieldType == 'textarea'" class="input-textarea-value">
        <i class="icon el-icon-tickets" v-popover:input-popover></i>
        <el-input :rows="rows" :placeholder="placeholder" type="textarea" v-model="model"></el-input>
    </div>

    <el-input :placeholder="placeholder" v-else v-model="model" :type="fieldType">
        <el-button slot="append" :icon="icon" v-popover:input-popover></el-button>
    </el-input>
</div>
</template>

<script>
export default {
    name: 'inputPopover',
    props: {
        value : {
			type: String,
	        default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        icon: {
            type: String,
            default: 'el-icon-more'
        },
        fieldType: {
            type: String,
            default: 'text'
        },
        data: Array,
        attrName: {
            type: String,
            default: 'attribute_name'
        },
        rows: {
            type: Number,
            default: 2
        }
    },
    methods: {
        insertShortcode(codeString) {
            this.model += codeString.replace(/param_name/, this.attrName);
        }
    },
    computed : {
		model : {
			get() {
				if (this.value === undefined || this.value === null) {
					return '';
				}
				return this.value;
            },
            set(value) {
	            this.$emit('input', value);
            }
        }
    }
}
</script>
