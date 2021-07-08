/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWord = /* GraphQL */ `
  query GetWord($id: ID!) {
    getWord(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listWords = /* GraphQL */ `
  query ListWords(
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAssociations = /* GraphQL */ `
  query GetAssociations($id: ID!) {
    getAssociations(id: $id) {
      id
      list
      word {
        id
        name
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAssociationss = /* GraphQL */ `
  query ListAssociationss(
    $filter: ModelAssociationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssociationss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        list
        word {
          id
          name
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
