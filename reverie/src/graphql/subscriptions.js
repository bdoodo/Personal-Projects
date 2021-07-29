/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWordList = /* GraphQL */ `
  subscription OnCreateWordList($owner: String!) {
    onCreateWordList(owner: $owner) {
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
export const onUpdateWordList = /* GraphQL */ `
  subscription OnUpdateWordList($owner: String!) {
    onUpdateWordList(owner: $owner) {
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
export const onDeleteWordList = /* GraphQL */ `
  subscription OnDeleteWordList($owner: String!) {
    onDeleteWordList(owner: $owner) {
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
export const onCreateWord = /* GraphQL */ `
  subscription OnCreateWord($owner: String!) {
    onCreateWord(owner: $owner) {
      id
      name
      wordListID
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateWord = /* GraphQL */ `
  subscription OnUpdateWord($owner: String!) {
    onUpdateWord(owner: $owner) {
      id
      name
      wordListID
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteWord = /* GraphQL */ `
  subscription OnDeleteWord($owner: String!) {
    onDeleteWord(owner: $owner) {
      id
      name
      wordListID
      createdAt
      updatedAt
      owner
    }
  }
`;
