export interface Comment {
  id: number
  text: string
  authorId: number
  author?: User
  issueId: number
  issue?: Issue
  createdAt: string
  updatedAt: string
}

export enum IssueStatus {
  Backlog = 'backlog',
  Todo = 'todo',
  InProgress = 'inProgress',
  Done = 'done',
}

export enum IssueType {
  UserStory = 'userStory',
  Bug = 'bug',
  Task = 'task',
}

export interface Issue {
  id: number
  status: IssueStatus
  attachmentUri?: string
  description?: string
  title?: string
  type: IssueType
  boardOrder?: number
  storyPoints: number
  assignee?: User
  author?: User
  sprint?: Sprint
  sprintId: number
  comments?: Comment[]
}

export interface Sprint {
  id: number
  goal: string
  startOn?: string
  length?: number
  end?: string
  active: boolean
  projectId: number
  project: Project
  issues?: Issue[]
  author: User
}

export interface Project {
  id: number
  title: string
  author: User
}

export interface User {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
  password?: string
  admin?: boolean
  disabled?: boolean
  projects?: Project[]
  sprints?: Sprint[]
  authoredIssues?: Issue[]
  assignedIssues?: Issue[]
}

export interface Token {
  token: string
}

export interface Credentials {
  email: string
  password: string
}

export function assertUnreachable(x: never): never {
  throw Error('Exhaustive switch reached default condition!')
}
