const axios = require('axios');
const YAML = require('yamljs');
const gh = require('parse-github-url');
const createNodeHelpers = require('gatsby-node-helpers').default;

const { createNodeFactory, generateNodeId } = createNodeHelpers({
  typePrefix: 'Starters'
});

const Repo = createNodeFactory('Repo');
const Starter = createNodeFactory('Starter');

const getRepo = async repoUrl => {
  const { owner, name } = gh(repoUrl);

  return await axios.get(`https://api.github.com/repos/${owner}/${name}`);
};

exports.sourceNodes = async ({ actions: { createNode } }) => {
  const starters = YAML.load('./data/starters.yml');

  await Promise.all(
    starters.map(async starter => {
      const starterNode = Starter(starter, node => {
        node.id = generateNodeId('Starter', node.name);

        return node;
      });

      const repo = await getRepo(starter.repo);

      const repoNode = Repo(repo.data);

      repoNode.starter___NODE = starterNode.id;
      starterNode.repo___NODE = repoNode.id;

      createNode(repoNode);
      createNode(starterNode);
    })
  );
};
