import { useAuth0 } from '@auth0/auth0-react'
import {
  Avatar,
  Button,
  createStyles,
  Group,
  Loader,
  Modal,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteCommentMutation } from '../../services/commentsEndpoints'
import { Comment } from '../../services/types'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import CommentMenu from './CommentMenu'

const useStyles = createStyles((theme) => ({
  comment: {
    marginTop: '1em',
    flexBasis: 1,
  },

  body: {
    paddingLeft: 54,
    paddingTop: '.25rem',
  },

  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface ListCommentProps {
  comment: Comment
}

export default function ListComment({ comment }: ListCommentProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [deleteComment] = useDeleteCommentMutation()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const { user } = useAuth0()

  const timeCreated = () => {
    const date = new Date(comment.createdAt)
    let createdString = date.toLocaleTimeString('en-US')
    createdString += ' '
    createdString += date.toLocaleDateString('en-US')
    return createdString
  }

  const handleDelete = async () => {
    await deleteComment(comment.id)
    setOpened(false)
  }

  if (!user) return <Loader />

  return (
    <article className={classes.comment}>
      <Group>
        <Avatar color={theme.colors.brand[1]} radius="xl" />
        <Text size="sm">{comment.author?.name}</Text>
        <Text size="xs" color="dimmed">
          {timeCreated()}
        </Text>
        {comment.authorId === user.id && (
          <CommentMenu handleDelete={setOpened} handleEdit={undefined} />
        )}
      </Group>
      <div className={classes.body}>
        <Text component="p" size="sm" mr="3rem">
          {comment.text}
        </Text>
      </div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={3}>
            <IconAlertTriangle className={classes.icon} />
            Delete Comment {comment.id}?
          </Title>
        }
      >
        <Text component="p">Once you delete, it is gone for good.</Text>
        <Group position="right">
          <Button onClick={handleDelete} color="red">
            Delete
          </Button>
          <Button onClick={() => setOpened(false)} variant="default">
            Cancel
          </Button>
        </Group>
      </Modal>
    </article>
  )
}
