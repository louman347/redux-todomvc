import * as React from 'react';
import { List as UIList } from 'material-ui';
import { List, Map } from 'immutable';

import TodoItem from './TodoItem';

interface Props {
  todos: List<Map<string, any>>;
  filter?: string;
}

class TodoList extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  getItems() {
    if (this.props.todos) {
      return this.props.todos.filter(
        (item) => this.props.filter === 'all' || item.get('status') === this.props.filter
      );
    }
    return null;
  }

  // Checkbox `checked` property
  render() {
    return (
      <div>
        <section className="main">
          <UIList>
            { this.getItems().map((item) =>
              <TodoItem text={ item.get('text') } key={ item.get('text') } />
            ) }
          </UIList>
        </section>
      </div>
    );
  }
}

export default TodoList;