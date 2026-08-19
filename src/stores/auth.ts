import { defineStore } from 'pinia';

export interface User {
  name: string;
  email: string;
  password: string;
}

// Todos os dados ficam apenas em memória (array), sem localStorage e sem banco de dados.
// Ao recarregar o app, os usuários cadastrados e a sessão são perdidos.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null,
  }),
  getters: {
    isLoggedIn: (state) => state.currentUser !== null,
  },
  actions: {
    register(name: string, email: string, password: string): { ok: boolean; message?: string } {
      const emailNormalized = email.trim().toLowerCase();
      if (this.users.some((u) => u.email === emailNormalized)) {
        return { ok: false, message: 'Já existe um usuário cadastrado com esse e-mail.' };
      }
      this.users.push({ name: name.trim(), email: emailNormalized, password });
      return { ok: true };
    },
    login(email: string, password: string): { ok: boolean; message?: string } {
      const emailNormalized = email.trim().toLowerCase();
      const user = this.users.find((u) => u.email === emailNormalized && u.password === password);
      if (!user) {
        return { ok: false, message: 'E-mail ou senha inválidos.' };
      }
      this.currentUser = user;
      return { ok: true };
    },
    logout() {
      this.currentUser = null;
    },
  },
});
