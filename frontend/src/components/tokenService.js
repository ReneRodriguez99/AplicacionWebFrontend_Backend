//Guarda tokens.
export default {
    token: '',
    setToken(newToken) {
      this.token = newToken;
    },
    getToken() {
      return this.token;
    },
  };