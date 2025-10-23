<script>
  import { toastState } from "$lib/state/toast.svelte.js";
  import { goto } from "$app/navigation";
  import { deserialize } from "$app/forms";
  import { logger } from "$lib/utils/logger";

  import { StepProgress } from "$lib/components/registration";
  import Toaster from "$lib/components/ui/Toaster.svelte";

  import {
    PageHeader,
    Card,
    Input,
    PasswordInput,
    FormRow,
    ButtonGroup,
    Button,
  } from "$lib/components/ui";

  import {
    validarCNPJ,
    validarCPF,
    validarEmail,
    validarIdade,
  } from "$lib/utils/validation";

  let currentYear = $state(new Date().getFullYear());
  let activeStep = $state(1);
  let validationErrors = $state({});

  let registrationForm = $state({
    razaoSocial: "Empresa Fake",
    nomeFantasia: "Fake Inc.",
    cnpj: "32512341000132",
    nome: "Fake User",
    email: "29281025078@mailinator.com",
    cpf: "29281025078",
    dataNascimento: "1990-01-01",
    telefone: "(11) 90000-0000",
    senha: "",
    confirmarSenha: "",
  });

  let registrationState = $state({
    isLoading: false,
    errorMessage: null,
  });

  const registrationSteps = $state(["Empresa", "Administrador", "Senha"]);

  const fieldValidators = {
    razaoSocial: () => {
      if (!registrationForm.razaoSocial?.trim())
        return "Razão Social é obrigatória";
    },

    nomeFantasia: () => {
      if (!registrationForm.nomeFantasia?.trim())
        return "Nome Fantasia é obrigatório";
    },

    cnpj: () => {
      if (!registrationForm.cnpj?.trim()) return "CNPJ é obrigatório";
      if (!validarCNPJ(registrationForm.cnpj)) return "CNPJ inválido";
    },

    nome: () => {
      if (!registrationForm.nome?.trim()) return "Nome é obrigatório";
    },

    email: () => {
      if (!registrationForm.email?.trim()) return "Email é obrigatório";
      if (!validarEmail(registrationForm.email)) return "Email inválido";
    },

    cpf: () => {
      if (!registrationForm.cpf?.trim()) return "CPF é obrigatório";
      if (!validarCPF(registrationForm.cpf)) return "CPF inválido";
    },

    dataNascimento: () => {
      if (!registrationForm.dataNascimento?.trim())
        return "Data de Nascimento é obrigatória";
      if (!validarIdade(registrationForm.dataNascimento))
        return "Idade inválida";
    },

    telefone: () => {
      if (!registrationForm.telefone?.trim()) return "Telefone é obrigatório";
    },

    senha: () => {
      if (!registrationForm.senha?.trim()) return "Senha é obrigatória";
    },

    confirmarSenha: () => {
      if (!registrationForm.confirmarSenha?.trim())
        return "Confirmar Senha é obrigatória";
      if (registrationForm.senha !== registrationForm.confirmarSenha)
        return "As senhas não coincidem";
    },
  };

  function validateCurrentStep(stepNumber) {
    switch (stepNumber) {
      case 1:
        validationErrors = {
          razaoSocial: fieldValidators.razaoSocial(),
          nomeFantasia: fieldValidators.nomeFantasia(),
          cnpj: fieldValidators.cnpj(),
        };
        break;
      case 2:
        validationErrors = {
          nome: fieldValidators.nome(),
          email: fieldValidators.email(),
          cpf: fieldValidators.cpf(),
          dataNascimento: fieldValidators.dataNascimento(),
          telefone: fieldValidators.telefone(),
        };
        break;
      case 3:
        validationErrors = {
          senha: fieldValidators.senha(),
          confirmarSenha: fieldValidators.confirmarSenha(),
        };
        break;
    }

    return Object.values(validationErrors).some(Boolean) === false;
  }

  function handleFieldBlur(event) {
    const { id: fieldName } = event.target;
    validationErrors[fieldName] = fieldValidators[fieldName]?.() || undefined;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (!validateCurrentStep(activeStep)) {
      return;
    }

    registrationState.isLoading = true;

    try {
      const formData = new FormData();
      Object.entries(registrationForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(event.target.action, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200 && response.status !== 409) {
        throw new Error(
          `Request failed: ${response.status} ${response.statusText}`,
        );
      }

      const result = deserialize(await response.text());

      if (result.type === "success") {
        toastState.success("Cadastro concluído com sucesso! Você será redirecionado em instantes...", 3000);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        goto(result.data.redirect);
      } else {
        toastState.error(result.error.message, 6000);
      }
    } catch (error) {
      logger.error(error);
      toastState.error("Não foi possível concluir o cadastro.");
    } finally {
      registrationState.isLoading = false;
    }
  }

  function goToNextStep() {
    if (
      validateCurrentStep(activeStep) &&
      activeStep < registrationSteps.length
    ) {
      activeStep++;
    }
  }

  function goToPreviousStep() {
    if (activeStep > 1) {
      activeStep--;
    }
  }
</script>

<Toaster />

<div class="page-container">
  <Card>
    <PageHeader
      title="Cadastro de Empresa"
      subtitle="Crie sua conta em apenas 3 passos"
    />

    <StepProgress steps={registrationSteps} currentStep={activeStep} />

    <form onsubmit={handleFormSubmit}>
      {#if activeStep === 1}
        <div class="fade-in">
          <div class="section-title">Dados da Empresa</div>

          <Input
            id="razaoSocial"
            name="razaoSocial"
            label="Razão Social"
            placeholder="Digite a razão social da empresa"
            bind:value={registrationForm.razaoSocial}
            onblur={handleFieldBlur}
            error={validationErrors.razaoSocial}
          />

          <Input
            id="nomeFantasia"
            name="nomeFantasia"
            label="Nome Fantasia"
            placeholder="Digite o nome fantasia"
            bind:value={registrationForm.nomeFantasia}
            onblur={handleFieldBlur}
            error={validationErrors.nomeFantasia}
          />

          <Input
            id="cnpj"
            name="cnpj"
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            mask="##.###.###/####-##"
            maxlength="18"
            bind:value={registrationForm.cnpj}
            onblur={handleFieldBlur}
            error={validationErrors.cnpj}
          />

          <ButtonGroup>
            <Button onclick={goToNextStep}>PRÓXIMO</Button>
          </ButtonGroup>
        </div>
      {/if}

      {#if activeStep === 2}
        <div class="fade-in">
          <div class="section-title">Dados do Administrador</div>

          <Input
            id="nome"
            name="nome"
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            bind:value={registrationForm.nome}
            onblur={handleFieldBlur}
            error={validationErrors.nome}
          />

          <FormRow>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              bind:value={registrationForm.email}
              onblur={handleFieldBlur}
              error={validationErrors.email}
            />

            <Input
              id="cpf"
              name="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              mask="###.###.###-##"
              maxlength="14"
              bind:value={registrationForm.cpf}
              onblur={handleFieldBlur}
              error={validationErrors.cpf}
            />
          </FormRow>

          <FormRow>
            <Input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              label="Data de Nascimento"
              bind:value={registrationForm.dataNascimento}
              onblur={handleFieldBlur}
              error={validationErrors.dataNascimento}
            />

            <Input
              id="telefone"
              name="telefone"
              type="tel"
              label="Telefone"
              placeholder="(00) 00000-0000"
              maxlength="15"
              mask="(##) #####-####"
              bind:value={registrationForm.telefone}
              onblur={handleFieldBlur}
              error={validationErrors.telefone}
            />
          </FormRow>

          <ButtonGroup>
            <Button variant="secondary" onclick={goToPreviousStep}
              >VOLTAR</Button
            >
            <Button onclick={goToNextStep}>PRÓXIMO</Button>
          </ButtonGroup>
        </div>
      {/if}

      {#if activeStep === 3}
        <div class="fade-in">
          <div class="section-title">Crie sua Senha</div>

          <Input
            id="username"
            label="Usuário"
            hint="Este será seu nome de usuário para acessar o sistema."
            mask="###########"
            disabled
            copyable={true}
            bind:value={registrationForm.cpf}
          />

          <PasswordInput
            id="senha"
            name="senha"
            label="Senha"
            placeholder="Digite sua senha"
            hint="Mínimo 8 caracteres, inclua letras, números e símbolos"
            showStrength={true}
            onblur={handleFieldBlur}
            error={validationErrors.senha}
            bind:value={registrationForm.senha}
          />

          <PasswordInput
            id="confirmarSenha"
            name="confirmarSenha"
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            bind:value={registrationForm.confirmarSenha}
            onblur={handleFieldBlur}
            error={validationErrors.confirmarSenha}
          />

          <ButtonGroup>
            <Button
              variant="secondary"
              onclick={goToPreviousStep}
              disabled={registrationState.isLoading}>VOLTAR</Button
            >
            <Button type="submit" loading={registrationState.isLoading}
              >CADASTRAR</Button
            >
          </ButtonGroup>
        </div>
      {/if}

      <div class="login-link">
        Já possui uma conta? <a href="/login">Faça login</a>
      </div>
    </form>

    <footer>
      © Fev {currentYear} - Todos os direitos reservados.
    </footer>
  </Card>
</div>


<style>
    @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";

:global(body) {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #0a1628;
  /* overflow: hidden; */
}

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 18px;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #8b9cb6;
}

.login-link a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #60a5fa;
  text-decoration: underline;
}

footer {
  margin-top: 15px;
  text-align: center;
  font-size: 11px;
  color: #4a5f7f;
}

/* Form animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease;
}
</style>