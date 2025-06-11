<script lang="ts">
  import { createUser, ApiError } from '$lib/api';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';

  async function handleSubmit() {
    error = '';
    
    if (!username || !password || !confirmPassword) {
      error = '모든 필드를 입력해주세요.';
      return;
    }

    if (password !== confirmPassword) {
      error = '비밀번호가 일치하지 않습니다.';
      return;
    }

    if (password.length < 6) {
      error = '비밀번호는 최소 6자 이상이어야 합니다.';
      return;
    }

    loading = true;

    try {
      await createUser({
        user: { username, password }
      });
      
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      goto('/login');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          error = '이미 존재하는 사용자명입니다.';
        } else {
          error = err.message;
        }
      } else {
        error = '회원가입 중 오류가 발생했습니다.';
      }
    } finally {
      loading = false;
    }
  }
</script>

<main class="container">
  <div class="form-container">
    <h1>회원가입</h1>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">사용자명</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="사용자명을 입력하세요"
          disabled={loading}
          required
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="비밀번호를 입력하세요"
          disabled={loading}
          required
        />
      </div>

      <div class="form-group">
        <label for="confirm-password">비밀번호 확인</label>
        <input
          id="confirm-password"
          type="password"
          bind:value={confirmPassword}
          placeholder="비밀번호를 다시 입력하세요"
          disabled={loading}
          required
        />
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button type="submit" class="submit-button" disabled={loading}>
        {loading ? '가입 중...' : '회원가입'}
      </button>
    </form>

    <div class="links">
      <p>이미 계정이 있으신가요? <a href="/login">로그인하기</a></p>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  input:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .submit-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .links {
    text-align: center;
    margin-top: 1rem;
  }

  .links a {
    color: #007bff;
    text-decoration: none;
  }

  .links a:hover {
    text-decoration: underline;
  }
</style> 