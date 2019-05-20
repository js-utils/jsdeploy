export default {
  default: {
    deployTo: '/server-project-path',
    repositoryUrl: 'git://...',
    keepReleases: 8,
    only: null,
    ignores: [],
    shared: {
      dirs: ['node_modules'],
      files: ['pm2.config.json']
    },
    staging: {
      servers: [{
        host: '',
        user: ''
      }],
      branch: 'develop'
    }
  }
}
