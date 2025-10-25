<script>
	import { fly } from 'svelte/transition';
	import { toastState } from '$lib/stores/toast.svelte.js';
</script>

{#each toastState.toasts as toast, index (toast.id)}
	<div 
		class="toast toast-{toast.type}" 
		style="top: {30 + index * 110}px; --toast-duration: {toast.duration}ms"
		transition:fly={{ x: 400, duration: 300 }}
	>
		<div class="toast-icon">
			{#if toast.type === 'success'}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
			{/if}
		</div>
		<div class="toast-content">
			<div class="toast-title">{toast.title}</div>
			<div class="toast-message">{toast.message}</div>
		</div>
		<div class="toast-progress toast-progress-{toast.type}"></div>
	</div>
{/each}

<style>
	.toast {
		position: fixed;
		right: 30px;
		background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
		backdrop-filter: blur(24px);
		border: 1px solid rgba(148, 163, 184, 0.15);
		border-radius: 16px;
		padding: 18px 22px;
		display: flex;
		align-items: center;
		gap: 16px;
		min-width: 320px;
		max-width: 450px;
		z-index: 3000;
		box-shadow: 
			0 4px 6px rgba(0, 0, 0, 0.1),
			0 12px 24px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.03) inset;
		transition: top 300ms cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		pointer-events: auto;
	}
	.toast::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
	}
	.toast-success {
		border-color: rgba(34, 197, 94, 0.25);
	}
	.toast-error {
		border-color: rgba(239, 68, 68, 0.25);
	}
	.toast-icon {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: relative;
	}
	.toast-icon svg {
		width: 22px;
		height: 22px;
		position: relative;
		z-index: 1;
	}
	.toast-success .toast-icon {
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%);
		color: #4ade80;
		box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
	}
	.toast-error .toast-icon {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
		color: #f87171;
		box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
	}
	.toast-content {
		flex: 1;
		min-width: 0;
	}
	.toast-title {
		font-weight: 600;
		font-size: 15px;
		margin-bottom: 4px;
		color: #f1f5f9;
		letter-spacing: -0.01em;
	}
	.toast-message {
		font-size: 13px;
		color: #94a3b8;
		line-height: 1.5;
	}
	.toast-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		width: 100%;
		transform-origin: left;
		animation: progress var(--toast-duration) linear forwards;
	}
	.toast-progress-success {
		background: linear-gradient(90deg, #22c55e, #4ade80);
		box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
	}
	.toast-progress-error {
		background: linear-gradient(90deg, #ef4444, #f87171);
		box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
	}
	@keyframes progress {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
</style>