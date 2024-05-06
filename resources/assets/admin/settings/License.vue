<template>
    <div class="ff_license_setting">
        <card>
            <card-head>
                <h5 class="title">{{ $t('License') }}</h5>
                <p class="text">{{$t('You will be able to access new features and updates with your license key.')}}</p>
            </card-head>
            <card-body>
                <div class="ff-inactive-license-wrap" v-if="hasLicense">
                    <h5 class="mb-2">{{$t('License Key')}}</h5>
                    <p>
                        {{$t('As you are using Fluent Forms Lite, you do not require a license to use it. Enjoy! ')}}😍
                    </p>

                    <p><strong class="text-dark" style="font-weight: 500;">{{ $t('To unlock more features consider') }}</strong> <a href="https://fluentforms.com/pricing/?utm_source=plugin&utm_medium=wp_install&utm_campaign=ff_upgrade&theme_style=twentytwentythree" target="_blank">{{ $t('upgrading to PRO') }}</a>.</p>

                    <hr class="mt-4 mb-4">

                    <p class="mb-3">
                        {{$t('Thank you for purchasing Fluent Forms Pro Add On!  Please enter your license key below.')}}
                    </p>
                    <form action="#">
                        <btn-group>
                            <btn-group-item>
                                <div class="el-input el-input-gray el-input--large" style="width: 470px">
                                    <input type="text" class="el-input__inner" value="" :placeholder="$t('Enter your license key')">
                                </div>
                            </btn-group-item>
                            <btn-group-item>
                                <input type="submit" class="el-button el-button--primary el-button--large button_activate" :value="$t('Activate License')">
                            </btn-group-item>
                        </btn-group>
                        <p class="mt-2">{{$t('Any questions or problems with your license?')}} <a href="https://wpmanageninja.com/contact" target="_blank">{{$t('Contact us')}}</a>!</p>
                    </form>
                </div><!-- .ff-inactive-license-wrap -->
                <div class="ff-active-license-wrap" v-else>
                    <h5 class="mb-2">{{$t('Fluent Forms Pro')}}</h5>
                    <p class="mb-4">
                        {{$t('Your license is active! Enjoy Fluent Forms Pro')}}😍
                    </p>
                    <el-button type="primary" plain class="el-button--large">
                        {{$t('Deactivate License')}}
                    </el-button>
                </div><!-- .ff-active-license-wrap -->
            </card-body>
        </card>
    </div>
</template>

<script>
import Card from '@/admin/components/Card/Card.vue';
import CardHead from '@/admin/components/Card/CardHead.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';

export default {
    name: "License",
    components: {
        Card,
        CardHead,
        CardBody,
        BtnGroup,
        BtnGroupItem
    },
    data(){
        return{
            hasLicense: true
        }
    }
};
</script>
