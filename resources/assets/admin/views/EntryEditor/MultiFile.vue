<template>
    <div class="entry-multi-files">
        <div v-for="(valueItem, valueKey) in file_lines" :key="valueKey" class="mult-file-each">
            <el-input v-if="value" :placeholder="$t('Provide File URL')" size="mini" v-model="value[valueKey]"></el-input>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'mult-file-line',
        props: ['value', 'field'],
        watch: {
            value() {
                this.$emit('input', this.value);
            }
        },
        computed: {
            file_lines() {
                var fileLengths = this.value?.length;
                if (!fileLengths) {
                    fileLengths = 1;
                }
                return new Array(fileLengths).fill('');
            }
        },
        created() {
            if(!this.value || typeof this.value != 'object' || !this.value.length) {
                this.$emit('input', [""]);
            }
        }
    }
</script>