<script>
	import dismissable from '$lib/utils/dismissable';
	import { fade, scale } from 'svelte/transition';

	let {
		title,
		message,
		isLoading = false,
		confirmText = 'Confirmar',
		cancelText = 'Cancelar',
		onConfirm,
		onCancel
	} = $props();

	async function handleConfirm() {
		await onConfirm?.();
	}

	async function handleCancel() {
		await onCancel?.();
	}
</script>

<div class="dialog-backdrop" role="presentation" transition:fade={{ duration: 300 }}>
	<div
		class="dialog-container"
		role="dialog"
		aria-modal="true"
		use:dismissable={{ active: true }}
		ondismiss={handleCancel}
		transition:scale={{ duration: 300, start: 0.8 }}
	>
		<button class="close-button" onclick={handleCancel} aria-label="Close">
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 1L13 13M1 13L13 1"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</button>

		<h2 class="dialog-title">{title}</h2>
		<p class="dialog-message">{@render message()}</p>

		<div class="dialog-actions">
			<button class="btn btn-cancel" onclick={handleCancel}>
				{cancelText}
			</button>

			{#if isLoading}
				<button class="btn btn-confirm" aria-label="Carregando..." disabled>
					<i class="fas fa-xl fa-spinner fa-spin"></i>
				</button>
			{:else}
				<button class="btn btn-confirm" onclick={handleConfirm}>
					{confirmText}
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.dialog-backdrop {
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

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.dialog-container {
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 20px;
		padding: 35px;
		max-width: 450px;
		width: 90%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		position: relative;
	}

	.close-button {
		position: absolute;
		top: 16px;
		right: 16px;
		background: none;
		border: none;
		color: #94a3b8;
		cursor: pointer;
		width: 35px;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-size: 28px;
	}

	.close-button:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.dialog-title {
		font-size: 24px;
		font-weight: 700;
		color: #e0e6ed;
		margin: 0 0 12px 0;
		text-align: center;
	}

	.dialog-message {
		font-size: 16px;
		color: #94a3b8;
		margin: 0 0 32px 0;
		text-align: center;
		line-height: 1.5;
	}

	.dialog-actions {
		display: flex;
		gap: 12px;
		padding-top: 20px;
		border-top: 1px solid rgba(59, 130, 246, 0.2);
	}

	.btn {
		flex: 1;
		padding: 12px 24px;
		font-size: 16px;
		font-weight: 600;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s;
		font-family: inherit;
	}

	.btn-cancel {
		background: rgba(59, 130, 246, 0.1);
		color: #94a3b8;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.btn-cancel:hover {
		background: rgba(59, 130, 246, 0.15);
		color: #e0e6ed;
	}

	.btn-confirm {
		background: rgba(239, 68, 68, 0.2);
		color: #ef4444;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.btn-confirm:hover:not(:disabled) {
		background: rgba(239, 68, 68, 0.3);
		color: #fee2e2;
	}

	.btn-confirm:disabled {
		cursor: not-allowed;
		background: rgba(239, 68, 68, 0.2);
	}

	.btn:active {
		transform: scale(0.98);
	}
</style>
