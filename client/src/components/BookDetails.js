import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getBookQuery, getBooksQuery, deleteBookMutation } from '../queries/queries';
import styled from 'styled-components';
import { Delete } from 'styled-icons/feather/Delete';

const Wrapper = styled.div`
  background-color: palevioletred;
  width: 40%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-shadow: -3px -1px 7px rgba(0,0,0, .35);

  h2 {
    align-self: center;
  }
`
const InfoContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 2em;

  ul {
    padding-left: 2em;
  }
`
const HorizontalRule = styled.hr`
  width: 90%;
`
const Heading = styled.h3`
  font-size: 1.5em;
  border: 1px solid darkslateblue;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 1px 2px 5px rgba(0,0,0,.35);
`
const Paragraph = styled.p`
  margin: 5px ${props => props.margined ? '20px' : '0'};
`
const HeadingContainer = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  width: 50px;
  height: 50px;
  color: darkslateblue;
  cursor: pointer;
`

const BookDetails = ({ bookId, removeBookId }) => (
  <Wrapper>
    <h2>Book Details</h2>
    { bookId ?
        <Query query={getBookQuery} variables={{id: bookId}} >
          {({ loading, error, data }) => {
            if (loading) return <Paragraph margined>Loading...</Paragraph>;
            if (error) return <Paragraph margined>Error ;( </Paragraph>;

            const { book } = data;
            return (
              <React.Fragment>
                <HorizontalRule />
                <InfoContainer>
                  <HeadingContainer>
                    <Heading>{book.name}</Heading>
                    <Mutation
                      mutation={deleteBookMutation}
                      update={(cache, { data: { deleteBook } }) => {
                        const { books } = cache.readQuery({query: getBooksQuery });
                        cache.writeQuery({
                          query: getBooksQuery,
                          data: { books: books.filter(item => item.id !== book.id ) }
                        })
                        // clear parent state, so component will re-render
                        removeBookId();
                      }}
                    >
                      { deleteBook => (
                        <Button title="delete" onClick={() => deleteBook({ variables: { id: book.id } }) } >
                          <Delete />
                        </Button>
                      )}
                    </Mutation>
                  </HeadingContainer>
                  <Paragraph><strong>Genre:</strong> {book.genre}</Paragraph>
                  <Paragraph><strong>Author:</strong> {book.author.name}</Paragraph>
                  <Paragraph><strong>Other books:</strong></Paragraph>
                  <ul>
                    {
                      book.author.books.map(({ name, id }) => (
                        <li key={id}>{name}</li>
                      ))
                    }
                  </ul>
                </InfoContainer>
              </React.Fragment>
            )
          }}
        </Query>
      :
        <Paragraph margined>No book selected...</Paragraph>
    }
  </Wrapper>
)

export default BookDetails;