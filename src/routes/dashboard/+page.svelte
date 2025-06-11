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
    // 페이지 로드시 인증 상태 확인
    if (!auth.isAuthenticated) {
      goto('/login');
      return;
    }

    // 토큰 만료 체크 및 갱신
    await authStore.checkAndRefreshToken();
  });

  function handleLogout() {
    authStore.logout();
    goto('/login');
  }

  function formatExpiresAt(timestamp: number | null): string {
    if (!timestamp) return '알 수 없음';
    return new Date(timestamp).toLocaleString('ko-KR');
  }
</script>

{#if auth && auth.isAuthenticated}
  <main class="container">
    <header class="header">
      <h1>대시보드</h1>
      <button class="logout-button" on:click={handleLogout}>
        로그아웃
      </button>
    </header>

    <div class="content">
      <div class="welcome-card">
        <h2>환영합니다, {auth.username}님!</h2>
        <p>성공적으로 로그인되었습니다.</p>
      </div>

      <div class="info-card">
        <h3>인증 정보</h3>
        <div class="info-item">
          <span class="label">사용자명:</span>
          <span class="value">{auth.username}</span>
        </div>
        <div class="info-item">
          <span class="label">토큰 만료 시간:</span>
          <span class="value">{formatExpiresAt(auth.expiresAt)}</span>
        </div>
        <div class="info-item">
          <span class="label">토큰 타입:</span>
          <span class="value">Bearer</span>
        </div>
      </div>

      <div class="actions-card">
        <h3>사용 가능한 작업</h3>
        <div class="action-buttons">
          <button class="action-button" on:click={() => authStore.refreshToken()}>
            토큰 갱신
          </button>
          <button class="action-button secondary" on:click={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </main>
{:else}
  <div class="loading">
    <p>로딩 중...</p>
  </div>
{/if}

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #eee;
  }

  .header h1 {
    color: #333;
    margin: 0;
  }

  .logout-button {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .logout-button:hover {
    background-color: #c82333;
  }

  .content {
    display: grid;
    gap: 2rem;
  }

  .welcome-card,
  .info-card,
  .actions-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .welcome-card h2 {
    color: #28a745;
    margin-bottom: 0.5rem;
  }

  .welcome-card p {
    color: #666;
    margin: 0;
  }

  .info-card h3,
  .actions-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: #555;
  }

  .value {
    color: #333;
    font-family: monospace;
    background-color: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .action-button:hover {
    background-color: #0056b3;
  }

  .action-button.secondary {
    background-color: #6c757d;
  }

  .action-button.secondary:hover {
    background-color: #545b62;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 1.2rem;
    color: #666;
  }

  @media (max-width: 600px) {
    .header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .action-buttons {
      flex-direction: column;
    }
  }
</style> 