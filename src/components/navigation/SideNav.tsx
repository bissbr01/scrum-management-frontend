/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  createStyles,
  Navbar,
  Menu,
  Loader,
  NavLink,
  LoadingOverlay,
  Title,
  Group,
} from '@mantine/core'
import {
  IconBellRinging,
  IconSettings,
  IconUserCircle,
  IconLogout,
  IconStack2,
  IconChalkboard,
} from '@tabler/icons'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import UserButton from './UserButton'
import { removeLogin } from '../../reducers/authentication'
import { useAppDispatch } from '../../hooks/hooks'
import { User } from '../../services/types'
import { useGetProjectByIdQuery } from '../../services/projectsEndpoints'
import ProjectAvatar from '../projects/ProjectAvatar'
import LoadingCircle from '../common/LoadingCircle'

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon')
  return {
    container: {
      backgroundColor: theme.colors.gray[0],
      marginRight: 0,
      zIndex: 10,
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  }
})

interface SideNavProps {
  width: number
  close: () => void
}

function SideNav({ width, close }: SideNavProps) {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { projectId } = useParams()
  const location = useLocation()
  const { data: project } = useGetProjectByIdQuery(projectId as string)

  const navData = [
    { link: 'board', label: 'Board', icon: IconChalkboard },
    { link: 'backlog', label: 'Backlog', icon: IconStack2 },
    { link: 'settings', label: 'Settings', icon: IconSettings, disabled: true },
  ]

  const navLinks = navData.map((item) => (
    <NavLink
      key={item.label}
      component={Link}
      label={item.label}
      to={`/projects/${projectId}/${item.link}`}
      icon={<item.icon className={classes.linkIcon} stroke={1.5} />}
      disabled={item.disabled}
      active={
        location.pathname.match(`/projects/${projectId}/${item.link}`) !== null
      }
      onClick={() => {
        close()
      }}
    />
  ))

  if (!project) return <LoadingCircle />

  return (
    <Navbar width={{ sm: width }} p="md" className={classes.container}>
      {projectId && (
        <>
          <Navbar.Section className={classes.header}>
            <Group noWrap>
              <ProjectAvatar project={project} />
              <Title order={3} size="h4">
                {project.title}
              </Title>
            </Group>
          </Navbar.Section>
          <Navbar.Section grow>{navLinks}</Navbar.Section>
        </>
      )}
    </Navbar>
  )
}

export default SideNav
