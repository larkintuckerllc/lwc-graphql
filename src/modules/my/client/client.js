import ApolloClient from 'apollo-boost';

const URI = 'http://localhost:5000/graphql';
export default new ApolloClient({
    uri: URI
});
