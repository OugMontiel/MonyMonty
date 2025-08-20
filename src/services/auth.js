// src/services/auth.js
class AuthService {
  TOKEN_KEY = "token";
  USER_KEY = "user";

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obtener token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Guardar token
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener datos del usuario
  getUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Guardar datos del usuario
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Login (simulado, lo reemplazarás con tu API)
  async login(credentials) {

    const response = await api.post("http://localhost:3000/auth/login", {
      email: this.username,
      password: this.password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Redirige al Dashboard de la aplicación
      this.redirectToDashboard();
    } else {
      this.showErrorCuenta = true;
    }
    
    return {
      token: "fake-token-" + Date.now(),
      user: {
        name: "Usuario Demo",
        email: credentials.email,
        plan: "Premium",
      },
    };
  }
}

export default new AuthService();
