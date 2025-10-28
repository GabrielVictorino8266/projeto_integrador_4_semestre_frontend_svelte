<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';
    import '$lib/assets/app.css';

    let { children } = $props();
    let currentPath = $derived($page.url.pathname);
    let title = $derived($page.data.title || currentPath.replace('/', ''));
</script>

<div class="layout">
  <nav>
    <div class="nav-content">
      <div class="nav-brand">
        <div class="brand-icon">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
        <span class="brand-text">DriveFlow</span>
      </div>
      
      <ul class="nav-menu">
        <li>
          <a href={resolve('/dashboard')} class:active={currentPath.startsWith('/dashboard')}>
            <i class="fa-solid fa-table-columns"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href={resolve('/usuarios')} class:active={currentPath.startsWith('/usuarios')}>
            <i class="fa-solid fa-users"></i>
            <span>Usuários</span>
          </a>
        </li>
        <li>
          <a href={resolve('/veiculos')} class:active={currentPath.startsWith('/veiculos')}>
            <i class="fa-solid fa-car"></i>
            <span>Veículos</span>
          </a>
        </li>
        <li>
          <a href={resolve('/manutencoes')} class:active={currentPath.startsWith('/manutencoes')}>
            <i class="fa-solid fa-wrench"></i>
            <span>Manutenções</span>
          </a>
        </li>
        <li>
          <a href={resolve('/relatorios')} class:active={currentPath.startsWith('/relatorios')}>
            <i class="fa-solid fa-chart-line"></i>
            <span>Relatórios</span>
          </a>
        </li>
      </ul>

      <div class="nav-user">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <span class="user-name">Anderson</span>
        </div>
        <button aria-label="Sair" class="btn-logout" onclick={() => goto(resolve('/logout'))}>
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Sair</span>
        </button>
      </div>
    </div>
  </nav>

  <main>
    <h1 class="page-title">{title || 'Sem Título'}</h1>
    {@render children()}
  </main>
</div>

<style>
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    text-align: center;
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
    position: relative;
    padding-bottom: 1rem;
    text-transform:capitalize;
}

.page-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    border-radius: 2px;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

  .layout {
    min-height: 100vh;
    background: linear-gradient(to bottom, #0f172a, #1e293b);
  }

  nav {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2.5rem;
    max-width: 1600px;
    margin: 0 auto;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .nav-brand:hover {
    transform: translateY(-2px);
  }

  .brand-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .brand-icon i {
    font-size: 1.25rem;
    color: #fff;
  }

  .brand-text {
    font-size: 1.375rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-menu {
    list-style: none;
    display: flex;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
  }

  .nav-menu li a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;
    text-decoration: none;
    padding: 0.625rem 1.125rem;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    font-size: 0.9375rem;
    position: relative;
    overflow: hidden;
  }

  .nav-menu li a i {
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  .nav-menu li a::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 10px;
  }

  .nav-menu li a:hover {
    color: #fff;
    transform: translateY(-2px);
  }

  .nav-menu li a:hover::before {
    opacity: 1;
  }

  .nav-menu li a:hover i {
    transform: scale(1.1);
  }

  .nav-menu li a.active {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .nav-menu li a.active::before {
    opacity: 0;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(51, 65, 85, 0.5);
    border-radius: 50px;
    border: 1px solid rgba(148, 163, 184, 0.1);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .user-avatar i {
    font-size: 0.875rem;
    color: #fff;
  }

  .user-name {
    font-weight: 600;
    color: #e2e8f0;
    font-size: 0.9375rem;
  }

  .btn-logout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.2);
    color: #f87171;
    cursor: pointer;
    padding: 0.625rem 1.125rem;
    border-radius: 10px;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.9375rem;
  }

  .btn-logout:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    border-color: #dc2626;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  .btn-logout i {
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  .btn-logout:hover i {
    transform: translateX(3px);
  }

  main {
    padding: 2.5rem;
    max-width: 1600px;
    margin: 0 auto;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .nav-content {
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
    }

    .nav-menu {
      order: 3;
      flex-basis: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    .user-name {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 1.25rem;
      padding: 1rem;
    }

    .nav-menu {
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
    }

    .nav-menu li a {
      justify-content: center;
      width: 100%;
    }

    .nav-user {
      width: 100%;
      justify-content: center;
    }

    .user-info {
      flex: 1;
      justify-content: center;
    }

    .user-name {
      display: block;
    }

    main {
      padding: 1.5rem;
    }
  }
</style>