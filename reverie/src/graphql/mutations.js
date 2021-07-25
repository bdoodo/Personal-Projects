/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWordList = /* GraphQL */ `
  mutation CreateWordList(
    $input: CreateWordListInput!
    $condition: ModelWordListConditionInput
  ) {
    createWordList(input: $input, condition: $condition) {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateWordList = /* GraphQL */ `
  mutation UpdateWordList(
    $input: UpdateWordListInput!
    $condition: ModelWordListConditionInput
  ) {
    updateWordList(input: $input, condition: $condition) {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteWordList = /* GraphQL */ `
  mutation DeleteWordList(
    $input: DeleteWordListInput!
    $condition: ModelWordListConditionInput
  ) {
    deleteWordList(input: $input, condition: $condition) {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createWord = /* GraphQL */ `
  mutation CreateWord(
    $input: CreateWordInput!
    $condition: ModelWordConditionInput
  ) {
    createWord(input: $input, condition: $condition) {
      id
      name
      wordListID
      labels
      wordList {
        id
        name
        words {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateWord = /* GraphQL */ `
  mutation UpdateWord(
    $input: UpdateWordInput!
    $condition: ModelWordConditionInput
  ) {
    updateWord(input: $input, condition: $condition) {
      id
      name
      wordListID
      labels
      wordList {
        id
        name
        words {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteWord = /* GraphQL */ `
  mutation DeleteWord(
    $input: DeleteWordInput!
    $condition: ModelWordConditionInput
  ) {
    deleteWord(input: $input, condition: $condition) {
      id
      name
      wordListID
      labels
      wordList {
        id
        name
        words {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
