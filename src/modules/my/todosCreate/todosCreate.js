import { gql } from 'apollo-boost';
import { LightningElement, track } from 'lwc';
import { getClient } from 'my/client';
import { ALL_TODOS_QUERY } from 'my/todos';

const CREATE_TODO_MUTATION = gql`
    mutation createTodo($title: String!) {
        createTodo(input: { todo: { title: $title } }) {
            todo {
                id
                nodeId
                title
            }
        }
    }
`;

const handleMutationUpdate = (cache, { data }) => {
    if (data === undefined) {
        return;
    }
    const {
        createTodo: { todo }
    } = data;
    const cacheData = cache.readQuery({ query: ALL_TODOS_QUERY });
    const { allTodos } = cacheData;
    const newAllTodos = { ...allTodos };
    const { nodes: oldTodos } = newAllTodos;
    newAllTodos.nodes = [...oldTodos, todo];
    cache.writeQuery({
        data: { allTodos: newAllTodos },
        query: ALL_TODOS_QUERY
    });
};

export default class TodosCreate extends LightningElement {
    client = getClient();
    @track error = false;
    @track loading = false;
    @track title = '';
    @track valid = false;
    get invalidOrLoading() {
        return !this.valid || this.loading;
    }

    handleInput = event => {
        this.title = event.target.value;
        const trimmedTitle = this.title.trim();
        this.valid = trimmedTitle !== '';
    };

    handleSubmit = async event => {
        event.preventDefault();
        const mutationOptions = {
            mutation: CREATE_TODO_MUTATION,
            update: handleMutationUpdate,
            variables: {
                title: this.title
            }
        };
        this.error = false;
        this.loading = true;
        try {
            await this.client.mutate(mutationOptions);
            this.title = '';
            this.valid = false;
        } catch (err) {
            this.error = true;
        }
        this.loading = false;
    };
}
