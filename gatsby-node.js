const axios = require('axios');
const createNodeHelpers = require('gatsby-node-helpers').default;

const { createNodeFactory, generateNodeId } = createNodeHelpers({
  typePrefix: 'TestData'
});

const IssueNode = createNodeFactory('TestIssue');
const TestNode = createNodeFactory('TestNode');

exports.sourceNodes = async ({ actions: { createNode } }) => {
  // TODO get this data from YAML
  const testData = [
    {
      id: 0,
      name: 'Jason',
      github: 'jlengstorf',
      likes: ['puppies', 'whiskey', 'snacks']
    },
    {
      id: 1,
      name: 'Santa',
      github: 'kyleamathews',
      likes: ['children', 'elves', 'reindeer']
    },
    {
      id: 2,
      name: 'Easter Bunny',
      likes: ['eggs']
    }
  ];

  await Promise.all(
    testData.map(async data => {
      if (data.github) {
        const response = await axios.get(
          `https://api.github.com/search/issues?q=org:gatsbyjs+author:${
            data.github
          }+type:pr+is:merged`
        );

        if (response.data && response.data.items) {
          const issues = response.data.items;

          data.issues = issues.map(issue => {
            const issueNode = IssueNode(issue, {
              parent: generateNodeId('TestNode', data.id)
            });

            createNode(issueNode);

            return issueNode;
          });
        }
      }

      const testNode = TestNode(data);
      createNode(testNode);
    })
  );

  return;
};
