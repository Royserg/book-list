import React, { Component } from 'react'
import { Query } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';
import styled from 'styled-components';

/*= components =*/
import BookDetails from './BookDetails';

/*= styled components =*/
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Inner = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 60%;
  height: 100%;
  padding-left: 1em;
  padding-right: .2em;

  h2 {
    align-self: center;
  }
`

const StyledList = styled.ul`
  list-style-type: none;
  margin-left: 0;
  margin-bottom: 1em;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`

const ListItem = styled.li`
  padding: 5px;
  border: 1px solid ${props => props.optimistic ? '#AAAAAA' : 'palevioletred'};
  color: ${props => props.optimistic ? '#AAAAAA' : '#FFFFFF'};
  box-shadow: 1px 2px 5px rgba(0,0,0,.35);
  border-radius: 4px;
  margin: 4px 5px;
  text-align: center;

  :hover {
    cursor: pointer;
  }
`

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    }
  }
  render() {
    return (
      <Wrapper>
        <Inner>
          <h2>Books List</h2>
          <StyledList>
            <Query query={getBooksQuery}>
              {({ loading, error, data }) => {
                if (loading) return <div>Loading Books...</div>;
                if (error) return <div>Error ;( </div>;

                return data.books.map(({ name, id }) => (
                  <ListItem
                    key={id}
                    optimistic={typeof id === 'number'}
                    onClick={() => this.setState({ selected: id }) }
                  >
                    { name }
                  </ListItem>
                ))
              }}
            </Query>
          </StyledList>
        </Inner>

        <BookDetails bookId={this.state.selected} removeBookId={() => this.setState({selected: null})}/>
      </Wrapper>
    )
  }
}

export default BookList;