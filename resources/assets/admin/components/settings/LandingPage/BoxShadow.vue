<template>
    <el-form-item class="ff-form-item">
        <template slot="label">
            {{ valueItem.label }}
            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tootlip_wrap">
                <div slot="content">
                    <p>
                        {{ $t('Choose Shadow for your form container') }}
                    </p>
                </div>
                <i class="ff-icon ff-icon-info-filled text-primary"></i>
            </el-tooltip>
        </template>
        <btn-group as="div">
            <btn-group-item as="div">
                <el-popover
                    width="300"
                    popper-class="ff-landing-layout-box-shadow-popover"
                    v-model="visible"
                >
                    <div class="ff_type_settings">
                        <div class="ff-type-control">
                            <label class="ff-control-title">
                                {{$t('Color')}}
                            </label>
                            <div class="ff-type-value">
                                <el-color-picker 
                                    size="mini" 
                                    v-model="valueItem.color"
                                    show-alpha></el-color-picker>
                            </div>
                        </div>

                        <div class="ff-type-control">
                            <label class="ff-control-title">
                                {{$t('Horizontal')}}
                            </label>
                            <div class="ff-type-value">
                                <input type="number" v-model="valueItem.horizontal"/>
                            </div>
                        </div>
                        <div class="ff-type-control">
                            <label class="ff-control-title">
                                {{$t('Vertical')}}
                            </label>
                            <div class="ff-type-value">
                                <input type="number" v-model="valueItem.vertical"/>
                            </div>
                        </div>
                        <div class="ff-type-control">
                            <label class="ff-control-title">
                                {{$t('Blur')}}
                            </label>
                            <div class="ff-type-value">
                                <input type="number" v-model="valueItem.blur"/>
                            </div>
                        </div>
                        <div class="ff-type-control">
                            <label class="ff-control-title">
                                {{$t('Spread')}}
                            </label>
                            <div class="ff-type-value">
                                <input type="number" v-model="valueItem.spread"/>
                            </div>
                        </div>

                        <div class="ff-type-control">
                            <label class="ff-control-title">
                                {{$t('Position')}}
                            </label>
                            <div class="ff-type-value">
                                <el-select size="mini" v-model="valueItem.position" :placeholder="$t('Select')">
                                    <el-option
                                        v-for="(item, key) in {'': 'Outline','inset': 'Inset'}"
                                        :key="key"
                                        :label="item"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <el-button type="medium" class="el-button--icon" slot="reference"><i class="el-icon-edit"></i></el-button>
                </el-popover>
            </btn-group-item>
            <btn-group-item as="div">
                <el-button @click="reset" type="medium" class="el-button--icon" icon="el-icon-refresh-left"></el-button>
            </btn-group-item>
        </btn-group>
    </el-form-item>
</template>
<script type="text/babel">
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';

    export default {
        name: 'ff_boxshadow',
        props: ['valueItem'],
        components: { 
            BtnGroup, 
            BtnGroupItem 
        },
        data() {
            return {
                visible: false,
            }
        },
        methods: {
            reset() {
                this.valueItem.position = "";
                this.valueItem.horizontal = "0";
                this.valueItem.vertical = "0";
                this.valueItem.blur = "0";
                this.valueItem.spread = "0";
                this.valueItem.color = "";
            }
        }
    }
</script>
