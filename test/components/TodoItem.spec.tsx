import * as React from 'react';
import {
  findRenderedComponentWithType,
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate } from 'react-dom/test-utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TodoItem from '../../src/components/TodoItem';

import { expect } from 'chai';
import 'mocha';
import { List, Map } from 'immutable';

describe('TodoItem', () => {
  it('renders an item', () => {
    const text = 'React';
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} />
      </MuiThemeProvider>
    );
    const todo = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'todo-item');

    expect(todo.length).to.equal(1);
    expect(todo[0].textContent).to.contain('React');
  });

  it('strikes through the item if it is completed', () => {
    const text = 'React';
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} isCompleted={true} />
      </MuiThemeProvider>
    );
    const todo = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'todo-item');

    expect(todo[0].classList.contains('completed')).to.equal(true);
  });

  it('should look different when editing', () => {
    const text = 'React';
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} isEditing={true} />
      </MuiThemeProvider>
    );
    const todo = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'todo-item');

    expect(todo[0].classList.contains('editing')).to.equal(true);
  });

  it('should be checked if the item is completed', () => {
    const text = 'React';
    const text2 = 'Redux';
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <div>
          <TodoItem text={text} isCompleted={true} />
          <TodoItem text={text2} isCompleted={false} />
        </div>
      </MuiThemeProvider>
    );
    const inputs = scryRenderedDOMComponentsWithTag((component as React.Component<any, any>), 'input');
    const checkboxes = inputs.filter( // Because `inputs` contains the TextFields as well
      (input: HTMLInputElement) => input.type === 'checkbox'
    );

    expect((checkboxes[0] as HTMLInputElement).checked).to.equal(true);
    expect((checkboxes[1] as HTMLInputElement).checked).to.equal(false);
  });

  it('invokes callback when the delete button is clicked', () => {
    const text = 'React';
    let deleted = false;
    const deleteItem = () => deleted = true;
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} deleteItem={deleteItem} />
      </MuiThemeProvider>
    );
    const buttons = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'delete-btn');

    Simulate.click(buttons[0]);

    expect(deleted).to.equal(true);
  });

  it('invokes callback when checkbox is clicked', () => {
    const text = 'React';
    let isChecked = false;
    const toggleComplete = () => isChecked = true;
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} toggleComplete={toggleComplete} />
      </MuiThemeProvider>
    );
    const inputs = scryRenderedDOMComponentsWithTag((component as React.Component<any, any>), 'input');
    const checkbox = inputs.filter( // Because `inputs` contains the TextFields as well
      (input: HTMLInputElement) => input.type === 'checkbox'
    );

    Simulate.click(checkbox[0]);

    expect(isChecked).to.equal(true);
  });

  it('invokes callback when text is double clicked', () => {
    let text = 'React';
    const editItem = () => text = 'Redux';
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} editItem={editItem} />
      </MuiThemeProvider>
    );
    const todo = findRenderedComponentWithType((component as React.Component<any, any>), TodoItem);
    const label = todo.refs.text;

    Simulate.doubleClick(label);

    expect(text).to.equal('Redux');
  });

  it('invokes callback when text cancel is clicked while editing', () => {
    const text = 'React';
    let canceled = false;
    const cancelEditing = () => canceled = true;
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem text={text} isEditing={true} cancelEditing={cancelEditing} />
      </MuiThemeProvider>
    );
    const buttons = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'cancel-btn');

    Simulate.click(buttons[0]);

    expect(canceled).to.equal(true);
  });

  it('does not invoke callbacks when textField is empty and done is clicked while editing', () => {
    const text = 'React';
    let done = false;
    const cancelEditing = () => done = true;
    const editingText = () => done = true;
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem
          text={text}
          isEditing={true}
          cancelEditing={cancelEditing}
          editingText={editingText}
        />
      </MuiThemeProvider>
    );
    const buttons = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'done-btn');

    Simulate.click(buttons[0]);

    expect(done).to.equal(false);
  });

  it('invokes callbacks when textField has text and done is clicked while editing', () => {
    const text = 'React';
    const tempText = 'R';
    let done = false;
    let tempTextChanged = false;
    const doneEditing = () => done = true;
    const editingText = () => tempTextChanged = true;
    const component = renderIntoDocument(
      <MuiThemeProvider>
        <TodoItem
          text={text}
          tempText={tempText}
          isEditing={true}
          doneEditing={doneEditing}
          editingText={editingText}
        />
      </MuiThemeProvider>
    );
    const buttons = scryRenderedDOMComponentsWithClass((component as React.Component<any, any>), 'done-btn');

    Simulate.click(buttons[0]);

    expect(done).to.equal(true);
    expect(tempTextChanged).to.equal(true);
  });
});
