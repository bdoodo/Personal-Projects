/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWordList = /* GraphQL */ `
  query GetWordList($id: ID!) {
    getWordList(id: $id) {
      id
      words {
        items {
          id
          name
          wordListID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      associations {
        label
        occurrences
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
        words {
          nextToken
        }
        associations {
          label
          occurrences
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
