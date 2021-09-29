import React, { useState } from "react"

type Todo = {
  id: string
  value: string
  isDone: boolean
  list?: Pick<Todo, "id" | "value" | "isDone">[]
}

const initialList = [
  {
    id: "1",
    value: "todo",
    isDone: false,
    list: [],
  },
  {
    id: "2",
    value: "todo group",
    isDone: false,
    list: [
      {
        id: "a",
        value: "group todo 1",
        isDone: false,
      },
      {
        id: "b",
        value: "group todo 2",
        isDone: false,
      },
    ],
  },
]

let id = 1

function TodoList() {
  const [list, setList] = useState<Todo[]>([])

  const handleGroupAdd = () => {
    const no = id++
    setList((prevList) => [
      ...prevList,
      {
        id: `${no}`,
        value: `第 ${no} 個群組`,
        isDone: false,
        list: [
          {
            id: `${no}-1`,
            value: `${no}-1`,
            isDone: false,
          },
        ],
      },
    ])
  }
  const handleAdd = () => {
    const no = id++
    setList((prevList) => [
      ...prevList,
      {
        id: `${no}`,
        value: ``,
        isDone: false,
      },
    ])
  }

  return (
    <div>
      {list.map((item, i) => (
        <Todo
          key={item.id}
          id={item.id}
          value={item.value}
          isDone={item.isDone}
          onChange={(newValue) => {
            setList((prevList) => [
              ...prevList.slice(0, i),
              {
                ...prevList[i],
                value: newValue,
              },
              ...prevList.slice(i + 1),
            ])
          }}
          onCheck={() => {
            setList((prevList) => [
              ...prevList.slice(0, i),
              {
                ...prevList[i],
                isDone: !prevList[i].isDone,
                list: prevList[i].list?.map((todo) => ({
                  ...todo,
                  isDone: !prevList[i].isDone,
                })),
              },
              ...prevList.slice(i + 1),
            ])
          }}
          onRemove={() => {
            setList((prevList) => [
              ...prevList.slice(0, i),
              ...prevList.slice(i + 1),
            ])
          }}
        >
          {item.list ? (
            <ul>
              {item.list.map((subItem) => (
                <Todo
                  key={subItem.id}
                  id={subItem.id}
                  value={subItem.value}
                  isDone={subItem.isDone}
                  onChange={(newValue) =>
                    setList((prevList) => [
                      ...prevList.slice(0, i),
                      {
                        ...prevList[i],
                        list: prevList[i].list?.map((todo) => ({
                          ...todo,
                          value: todo.id === subItem.id ? newValue : todo.value,
                        })),
                      },
                      ...prevList.slice(i + 1),
                    ])
                  }
                  onCheck={() =>
                    setList((prevList) => {
                      const newSubList =
                        prevList[i].list?.map((todo) => ({
                          ...todo,
                          isDone:
                            todo.id === subItem.id ? !todo.isDone : todo.isDone,
                        })) || []

                      const newTodo = {
                        ...prevList[i],
                        isDone: true,
                        list: newSubList,
                      }

                      if (checkListDone(newSubList)) {
                        return [
                          ...prevList.slice(0, i),
                          newTodo,
                          ...prevList.slice(i + 1),
                        ]
                      }

                      return [
                        ...prevList.slice(0, i),
                        {
                          ...prevList[i],
                          isDone: false,
                          list: newSubList,
                        },
                        ...prevList.slice(i + 1),
                      ]
                    })
                  }
                  onRemove={() =>
                    setList((prevList) => [
                      ...prevList.slice(0, i),
                      {
                        ...prevList[i],
                        list: prevList[i].list?.filter(
                          (todo) => todo.id !== subItem.id
                        ),
                      },
                      ...prevList.slice(i + 1),
                    ])
                  }
                />
              ))}
              <button
                onClick={() => {
                  const no = id++
                  setList((prevList) => {
                    const newList = [
                      ...(prevList[i].list || []),
                      {
                        id: `${prevList[i].id}-${no}`,
                        value: `${prevList[i].id}-${no}`,
                        isDone: false,
                      },
                    ]

                    const newGroup = {
                      ...prevList[i],
                      isDone: false,
                      list: newList,
                    }

                    return [
                      ...prevList.slice(0, i),
                      newGroup,
                      ...prevList.slice(i + 1),
                    ]
                  })
                }}
              >
                Add Todo
              </button>
            </ul>
          ) : undefined}
        </Todo>
      ))}
      <button onClick={handleGroupAdd}>Add Todo Group</button>
      <button onClick={handleAdd}>Add Todo</button>
    </div>
  )
}

function Todo(
  props: Todo & {
    onChange?: (value: string) => void
    onCheck?: () => void
    onRemove?: () => void
    children?: React.ReactElement
  }
) {
  const { value, isDone, onChange, onCheck, onRemove, children } = props

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <input type="checkbox" checked={isDone} onChange={onCheck} />
      <button onClick={onRemove}>delete</button>
      {children}
      <hr />
    </div>
  )
}

const checkListDone: (
  list: Pick<Todo, "id" | "value" | "isDone">[]
) => boolean = (list) => {
  return list.length === list.filter((todo) => todo.isDone).length
}

export default TodoList
