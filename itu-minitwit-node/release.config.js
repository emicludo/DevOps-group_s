const config = {
    branches: ['automatic-release'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        ["@semantic-release/git", {
            "assets": ["src/*.js", "package.json"],
            "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
        }],
        '@semantic-release/github'
    ]
};

module.exports = config;