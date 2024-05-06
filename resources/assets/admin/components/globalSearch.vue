<template>
    <div v-if="showSearch" class="global-search-wrapper" @click="reset">
        <div class="global-search-container " v-loading="loading" @click.stop="">
            <div class="global-search-body " ref="searchBody">
                <div class="el-input el-input--prefix">
                    <input ref="searchInput"
                           prefix-icon="el-icon-search"
                           @input="search($event.target.value)"
                           type="text" name="search"
                           :placeholder="$t(placeholder)"
                           autocomplete="off"
                    />
                    <span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>
                </div>

                <ul class="search-result">
	                <template v-if="this.filteredLinks.length">
		                <li
			                ref="links" v-for="(link, i) in filteredLinks"
			                :key="'link_' + i"
			                tabindex='1'
			                :class="{'active-search-link' : linkFocusIndex === i}"
			                @click="goToSlug($event, link.item || link)"
		                >
			                <span>{{ link.item?.title || link.title }}</span>
		                </li>
	                </template>
	                <li v-else>
		                <span>{{ $t('Search not match. Try a different query.') }}</span>
	                </li>
                </ul>
            </div>
            <div>
                <ul class="search-commands">
                    <li>{{ $t('Esc to close') }}</li>
                    <li>
                        {{ $t('Navigate') }}
                        <i class="el-icon-bottom"></i>
                        <i class="el-icon-top"></i>
                    </li>
                    <li>{{ $t('Tab to focus search') }}</li>
                    <li>{{ $t('Enter to Select') }}</li>
                </ul>
            </div>
        </div>
	</div>
</template>

<script>
import Fuse from 'fuse.js'

export default {
	name: 'global-search',
	data() {
		return {
			showSearch: false,
			placeholder: 'Search anything',
			links: [],
			filteredLinks: [],
			adminUrl: '',
			siteUrl: '',
			linkFocusIndex: 0,
			loading: true,
			fuse: {}
		}
	},
	methods: {
		getSearchData() {
			const url = FluentFormsGlobal.$rest.route('globalSearch')
			FluentFormsGlobal.$rest.get(url)
				.then((response) => {
					this.adminUrl = response.admin_url;
					this.siteUrl = response.site_url;
					this.links = response.links;
					this.fuse = new Fuse(this.links, {minMatchCharLength: 2, threshold: 0.4, keys: ["title","tags"]});
					this.filteredLinks = this.links.slice(0, 7);
				})
				.catch( (error)  => {
					console.log(error);
				})
				.finally(() => {
					this.loading = false;
				})
		},
		search(value) {
			this.linkFocusIndex = 0;
			if (!value) {
				this.filteredLinks = this.links.slice(0, 7);
				return;
			}
			this.filteredLinks = this.fuse.search?.(value, {limit: 50}) || this.links.slice(0, 7);
		},
		reset() {
			this.showSearch && (this.showSearch = false);
			this.linkFocusIndex = 0;
		},
		goToSlug($event, link) {
			const oldUrl = new URL(window.location);
			if (link.type && link.type === 'preview') {
				window.location.href = this.siteUrl + '/' + link.path;
				return;
			} else {
				window.location.href = this.adminUrl + link.path;
			}

			if (this.shouldReload(link, oldUrl)) {
				window.location.reload();
			}
		},
		shouldReload(link, oldUrl) {
			const url = new URL(link.path, this.adminUrl);
			const oldPage = oldUrl.searchParams.get('page');
			const newPage = url.searchParams.get('page');
			const oldComponent = oldUrl.searchParams.get('component');
			const newComponent = url.searchParams.get('component');
			const oldFormId = oldUrl.searchParams.get('form_id');
			const newFormId = url.searchParams.get('form_id');
			const oldRoute = oldUrl.searchParams.get('route');
			const newRoute = url.searchParams.get('route');

			const oldHash = oldUrl.hash;
			const newHash = url.hash;
			if (newPage !== oldPage) {
				return false;
			}
			if ((oldFormId || newFormId) && oldFormId !== newFormId) {
				return false;
			}

			if ((oldRoute || newRoute) && oldRoute === newRoute) {
				return true;
			}
			if ((oldComponent || newComponent) && oldComponent === newComponent) {
				return true;
			}
			if ((!oldComponent && !newComponent) && (oldHash || newHash) && oldHash !== newHash) {
				return true;
			}
			return false;
		},
		listener(e) {
			const isMac = window?.navigator.userAgent?.toUpperCase().includes('MAC');
			if ((isMac ? e.metaKey : e.ctrlKey) && e.keyCode === 75) {
				e.preventDefault && e.preventDefault();
				if (!this.showSearch) {
					this.showSearch = true;
				} else {
					this.reset()
					return;
				}
				setTimeout(() => {
					this.$refs.searchInput?.focus();
				}, 500);
				if (!this.links.length) {
					this.getSearchData()
				}
			}
			if (this.showSearch) {
				if (e.keyCode === 27) {
					// close on ESC button press
					e.preventDefault()
					this.reset()
				} else if (e.keyCode === 38 || e.keyCode === 40) {
					e.preventDefault();
					this.handleUpDownArrow(e);
				} else if (e.keyCode === 9) {
					// Tab key for focus input el
					e.preventDefault();
					this.$refs.searchInput?.focus();
					this.linkFocusIndex = 0;
				} else if (e.keyCode === 13) {
					// Enter press
					if (this.filteredLinks.length) {
						const link = this.filteredLinks[this.linkFocusIndex];
						if (link) {
							this.goToSlug(undefined, link.item || link);
						}
					}
				}
			}
		},
		handleUpDownArrow(e) {
			if (this.$refs.links && Array.isArray(this.$refs.links)) {
				if (e.keyCode === 38) {
					this.linkFocusIndex -= 1;
				} else {
					this.linkFocusIndex += 1;
				}
				if (this.linkFocusIndex >= this.filteredLinks.length || this.linkFocusIndex <= 0) {
					this.$refs.searchInput?.focus();
					this.$refs.searchBody?.scroll?.({top:0});
					this.linkFocusIndex = 0;
					return;
				}
				let $link = this.$refs.links[this.linkFocusIndex -1];
				if ($link) {
					this.$nextTick(() => {
						$link.focus();
					});
				}
			}
		}
	},
	created() {
		if (window.fluent_forms_global_var?.global_search_active === 'yes') {
			document.addEventListener('keydown', this.listener);
			document.addEventListener('global-search-menu-button-click',  (e) => {
				this.listener({ctrlKey: true, metaKey : true, keyCode: 75})
			})
		}
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.listener);
	}
}
</script>


