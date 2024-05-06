<template>
<div>
    <el-form-item v-if="!is_conversion_form">
        <elLabel slot="label" :label="listItem.label" :helpText="listItem.help_text"></elLabel>

        <el-radio-group v-model="editItem.settings[prop].type">
            <el-radio label="default">{{ $t('Default') }}</el-radio>
            <el-radio label="img">{{ $t('Image') }}</el-radio>
        </el-radio-group>
    </el-form-item>

    <el-form-item v-if="editItem.settings[prop].type == 'default'">
        <elLabel
            slot="label"
            :label="listItem.label + ' Text'"
            helpText="">
        </elLabel>

        <el-input size="small" v-model="editItem.settings[prop].text"></el-input>
    </el-form-item>

    <el-form-item v-if="editItem.settings[prop].type == 'img'">
        <elLabel
            slot="label"
            :label="listItem.label + ' Image URL'"
            helpText="">
        </elLabel>

        <el-input v-model="editItem.settings[prop].img_url"></el-input>
    </el-form-item>

    <el-form-item v-if="editItem.settings[prop].type == 'img'">
        <elLabel
            slot="label"
            :label="listItem.label + ' Image ALT Text'"
            :helpText="$t('Alt attribute of the image')">
        </elLabel>

        <el-input v-model="editItem.settings[prop].img_alt"></el-input>
    </el-form-item>
</div>
</template>

<script>
import elLabel from '../../includes/el-label.vue'

export default {
    name: 'prevNextButton',
    props: ['listItem', 'editItem', 'prop'],
    components: {
        elLabel
    }
}
</script>
