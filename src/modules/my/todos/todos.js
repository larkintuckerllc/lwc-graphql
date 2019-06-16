import { gql } from 'apollo-boost';
import { LightningElement, track } from 'lwc';
import { getClient } from 'my/client';

export const ALL_TODOS_QUERY = gql`
    {
        allTodos {
            nodes {
                id
                nodeId
                title
            }
        }
    }
`;

export default class Todos extends LightningElement {
    client = getClient();
    @track error = false;
    @track loading = false;
    subscription;
    @track todos = [];

    async connectedCallback() {
        const queryOptions = {
            query: ALL_TODOS_QUERY
        };
        const observable = this.client.watchQuery(queryOptions);
        this.subscription = observable.subscribe(
            this.observableNextCallback,
            this.observableErrorCallback,
            this.observableCompleteCallback
        );
        this.loading = true;
        try {
            await this.client.query(queryOptions);
            this.loading = false;
        } catch (err) {
            this.loading = false;
        }
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }

    observableNextCallback = x => {
        this.todos = x.data.allTodos.nodes;
        this.error = false;
    };

    observableErrorCallback = err => {
        if (!err) return;
        this.error = true;
    };

    observableCompleteCallback = () => {
        window.console.log('Finished');
    };
}
