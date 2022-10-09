import {
  createStyles,
  Loader,
  Paper,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { SetStateAction, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import {
  BoardColumn,
  useUpdateIssueMutation,
} from '../../services/issuesEndpoints'
import { useGetSprintByActiveQuery } from '../../services/sprintsEndpoints'
import { Issue, IssueStatus } from '../../services/types'
import IssueDrawer from '../issues/IssueDrawer'
import BacklogCreateIssue from './BacklogCreateIssue'
import BacklogIssue from './BacklogIssue'

const useStyles = createStyles((theme) => ({
  section: {
    background: theme.colors.gray[1],
    padding: '0.5rem',
    borderRadius: theme.defaultRadius,
    marginBottom: '2rem',
  },

  paper: {
    padding: '12px',
  },
}))

export interface BacklogColumns {
  [x: string]: BoardColumn
}

export default function Backlog() {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { data: { sprint, boardColumns } = {}, isLoading } =
    useGetSprintByActiveQuery()
  const [updateIssue] = useUpdateIssueMutation()
  const [issueOpened, setIssueOpened] = useState(false)
  const [columns, setColumns] = useState<BacklogColumns | null>(null)

  useEffect(() => {
    if (boardColumns && sprint?.id) {
      setColumns({
        sprint: {
          name: `Sprint ${sprint?.id}`,
          status: IssueStatus.Todo,
          issues: [
            ...boardColumns.todo.issues,
            ...boardColumns.inProgress.issues,
            ...boardColumns.done.issues,
          ],
        },
        backlog: boardColumns.backlog,
      })
    }
  }, [setColumns, boardColumns, sprint?.id])

  // only send id, status, and boardOrder to server
  const getColForUpdate = (col: BoardColumn) => {
    const colForUpdate = col.issues.reduce<
      Pick<Issue, 'id' | 'status' | 'boardOrder'>[]
    >(
      (prev, { id, status }, index) =>
        prev.concat({
          id,
          status: col.name === `Sprint ${sprint?.id}` ? status : col.status,
          boardOrder: index,
        }),
      []
    )
    return colForUpdate
  }

  const updateCol = async (col: BoardColumn) => {
    const colToUpdate = getColForUpdate(col)
    const promises = colToUpdate.map((issue) => updateIssue(issue).unwrap())
    const res = await Promise.all(promises)
    return res
  }

  const updateCols = async (cols: BoardColumn[]) => {
    const colsToUpdate = cols.map((col) => getColForUpdate(col))
    const promises = colsToUpdate.map((col) =>
      col.map((issue) => updateIssue(issue).unwrap())
    )
    const res = await Promise.all(promises)
    return res
  }

  const handleDragEnd = async (
    result: DropResult,
    cols: BacklogColumns,
    setItems: React.Dispatch<SetStateAction<BacklogColumns | null>>
  ) => {
    if (!result.destination) return
    const { source, destination } = result

    // item dragged to new column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = cols[source.droppableId]
      const destColumn = cols[destination.droppableId]
      const sourceItems = [...sourceColumn.issues]
      const destItems = [...destColumn.issues]
      const [removedIssue] = sourceItems.splice(source.index, 1)
      const movedIssue = {
        ...removedIssue,
        status: destColumn.status,
        boardOrder: destination.index,
      }
      destItems.splice(destination.index, 0, movedIssue)

      // update local state
      setItems({
        ...cols,
        [source.droppableId]: {
          ...sourceColumn,
          issues: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          issues: destItems,
        },
      })

      // update backend
      await updateCols([
        {
          ...sourceColumn,
          issues: sourceItems,
        },
        {
          ...destColumn,
          issues: destItems,
        },
      ])

      // item dragged within same column
    } else {
      const column = cols[source.droppableId]
      const copiedItems = [...column.issues]
      const [removedIssue] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removedIssue)

      // update local state
      setItems({
        ...cols,
        [source.droppableId]: {
          ...column,
          issues: copiedItems,
        },
      })

      // update backend
      await updateCol({
        ...column,
        issues: copiedItems,
      })
    }
  }

  if (isLoading || !boardColumns || !sprint || !columns) return <Loader />

  return (
    <main>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}
      >
        <Title order={1} size="h2" p="sm">
          Backlog
        </Title>
        {Object.entries(columns).map(([columnId, column]) => (
          <section className={classes.section} key={columnId}>
            <Title order={2} size="h3" p="xs">
              {column.name}
            </Title>
            <Paper className={classes.paper}>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    // className={classes.droppable}
                    style={{
                      background: snapshot.isDraggingOver
                        ? theme.colors.blue[0]
                        : theme.colors.gray[0],
                    }}
                  >
                    {column.issues.map((issue, index) => (
                      <BacklogIssue
                        key={issue.id}
                        issue={issue}
                        index={index}
                        setIssueOpened={setIssueOpened}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
            <BacklogCreateIssue sprintId={sprint.id} status={column.status} />
          </section>
        ))}
      </DragDropContext>
      <IssueDrawer
        issueOpened={issueOpened}
        setIssueOpened={setIssueOpened}
        redirectUrl="/backlog"
      />
    </main>
  )
}