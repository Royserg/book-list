import React, { Component } from 'react'
import { graphql, Query } from 'react-apollo';
import styled from 'styled-components';
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';

/*= styled components =*/
const StyledForm = styled.form`
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 350px;
  padding: 10px 1em;
  background-color: #8A7FCD;
  color: black;
`

const FieldContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 5px;
  input, select {
    width: 50%;
    margin-left: 1em;
  }

`

const Button = styled.button`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  border: none;
  box-shadow: 1px 2px 1px rgba(0,0,0,0.34);
  font-size: 2em;
  background-color: palevioletred;
  color: white;
`

class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      genre: '',
      authorId: ''
    }
  }

  onSubmitForm(e) {
    e.preventDefault();

    const { name, genre, authorId } = this.state;
    this.props.mutate({
      variables: {
        name,
        genre,
        authorId
      },
      optimisticResponse: {
        addBook: {
          __typename: 'Book',
          name,
          genre,
          authorId,
          id: (Math.random() * 10000)
        }
      },
      update: (cache, { data: { addBook } } ) => {
        // read data from the cache for this query
        const data = cache.readQuery({query: getBooksQuery });
        // add new book to the books
        data.books.push(addBook);
        // write data back to the cache
        cache.writeQuery({ query: getBooksQuery, data });
      }
    });

    // clear inputs in the form
    this.setState({
      name: '',
      genre: '',
      authorId: ''
    })
  }

  render() {
    const { name, genre } = this.state;

    return (
      <StyledForm id='addBook'onSubmit={ this.onSubmitForm.bind(this) }>
        <FieldContainer>
          <label htmlFor="name">Book name:</label>
          <input name="name" type="text" value={name} onChange={ (e) => this.setState({ name: e.target.value }) } />
        </FieldContainer>

        <FieldContainer>
          <label htmlFor="genre">Genre:</label>
          <input name="genre" type="text" value={genre} onChange={ (e) => this.setState({ genre: e.target.value }) }/>
        </FieldContainer>

        <FieldContainer>
          <label htmlFor="author">Author:</label>
          <select name="author" value={this.state.authorId} onChange={ (e) => this.setState({ authorId: e.target.value }) }>
            <option value="">Select author</option>
            <Query query={getAuthorsQuery}>
              {({ loading, error, data }) => {
                if (loading) return <option>Loading...</option>;
                if (error) return <option>Error ;( </option>;

                return data.authors.map(({ name, id }) => (
                  <option key={id} value={id}>{name}</option>
                ));
              }}
            </Query>
          </select>
        </FieldContainer>

        <Button>+</Button>
      </StyledForm>
    )
  }
}

export default graphql(addBookMutation)(AddBook);
