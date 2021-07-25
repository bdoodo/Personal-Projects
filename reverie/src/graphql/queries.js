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
          labels
          createdAt
          updatedAt
        }
        nextToken
      }
      associations {
        label
        occurrences
      }
      createdAt
      updatedAt
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
      }
      nextToken
    }
  }
`;
