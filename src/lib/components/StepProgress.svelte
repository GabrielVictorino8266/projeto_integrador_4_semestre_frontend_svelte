
<script>
  let {
    steps = [],
    currentStep = 1
  } = $props();
</script>

<div class="step-progress">
  {#each steps as step, index (step)}
    <div 
      class="step" 
      class:active={currentStep === index + 1}
      class:completed={currentStep > index + 1}
    >
      <div class="step-circle">{index + 1}</div>
      <div class="step-label">{step}</div>
    </div>
  {/each}
</div>

<style>
  .step-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    position: relative;
  }

  .step-progress::before {
    content: '';
    position: absolute;
    top: 18px;
    left: 16.5%;
    right: 16.5%;
    height: 2px;
    background-color: #1e3a5f;
    z-index: 0;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;
  }

  .step-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #162844;
    border: 2px solid #1e3a5f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    color: #4a5f7f;
    transition: all 0.3s ease;
  }

  .step.active .step-circle {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-color: #3b82f6;
    color: white;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }

  .step.completed .step-circle {
    background-color: #1e3a5f;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .step-label {
    font-size: 11px;
    color: #4a5f7f;
    transition: color 0.3s;
  }

  .step.active .step-label {
    color: #3b82f6;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .step-label {
      font-size: 10px;
    }
  }
</style>

