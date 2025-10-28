<script>
	import { fade, scale } from 'svelte/transition';
	import dismissable from '$lib/utils/dismissable';

	let { title, onClose, children } = $props();
</script>

<div
	class="modal-overlay"
	transition:fade={{ duration: 300 }}
>
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		use:dismissable={{ active: true }}
		ondismiss={onClose}
		transition:scale={{ duration: 300, start: 0.8 }}
	>
		<div class="modal-header">
			<h2 id="modal-title">{title}</h2>
			<button aria-label="Fechar modal" class="close-btn" onclick={onClose}>
				<i class="fas fa-times" aria-hidden="true"></i>
			</button>
		</div>
		<div class="modal-content">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}

	.modal {
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 20px;
		padding: 35px;
		width: 90%;
		max-width: 550px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25px;
		padding-bottom: 20px;
		border-bottom: 1px solid rgba(59, 130, 246, 0.2);
	}

	.modal-header h2 {
		color: #e0e6ed;
		font-size: 24px;
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		color: #94a3b8;
		font-size: 28px;
		cursor: pointer;
		transition: all 0.3s ease;
		width: 35px;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
	}

	.close-btn:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		transform: scale(1.1);
	}

	.close-btn:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	.modal-content {
		line-height: 1.6;
	}
</style>