import ApolloClient from 'apollo-boost';

const URI = 'http://localhost:5000/graphql';
let client = null;
export const getClient = () => {
    if (client !== null) {
        return client;
    }
    client = new ApolloClient({
        uri: URI
    });
    return client;
};
