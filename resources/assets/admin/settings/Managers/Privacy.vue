<template>

    <div class="ff_block_item" v-if="roles.length">
        <el-skeleton :loading="loading" animated :rows="4">
            <h6 class="ff_block_title mb-1">{{ $t('Role Based') }}</h6>
            <p class="ff_block_text">{{ $t('Administrators have full access to Fluent Forms. By selecting additional roles below, you can give access to other user roles.') }}</p>
            <div class="ff_block_item_body mt-3">
                <div class="mb-3">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                        {{ $t('Check all') }}
                    </el-checkbox>
                </div>
                <el-checkbox-group v-model="capability" @change="handleCheckedCapabilitiesChange">
                    <el-checkbox v-for="role in roles" :label="role.key" :key="role.key">
                        {{ role.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </el-skeleton>
    </div><!-- .ff_block_item -->
</template>

<script>
export default {
    name: "Privacy",
    data() {
        return {
            loading: false,
            checkAll: false,
            isIndeterminate: false,
            capability: ["administrator"],
            roles: [],
        };
    },
    methods: {
        fetchRoles() {
            this.loading = true;

            const url = FluentFormsGlobal.$rest.route('getRoles');

            FluentFormsGlobal.$rest.get(url)
                .then(response => {
                    this.roles = response.roles;
                    this.capability = response.capability;
                })
                .catch(e => {

                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleFetchedData() {
            let capability = this.capability;
            if (!capability || typeof capability != "object") {
                capability = ["administrator"];
            }
            this.handleCheckedCapabilitiesChange(this.capability, false);
        },
        store() {
            if (!this.roles.length) {
                return;
            }

            const url = FluentFormsGlobal.$rest.route('storeRoles');
            let data = {
                capability: this.capability
            };

            FluentFormsGlobal.$rest.post(url, data)
                .then(response => {
                    this.$success(response.message);
                })
                .catch(e => {
                    this.$fail(e.message);
                })
                .finally(() => {

                });
        },
        handleCheckAllChange(val) {
            const filteredCapability = val ? this.roles.map(item => item.key) : [];
            this.isIndeterminate = false;
            this.capability = filteredCapability;
            this.$nextTick(function () {
                this.store();
            });
        },
        handleCheckedCapabilitiesChange(value, store = true) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.roles?.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
            if (store) {
                this.store();
            }
        },
        handleChange(value) {
            let filteredCapability = this.capability;
            const targetValue = event.target.value;

            if (value) {
                if (this.capability.indexOf(targetValue) === -1) {
                    filteredCapability.push(targetValue);
                }
            } else {
                filteredCapability = this.capability.filter(e => e !== targetValue);
            }

            this.capability = filteredCapability;
        }
    },
    mounted() {
        this.fetchRoles();
    },
    updated() {
        this.handleFetchedData();
    }
};
</script>
