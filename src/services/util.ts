import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query'
import { MutationActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import { BacklogList, BoardColumn, Issue, IssueForUpdate } from './types'

type UpdateIssueMutation = (
  arg: IssueForUpdate
) => MutationActionCreatorResult<
  MutationDefinition<
    IssueForUpdate,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      Record<string, unknown>,
      FetchBaseQueryMeta
    >,
    'Comment' | 'Project' | 'Sprint' | 'Issue' | 'User',
    Issue,
    'scrumApi'
  >
>

export const emptyIssueProperties = (issue: Issue) => ({})

export const getIssuesForUpdate = (
  list: BoardColumn | BacklogList,
  propertiesToUpdate: (issue: Issue) => Partial<Issue> | Record<string, never>
) => {
  if ('status' in list) {
    const colForUpdate = list.issues.reduce<IssueForUpdate[]>(
      (prev, issue, index) =>
        prev.concat({
          id: issue.id,
          status: list.status,
          boardOrder: index,
          ...propertiesToUpdate(issue),
        }),
      []
    )
    return colForUpdate
  }
  const listForUpdate = list.issues.reduce<IssueForUpdate[]>(
    (prev, issue, index) =>
      prev.concat({
        id: issue.id,
        boardOrder: index,
        ...propertiesToUpdate(issue),
      }),
    []
  )
  return listForUpdate
}

export const updateIssues = async (
  issues: IssueForUpdate[],
  update: UpdateIssueMutation
) => {
  const promises = issues.map((issue) => update(issue).unwrap())
  const res = await Promise.all(promises)
  return res
}

export const updateListIssues = async (
  issueList: (BacklogList | BoardColumn)[],
  update: UpdateIssueMutation,
  propertiesToUpdate: (issue: Issue) => Partial<Issue>
) => {
  const listsToUpdate = issueList.map((list) =>
    getIssuesForUpdate(list, propertiesToUpdate)
  )
  const promises = listsToUpdate.map((list) =>
    list.map((issue) => update(issue).unwrap())
  )
  const res = await Promise.all(promises)
  return res
}

export interface QueryParams {
  projectId?: string
}

export interface SprintQueryParams extends QueryParams {
  active?: boolean
  displayOnBoard?: boolean
  search?: string
}

export const buildQueryString = (
  baseUrl: string,
  query: SprintQueryParams | any
) => {
  let queryString = ''
  Object.entries(query).forEach(([key, value]) => {
    const suffix = queryString ? '&' : ''

    let stringVal = value
    if (Array.isArray(value)) {
      stringVal = value.reduce((prev, cur) => {
        const delimiter = prev ? ',' : ''
        return prev + delimiter + cur
      }, '')
    }
    queryString += `${suffix}${key}=${stringVal}`
  })

  if (queryString) queryString = `?${queryString}`
  return `${baseUrl}${queryString}`
}

export const buildAvatarString = (seed: number) => {
  const query = {
    accessoriesChance: '0',
    mouth: 'default',
    clothes: 'shirtCrewNeck',
    eyes: 'default',
    eyebrow: 'default',
    facialHairChance: '0',
    top: [
      'bob',
      'bun',
      'curly',
      'curvy',
      'straight01',
      'straight02',
      'shortCurly',
      'shortFlat',
      'shortRound',
      'shortWaved',
    ],
  }

  return buildQueryString(
    `https://avatars.dicebear.com/api/avataaars/${seed}.svg`,
    query
  )
}

export const formatPlural = (count: number, base: string) => {
  let s = `${base}`
  if (count !== 1) s += 's'
  return s
}
