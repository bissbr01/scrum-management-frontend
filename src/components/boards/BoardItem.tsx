import {
  Avatar,
  createStyles,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { IconMessageCircle2 } from '@tabler/icons'
import { SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { Issue } from '../../services/types'
import IssueStoryPointsDisplay from '../issues/IssueStoryPointsDisplay'
import IssueTypeIcon from '../issues/IssueTypeIcon'

const useStyles = createStyles((theme) => ({
  draggable: {
    userSelect: 'none',
    padding: '1em',
    margin: '0 0 8px 0',
    minHeight: '50px',
    background: theme.white,
    '&:hover': {
      background: theme.colors.brand[0],
    },
  },
  issueStatus: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
  },

  alignRight: {
    margin: '0 0 0 auto',
  },
}))

interface BoardItemProps {
  item: Issue
  index: number
  setIssueOpened: React.Dispatch<SetStateAction<boolean>>
}

function BoardItem({
  item: issue,
  index,
  setIssueOpened,
}: BoardItemProps): JSX.Element {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const navigate = useNavigate()

  const handleClick = () => {
    setIssueOpened(true)
    navigate(`issues/${issue.id}`)
  }

  return (
    <Draggable
      draggableId={String(issue.id)}
      index={index}
      disableInteractiveElementBlocking
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.draggable}
          style={{
            backgroundColor: snapshot.isDragging ? theme.colors.brand[0] : '',
            ...provided.draggableProps.style,
          }}
        >
          <UnstyledButton onClick={handleClick} sx={{ width: '100%' }}>
            <Text size="md" pb="sm">
              {issue.title}
            </Text>
            <Group className={classes.issueStatus}>
              <IssueTypeIcon size="xs" issueType={issue.type} />
              <Text size="xs">{issue.name}</Text>
              {issue.comments && issue.comments.length !== 0 && (
                <Group>
                  <IconMessageCircle2 size={14} />
                  <Text size="xs" sx={{ marginLeft: -13 }}>
                    {issue.comments.length}
                  </Text>
                </Group>
              )}
              <Group className={classes.alignRight}>
                <IssueStoryPointsDisplay storyPoints={issue.storyPoints} />
                {issue.assignee && (
                  <Avatar
                    src={issue.assignee.picture}
                    alt={issue.assignee.nickname}
                    size="sm"
                    color="blue"
                    radius="xl"
                  >
                    {issue.assignee.nickname}
                  </Avatar>
                )}
              </Group>
            </Group>
          </UnstyledButton>
        </div>
      )}
    </Draggable>
  )
}

export default BoardItem
