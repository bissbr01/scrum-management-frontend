import {
  Paper,
  createStyles,
  Button,
  Title,
  Text,
  Anchor,
  Group,
  Divider,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconBrandGithub, IconBrandGoogle, IconX } from '@tabler/icons'
import { Formik, Form, Field } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch } from '../../hooks/hooks'
import { setLogin } from '../../reducers/authentication'
import { useLoginMutation } from '../../services/loginEndpoints'
import PasswordField from '../common/forms/PasswordInput'
import TextField from '../common/forms/TextField'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})

export default function Login() {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login] = useLoginMutation()
  return (
    <div className={classes.wrapper}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          try {
            const res = await login(values).unwrap()
            dispatch(setLogin(res))
            navigate('/')
          } catch (e: unknown) {
            showNotification({
              title: 'Error',
              message: 'Incorrect username or password.',
              autoClose: 4000,
              color: 'red',
              icon: <IconX />,
            })
            if (e instanceof Error) {
              console.log(e.message)
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Paper className={classes.form} radius={0} p={30}>
              <Title
                order={2}
                className={classes.title}
                align="center"
                mt="md"
                mb={50}
              >
                Welcome to Scrum Bus
              </Title>
              <Group grow mb="md" mt="md">
                <Button variant="default" radius="xl">
                  <IconBrandGoogle />
                  Google
                </Button>
                <Button variant="default" radius="xl">
                  <IconBrandGithub />
                  Github
                </Button>
              </Group>
              <Divider
                label="Or continue with email"
                labelPosition="center"
                my="lg"
              />
              <Field
                id="email"
                name="email"
                label="Email address"
                placeholder="hello@gmail.com"
                component={TextField}
              />
              <Field
                id="password"
                name="password"
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                component={PasswordField}
              />
              <Button
                type="submit"
                fullWidth
                mt="xl"
                size="md"
                disabled={isSubmitting}
              >
                Login
              </Button>

              <Text align="center" mt="md">
                Don&apos;t have an account?{' '}
                <Anchor component={Link} to="/register" weight={700}>
                  Register
                </Anchor>
              </Text>
            </Paper>
          </Form>
        )}
      </Formik>
    </div>
  )
}