// mock-api/server.js
module.exports = () => {
  return {
    // Authentication endpoint data
    authenticate: {
      token: "mock-token-12345",
    },

    // Users data
    usuarios: [
      {
        id: 1,
        nome: "John Doe",
        email: "john@example.com",
        telefone: "11999999999",
        cpf: "12345678901",
      },
      {
        id: 2,
        nome: "Jane Smith",
        email: "jane@example.com",
        telefone: "11988888888",
        cpf: "98765432109",
      },
    ],
  };
};
