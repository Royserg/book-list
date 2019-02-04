import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

/* = components = */
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import styled from 'styled-components';

/*= apollo client setup =*/
const client = new ApolloClient({
  uri: '/graphql'
})

/*= styled components =*/
const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Wrapper>
          <BookList />
          <AddBook />
        </Wrapper>
      </ApolloProvider>
    );
  }
}

export default App;
