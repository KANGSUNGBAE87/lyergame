export const authProvider = {
  async getUser() {
    return null;
  },

  async login() {
    throw new Error('login not implemented in v2');
  },
};
