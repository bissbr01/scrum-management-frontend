import { scrumApi } from './scrumApi'
import { Comment } from './types'

const commentsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.query<Comment[], void>({
      query: () => '/comments',
      providesTags: ['Comment'],
    }),
    getCommentById: build.query<Comment, string>({
      query: (id) => `/comments/${id}`,
      providesTags: ['Comment'],
    }),
    addComment: build.mutation<Comment, Omit<Comment, 'id'>>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    updateComment: build.mutation<Comment, Partial<Comment>>({
      query: ({ id, ...body }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
  overrideExisting: true,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetCommentsQuery,
  useGetCommentByIdQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
} = commentsEndpoints
