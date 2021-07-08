/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWord = /* GraphQL */ `
  mutation CreateWord(
    $input: CreateWordInput!
    $condition: ModelWordConditionInput
  ) {
    createWord(input: $input, condition: $condition) {
      id
      name
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
      createdAt
      updatedAt
    }
  }
`;
export const createAssociations = /* GraphQL */ `
  mutation CreateAssociations(
    $input: CreateAssociationsInput!
    $condition: ModelAssociationsConditionInput
  ) {
    createAssociations(input: $input, condition: $condition) {
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
export const updateAssociations = /* GraphQL */ `
  mutation UpdateAssociations(
    $input: UpdateAssociationsInput!
    $condition: ModelAssociationsConditionInput
  ) {
    updateAssociations(input: $input, condition: $condition) {
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
export const deleteAssociations = /* GraphQL */ `
  mutation DeleteAssociations(
    $input: DeleteAssociationsInput!
    $condition: ModelAssociationsConditionInput
  ) {
    deleteAssociations(input: $input, condition: $condition) {
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
