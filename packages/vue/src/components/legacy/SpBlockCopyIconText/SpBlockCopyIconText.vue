<template>
	<SpIconText
		class="copy-icon-text"
		:text="text"
		:link="link"
		:icon-type="'copy'"
		:is-icon-clickable="true"
		:tooltip-option="'iconWrapper'"
		:tooltip-states="{ text: dynamicTooltipText, state: tooltipState }"
		:tooltip-direction="tooltipDirection"
		@iconClicked="handleClicked"
	/>
</template>

<script>
import SpIconText from '../../SpIconText'

const COPY_STATES = {
	EMPTY: 'EMPTY',
	COPYING: 'COPYING',
	SUCCESS: 'SUCCESS',
	FAIL: 'FAIL'
}

export default {
	name: 'SpBlockCopyIconText',
	components: {
		SpIconText
	},
	props: {
		text: { type: String, required: true },
		link: { type: String, default: null },
		copyContent: { type: String, default: '' },
		tooltipText: { type: String, default: null },
		tooltipDirection: {
			type: String,
			default: 'right',
			validator: function (value) {
				return ['top', 'right', 'left'].indexOf(value) !== -1
			}
		}
	},
	data() {
		return {
			copyState: COPY_STATES.EMPTY,
			dynamicTooltipText: ''
		}
	},
	computed: {
		tooltipState() {
			switch (this.copyState) {
				case COPY_STATES.EMPTY:
					return false
				case COPY_STATES.COPYING:
				case COPY_STATES.SUCCESS:
				case COPY_STATES.FAIL:
					return true
				default:
					return false
			}
		}
	},
	watch: {
		tooltipState() {
			if (this.tooltipState) {
				switch (this.copyState) {
					case COPY_STATES.COPYING:
						this.dynamicTooltipText = 'Copying data...'
						break
					case COPY_STATES.SUCCESS:
						this.dynamicTooltipText = this.tooltipText
							? this.tooltipText
							: 'API URL is copied'
						break
					case COPY_STATES.FAIL:
						this.dynamicTooltipText = 'Error copying data'
						break
					default:
						this.dynamicTooltipText = 'Copying data...'
						break
				}
			}
		}
	},
	methods: {
		setCopyState(state) {
			const fmtState =
				Object.keys(COPY_STATES).filter((key) => state === key).length < 0
					? COPY_STATES.EMPTY
					: state

			this.copyState = fmtState
		},
		handleCopy() {
			function fallbackCopyTextToClipboard(
				text,
				sucessCallback,
				failedCallback
			) {
				const textArea = document.createElement('textarea')
				textArea.value = text

				// Avoid scrolling to bottom
				textArea.style.top = '0'
				textArea.style.left = '0'
				textArea.style.position = 'fixed'

				document.body.appendChild(textArea)
				textArea.focus()
				textArea.select()

				try {
					if (sucessCallback) sucessCallback()
				} catch (err) {
					console.error('Fallback: Oops, unable to copy', err)
					if (failedCallback) failedCallback()
				}

				document.body.removeChild(textArea)
			}
			function copyTextToClipboard(text, sucessCallback, failedCallback) {
				if (!navigator.clipboard) {
					fallbackCopyTextToClipboard(text)
					return
				}
				navigator.clipboard.writeText(text).then(
					function () {
						if (sucessCallback) sucessCallback()
					},
					function (err) {
						console.error('Async: Could not copy text: ', err)
						if (failedCallback) failedCallback()
					}
				)
			}
			function actionCallback(isSuccess = true, envThis) {
				return () => {
					if (isSuccess) {
						envThis.setCopyState(COPY_STATES.SUCCESS)
					} else {
						envThis.setCopyState(COPY_STATES.FAIL)
					}

					setTimeout(function () {
						envThis.setCopyState(COPY_STATES.EMPTY)
					}, 1000)
				}
			}

			/*
       *
       // 1. Set copying status to COPYING
       *
       */
			this.setCopyState(COPY_STATES.COPYING)
			/*
       *
       // 2. Init copy process
       *
       */
			copyTextToClipboard(
				this.copyContent,
				actionCallback(true, this),
				actionCallback(false, this)
			)
		},
		handleClicked() {
			this.handleCopy()
		}
	}
}
</script>

<style scoped>
.copy-icon-text {
	display: flex;
}
.copy-icon-text ::v-deep(a) {
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
