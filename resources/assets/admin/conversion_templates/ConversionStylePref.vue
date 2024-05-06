<template>
    <div class="ff_style_pref">
        <el-form-item class="ff-form-item">
            <el-label slot="label" :label="$t('Layout Type')" :helpText="$t('Select the layout that you want to show for this input')"></el-label>
            <el-radio-group class="ff_iconed_radios" v-model="pref.layout">
                <el-radio v-for="(layout, layoutName) in layouts" :key="layoutName" :label="$t(layoutName)">
                    <i :class="layout.icon" />
                </el-radio>
            </el-radio-group>
        </el-form-item>
        <template v-if="pref.layout != 'default' && pref.layout != 'media_raw_html'">
            <el-form-item class="ff-form-item">
                <el-label slot="label" :label="$t('Media')" :helpText="$t('Set the media image that you want to set for this input')"></el-label>
                <photo-widget enable_clear="yes" design_mode="horizontal" v-model="pref.media"/>
            </el-form-item>
            <el-form-item class="ff-form-item">
                <el-label slot="label" :label="$t('Media Brightness')" :helpText="$t('Brightness of your selected media')"></el-label>
                <el-slider :min="-100" input-size="mini" :max="100" v-model="pref.brightness" show-input></el-slider>
            </el-form-item>
            <template v-if="pref.layout == 'media_right_full' || pref.layout == 'media_left_full'">
                <el-form-item class="ff-form-item">
                    <el-label slot="label" :label="$t('Media Horizontal Position')" :helpText="$t('Horizontal (X) Position of the media')"></el-label>
                    <el-slider :min="0" input-size="mini" :max="100" v-model="pref.media_x_position" show-input></el-slider>
                </el-form-item>
                <el-form-item class="ff-form-item">
                    <el-label slot="label" :label="$t('Media Vertical Position')" :helpText="$t('Vertical (Y) Position of the media')"></el-label>
                    <el-slider :min="0" input-size="mini" :max="100" v-model="pref.media_y_position" show-input></el-slider>
                </el-form-item>
            </template>

            <el-form-item class="ff-form-item">
                <el-label slot="label" :label="$t('Media Alt Text')" :helpText="$t('Alt text is a short description of an image that will help people with visual impairment. This label is not visible in your frontend')"></el-label>
                <el-input type="textarea" v-model="pref.alt_text" show-input></el-input>
            </el-form-item>
        </template>
        <template v-else-if="pref.layout == 'media_raw_html'">
            <el-form-item class="ff-form-item">
                <el-label slot="label" :label="$t('HTML to Show')" :helpText="$t('Please provide your raw html that you want to show at the side of the form')"></el-label>
                <el-input :rows="8" type="textarea" v-model="pref.raw_html" show-input></el-input>
            </el-form-item>
        </template>
    </div>
</template>

<script type="text/babel">
import elLabel from '../components/includes/el-label.vue'
import PhotoWidget from '../../common/PhotoUploader';

export default {
    name: 'ConversionStylePref',
    props: ['pref'],
    components: {
        elLabel,
        PhotoWidget
    },
    data() {
        return {
            layouts: {
                default: {
                    label: 'Default',
                    icon: 'dashicons dashicons-menu'
                },
                media_right: {
                    label: 'Media Right',
                    icon: 'dashicons dashicons-align-right'
                },
                media_left: {
                    label: 'Media Left',
                    icon: 'dashicons dashicons-align-left'
                },
                media_right_full: {
                    label: 'Right Aligned Full',
                    icon: 'dashicons dashicons-align-pull-right'
                },
                media_left_full: {
                    label: 'Left Aligned Full',
                    icon: 'dashicons dashicons-align-pull-left'
                }
            }
        }
    }
}
</script>
