<template>
    <div class="addresss_editor">
        <div v-for="(eachField, fieldKey) in field.raw.fields" class="each_address_field" :key="fieldKey">
            <label>{{getLaebel(eachField)}}</label>
            <el-input type="text" size="mini" v-model="model[fieldKey]"></el-input>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'AddressEditor',
        props: ['value', 'field'],
	    data() {
		    return {
			    model: this.value
		    }
	    },
	    watch: {
		    model() {
			    this.$emit('input', this.model);
		    }
	    },
        methods: {
          getLaebel(field) {
              return field.settings.admin_field_label || field.settings.label || field.attributes.name;
          }
        },
        created() {
            if (!this.model || Array.isArray(this.model)) {
                this.model = {};
            }
        }
    }
</script>