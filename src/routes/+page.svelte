<script lang="ts">
  import { authStore } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let auth: any;
  
  // 인증 상태 구독
  authStore.subscribe(value => {
    auth = value;
  });

  onMount(async () => {
    // 이미 로그인된 경우 대시보드로 이동
    if (auth && auth.isAuthenticated) {
      goto('/dashboard');
    }
  });
</script>

<main class="container">
  <header class="header">
    <h1>Tasker UI</h1>
    <p class="subtitle">회원가입과 로그인을 통해 시작하세요</p>
  </header>

  <div class="content">
    {#if auth && auth.isAuthenticated}
      <div class="welcome-section">
        <h2>환영합니다, {auth.username}님!</h2>
        <div class="button-group">
          <button class="primary-button" on:click={() => goto('/dashboard')}>
            대시보드로 이동
          </button>
          <button class="secondary-button" on:click={() => authStore.logout()}>
            로그아웃
          </button>
        </div>
      </div>
    {:else}
      <div class="auth-section">
        <h2>시작하기</h2>
        <p>계정을 만들거나 기존 계정으로 로그인하세요.</p>
        
        <div class="button-group">
          <button class="primary-button" on:click={() => goto('/register')}>
            회원가입
          </button>
          <button class="secondary-button" on:click={() => goto('/login')}>
            로그인
          </button>
        </div>
      </div>
    {/if}

    <div class="features-section">
      <h3>기능</h3>
      <div class="features-grid">
        <div class="feature-card">
          <h4>🔐 보안 인증</h4>
          <p>JWT 토큰 기반의 안전한 인증 시스템</p>
        </div>
        <div class="feature-card">
          <h4>🔄 자동 갱신</h4>
          <p>토큰 만료 전 자동 갱신으로 seamless한 사용자 경험</p>
        </div>
        <div class="feature-card">
          <h4>💾 상태 유지</h4>
          <p>브라우저 새로고침 후에도 로그인 상태 유지</p>
        </div>
        <div class="feature-card">
          <h4>📱 반응형 디자인</h4>
          <p>모든 디바이스에서 최적화된 사용자 인터페이스</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .header h1 {
    font-size: 3rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin: 0;
  }

  .content {
    display: grid;
    gap: 3rem;
  }

  .welcome-section,
  .auth-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .welcome-section h2 {
    color: #28a745;
    margin-bottom: 1.5rem;
  }

  .auth-section h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  .auth-section p {
    color: #666;
    margin-bottom: 2rem;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .primary-button {
    padding: 0.75rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .primary-button:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }

  .secondary-button {
    padding: 0.75rem 2rem;
    background-color: transparent;
    color: #007bff;
    border: 2px solid #007bff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .secondary-button:hover {
    background-color: #007bff;
    color: white;
    transform: translateY(-1px);
  }

  .features-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .features-section h3 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e9ecef;
  }

  .feature-card h4 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .feature-card p {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    .header h1 {
      font-size: 2rem;
    }

    .button-group {
      flex-direction: column;
      align-items: center;
    }

    .primary-button,
    .secondary-button {
      width: 100%;
      max-width: 300px;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
