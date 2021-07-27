/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWordList = /* GraphQL */ `
  query GetWordList($id: ID!) {
    getWordList(id: $id) {
      id
      name
      words {
        items {
          id
          name
          wordListID
          labels
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listWordLists = /* GraphQL */ `
  query ListWordLists(
    $filter: ModelWordListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWordLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        words {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
