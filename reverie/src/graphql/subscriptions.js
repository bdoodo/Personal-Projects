/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWordList = /* GraphQL */ `
  subscription OnCreateWordList {
    onCreateWordList {
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
export const onUpdateWordList = /* GraphQL */ `
  subscription OnUpdateWordList {
    onUpdateWordList {
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
export const onDeleteWordList = /* GraphQL */ `
  subscription OnDeleteWordList {
    onDeleteWordList {
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
export const onCreateWord = /* GraphQL */ `
  subscription OnCreateWord {
    onCreateWord {
      id
      name
      wordListID
      labels
      wordList {
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
      wordListID
      labels
      wordList {
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
      wordListID
      labels
      wordList {
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
      createdAt
      updatedAt
    }
  }
`;
