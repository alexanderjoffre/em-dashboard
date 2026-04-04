export const GET_REPOSITORIES_GRAPHQL_QUERY = `
query GetRepoPRMetrics($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    
    pullRequests(
      first: 50,
      states: [OPEN, MERGED],
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      nodes {
        id
        title
        state
        url

        createdAt
        updatedAt
        closedAt
        mergedAt

        author {
          login
          avatarUrl
        }

        additions
        deletions
        changedFiles

        commits {
          totalCount
        }

        reviews(first: 20) {
          totalCount
          nodes {
            state
            submittedAt
            author {
              login
              avatarUrl
            }
          }
        }

        comments {
          totalCount
        }

        statusCheckRollup {
          state
        }
      }
    }
  }
}
`;