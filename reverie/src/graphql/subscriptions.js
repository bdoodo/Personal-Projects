/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWord = /* GraphQL */ `
  subscription OnCreateWord {
    onCreateWord {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateWord = /* GraphQL */ `
  subscription OnUpdateWord {
    onUpdateWord {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteWord = /* GraphQL */ `
  subscription OnDeleteWord {
    onDeleteWord {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAssociations = /* GraphQL */ `
  subscription OnCreateAssociations {
    onCreateAssociations {
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
export const onUpdateAssociations = /* GraphQL */ `
  subscription OnUpdateAssociations {
    onUpdateAssociations {
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
export const onDeleteAssociations = /* GraphQL */ `
  subscription OnDeleteAssociations {
    onDeleteAssociations {
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
