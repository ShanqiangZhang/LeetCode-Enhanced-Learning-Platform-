const { CUR_MODE } = process.env;
const URLconfig = {
  development: {
    frontend_url: 'http://localhost:3000',
    backend_url: 'http://localhost:3001',
    domain: 'localhost'
  },
  launch: {
    frontend_url: 'http://leetcode-cards.com',
    backend_url: 'http://localhost:3001',
    domain: 'leetcode-cards.com'
  }
};

module.exports = URLconfig[CUR_MODE];
