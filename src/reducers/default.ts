import {
  fromJS,
  Record,
  Map,
} from 'immutable';
import {
  IAction,
} from '../Interfaces';

import {
  DefaultActionTypes,
  ITodo,
  AddTodoAction,
  IUser,
  AddUserAction,
  UserFactory,
  TodoFactory,
} from '../actions/default';

// import {
//   Settings,
// } from '../../models';

export interface IReducerState {
  lastUserId: number;
  lastTodoId: number;
  users: Map<number, Record<IUser>>;
  todos: Map<number, Record<ITodo>>;
}

const initialUsers = [
  UserFactory({
    id: 1,
    name: 'Ryan',
  }),
  UserFactory({
    id: 2,
    name: 'Sandy',
  }),
  UserFactory({
    id: 3,
    name: 'Sean',
  }),
  UserFactory({
    id: 4,
    name: 'Peter',
  }),
]

const initialTodos = [
  TodoFactory({
    id: 1,
    userId: 1,
    title: 'Drink Water',
  })
]
const INITIAL_STATE = fromJS({
  lastUserId: initialUsers.length,
  lastTodoId: initialTodos.length,
  users: Map<number, Record<IUser>>().withMutations((mutableMap) => {
    initialUsers.forEach((user) => {
      mutableMap.set(user.get('id'), user);
    })
  }),
  todos: Map<number, Record<ITodo>>().withMutations((mutableMap) => {
    initialTodos.forEach((todo) => {
      mutableMap.set(todo.get('id'), todo);
    })
  }),
});

export const reducer = (state: Record<IReducerState> = INITIAL_STATE, action: IAction) => {
  switch (action.type) {
    case DefaultActionTypes.ADD_USER: {
      const lastUserId = state.get('lastUserId');
      const {
        payload,
      } = action as AddUserAction;
      const {
        user,
      } = payload;

      if (user.get('name') === '') {
        console.debug('no name!')
        return state;
      }

      const userId = lastUserId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastUserId', userId);
        mutableState.setIn(
          ['users', userId],
          user.set('id', userId),
        );
      })
    }
    case DefaultActionTypes.ADD_TODO: {
      const lastTodoId = state.get('lastTodoId');
      const {
        payload,
      } = action as AddTodoAction;
      const {
        userId,
        todo,
      } = payload;

      if (todo.get('title') === '') {
        console.debug('no title!')
        return state;
      }

      const todoId = lastTodoId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastTodoId', todoId);
        mutableState.setIn(
          ['todos', todoId],
          todo.withMutations((mutableTodo) => {
            mutableTodo.set('id', todoId)
            mutableTodo.set('userId', userId)
          }),
        );
      });
    }
    default:
      return state;
  }
};

export default reducer;
