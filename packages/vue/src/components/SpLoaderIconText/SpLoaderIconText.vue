<template>
	<SpIconText
		:class="['loader-icon-text', { '-is-loading': !isActive }]"
		:text="text"
		:link="link"
		:icon-type="iconType"
		:is-icon-first="true"
	/>
</template>

<script>
import SpIconText from '../SpIconText'

export default {
	name: 'SpLoaderIconText',
	components: {
		SpIconText
	},
	props: {
		text: { type: String, required: true },
		link: { type: String, default: null },
		isActive: { type: Boolean, default: true },
		activeIconType: {
			type: String,
			default: 'successDot',
			validator: function (value) {
				return ['successDot', 'check'].indexOf(value) !== -1
			}
		}
	},
	computed: {
		iconType() {
			return this.isActive ? this.activeIconType : 'spinner'
		}
	}
}
</script>

<style scoped>
.loader-icon-text.-is-loading {
	opacity: 0.45;
}
</style>
